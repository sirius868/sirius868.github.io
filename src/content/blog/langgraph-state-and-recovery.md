---
slug: langgraph-state-and-recovery
title: LangGraph 深入浅出：让 Agent 能暂停、恢复和改错
description: 从一个人工审核的小例子出发，讲清 LangGraph 的状态、节点、条件边、检查点，以及为什么恢复执行仍要考虑重复操作。
pubDate: 2026-10-30
tags: [AI, Agent, LangGraph, 工程实践]
featured: true
draft: false
---

一个 Agent 做事，通常不止调用一次模型。它可能先查资料，再写草稿，发现依据不足就继续查；写完后还要等人确认。把这些步骤写成一长串 `if` 和 `while`，开始很快，等到要处理“中途断了”“需要人审核”“某一步要重试”时，就容易乱。

LangGraph 解决的是这个**执行过程**的问题。它让我们明确写出：当前有哪些数据、每一步做什么、下一步去哪里，以及任务暂停后从哪里继续。你可以把它想成一张带存档点的流程图。模型可以是其中一个节点，但图本身不要求每个节点都调用模型。

## 先看三个零件

- **状态（State）**：任务当前的数据。例如草稿、审核意见、是否通过。节点读取状态，但应只返回自己要更新的字段。
- **节点（Node）**：一次具体工作。例如生成草稿、检查资料、等待审核。节点可以调用模型或工具，也可以只是普通函数。
- **边（Edge）**：决定下一步。固定边总是去同一个节点；条件边根据状态选择分支。

运行时，LangGraph 会沿着边调度节点。多个节点也可以在同一轮并行执行；官方把这一轮称为 *super-step*。先把它理解为“同一批要跑的步骤”就够了。图结束时，才返回最终状态。

下面这个小图用于“文章发布前审核”：

```text
开始 → 写草稿 → 人工审核 ──通过──→ 结束
                    │
                    └──退回──→ 修改草稿 ──→ 人工审核
```

它很简单，但已经包含实际项目里常见的循环、暂停和恢复。

## 一个能运行的最小例子

安装 `langgraph` 后，可以直接运行下面的 Python 示例。为了让流程本身更清楚，草稿和修改步骤暂时用普通函数；以后可以把这两个节点换成模型调用。

```python
from typing import TypedDict

from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt


class ArticleState(TypedDict, total=False):
    topic: str
    draft: str
    feedback: str
    approved: bool


def write_draft(state: ArticleState) -> dict:
    return {"draft": f"这是一篇关于{state['topic']}的初稿。"}


def review(state: ArticleState) -> dict:
    answer = interrupt({"draft": state["draft"], "question": "这篇草稿可以发布吗？"})
    return {"approved": answer["approved"], "feedback": answer.get("feedback", "")}


def revise(state: ArticleState) -> dict:
    return {"draft": f"{state['draft']}\n补充说明：{state['feedback']}"}


def after_review(state: ArticleState) -> str:
    return "done" if state["approved"] else "revise"


builder = StateGraph(ArticleState)
builder.add_node("write_draft", write_draft)
builder.add_node("review", review)
builder.add_node("revise", revise)
builder.add_edge(START, "write_draft")
builder.add_edge("write_draft", "review")
builder.add_conditional_edges("review", after_review, {"done": END, "revise": "revise"})
builder.add_edge("revise", "review")

graph = builder.compile(checkpointer=InMemorySaver())
config = {"configurable": {"thread_id": "article-001"}, "recursion_limit": 20}

# 第一次运行会停在 review，等待外部审核结果。
paused = graph.invoke({"topic": "LangGraph"}, config=config)
print(paused["__interrupt__"][0].value)

# 审核者要求修改；图经过 revise，再次停在 review。
paused = graph.invoke(
    Command(resume={"approved": False, "feedback": "增加一个具体例子"}),
    config=config,
)
print(paused["__interrupt__"][0].value)

# 第二次审核通过，图才结束。
finished = graph.invoke(Command(resume={"approved": True}), config=config)
print(finished["draft"])
```

这里的 `interrupt()` 会把要审核的草稿交给调用方，并暂停执行。调用方可以是后台管理页、命令行，或另一个服务。它不负责“弹出确认框”；界面和权限仍由你的应用实现。

## 状态更新为什么容易踩坑

每个节点返回的是**状态更新**，不是一份必须重新填写所有字段的完整状态。在上面的例子中，`revise` 只返回 `draft`，原来的 `topic` 还在。

默认情况下，同一个字段的新值会覆盖旧值。如果你想让多个节点都向 `sources` 列表追加资料，就需要为该字段指定 *reducer*，也就是合并规则。否则两个并行节点同时写同一字段，可能因为无法确定如何合并而报错。

常见写法如下：

```python
import operator
from typing import Annotated, TypedDict


class ResearchState(TypedDict):
    sources: Annotated[list[str], operator.add]
```

`operator.add` 在这里表示把列表接起来。不过，并行节点的完成顺序不一定固定。如果展示顺序重要，让每条资料带上序号或来源，再在下一步显式排序；不要把“谁先写入”当成业务顺序。对于聊天消息，LangGraph 还提供 `add_messages`，能按消息 ID 处理新增和覆盖，比简单拼接列表更合适。

## 检查点能保存进度，但不是“操作只做一次”

示例中的 `InMemorySaver` 是检查点保存器。它用 `thread_id` 找到同一条任务的状态，所以两次 `Command(resume=...)` 都能回到 `article-001`。换一个 `thread_id`，就是另一条任务。内存保存器只适合演示：进程重启，状态就没了。真正需要跨重启恢复时，要用数据库支持的持久化保存器。

有一个非常关键的细节：**从 `interrupt()` 恢复时，所在节点会从头重新执行。** 如果 `review` 在 `interrupt()` *之前* 先调用了“发送通知”或“创建工单”，恢复时这些操作可能再做一遍。更安全的做法是把副作用放在审核之后的独立节点，并给外部请求带上稳定的幂等键。例如用 `thread_id + 操作类型` 生成键，让外部服务对重复请求只处理一次。

检查点解决的是“图的状态怎么恢复”；支付、发邮件、写数据库等外部操作能否避免重复，还要看这些操作自己的设计。两者不能混为一谈。

恢复的单位也值得弄清：LangGraph 会在每个 *super-step* 的边界保存完整状态。如果同一轮有两个并行节点，其中一个失败，已经完成的那个节点的结果可以作为“待提交写入”保存，恢复时不必重新运行它。但这一轮不会因为某个节点成功就被当成整体成功；外部系统已经收到的副作用仍需要自己处理重复或补偿。

检查点也不等于“长期记忆”。它主要跟随某个 `thread_id`，保存这条任务的执行状态。若要跨任务读取同一个人的偏好或共享资料，应该单独设计存储和访问权限。不要把所有长期资料塞进图状态，否则检查点会越来越大，读取、调试和清理都会变难。

最后，`recursion_limit` 限制的是图执行的轮数，而不是模型的 token、费用或外部接口调用量。示例设置它是为了防止审核循环无限进行；生产应用还应分别限制每次模型调用、总耗时与工具调用次数，并在达到上限时给出明确结果。

## 什么时候该用它

如果流程只是“收到问题 → 调一次模型 → 返回答案”，普通函数就够了。LangGraph 更适合这些情况：

1. 任务会经过多个步骤，而且下一步取决于中间结果。
2. 需要人审核、补充信息，过一段时间再继续。
3. 任务可能中断，需要保存进度和排查失败位置。
4. 有并行步骤，需要明确状态如何合并。

设计时先画出节点和边，再问三个问题：**哪些数据必须保存？哪些操作可能重复？什么时候算完成？** 如果这些问题答不清楚，直接把大模型接进图里也不会自动变可靠。

## 进一步阅读

- [LangGraph Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api)：状态、节点、条件边和 reducer。
- [Interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts)：人工介入与恢复时的执行规则。
- [Persistence](https://docs.langchain.com/oss/python/langgraph/persistence)：检查点和跨任务存储的区别。
- [Checkpointers](https://docs.langchain.com/oss/python/langgraph/checkpointers)：`thread_id`、检查点边界与失败恢复。
