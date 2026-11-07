---
type: blog
slug: ai-architecture-from-answer-to-workflow
title: "Designing AI Systems: From Answers to Accountable Workflows"
description: A support assistant illustrates how models, knowledge, tools, state, and business rules fit together, and how to evaluate cost and reliability.
---

A customer asks, “My headphones arrived three days late and they are broken. Can I exchange them?” A chat model may produce a convincing support reply. But if the system also has to inspect an order, check the current policy, and file a request, the real question is no longer how to generate a sentence. It is whether the facts and actions behind that sentence can be trusted.

This article is about **application architecture for AI**: where information comes from, who makes decisions, how a task continues after a failure, and how we know the system improved. The ideas do not depend on one model or framework. We will use the same support request throughout.

## Divide the request into three kinds of work

One customer message can contain three very different jobs:

1. **Explain:** “What is the exchange policy?” Find the applicable policy, explain its conditions, and show the source.
2. **Decide:** “Does my order qualify?” Read the customer's own order and apply explicit business rules to its model, dates, and status.
3. **Act:** “Please submit a request.” Change system state with authorization, separate confirmation, and a reliable database write.

If a model handles all three in one uninterrupted response, the result may sound natural while responsibility becomes unclear. It might quote an old policy or describe “you may apply” as “your request has been submitted.” The first architectural decision is to give different jobs different paths. **Not every question needs an autonomous, tool-using Agent.** A fixed knowledge question can use retrieval; eligibility can use a business service; a multi-step task needs a state machine or a constrained Agent.

```text
Customer request
  ↓
Identity and routing ──→ Explanation: retrieve → answer with sources
  │
  ├─────────────────→ Eligibility: own order → business rules → explanation
  │
  └─────────────────→ Request: check → proposal → confirmation → transaction
                                    ↑                         ↓
                                    └──── state and recovery ──┘
```

Routing is a suggestion about what the user wants. A model saying “the user authorized this” must never bypass authentication. Identity and permissions come from the server session and business records.

## Knowledge: decide what counts as a fact

RAG is often summarized as “retrieve a few passages and give them to the model.” In support work, the hard part is finding the passage that is **currently valid, applies to this product, and is visible to this user**. If we retrieve the five most similar passages across every document and ask the model to guess the right version, an old rule can easily enter the answer.

A safer order is to narrow candidates by access rights, product model, effective date, and publication status; then retrieve relevant passages with keyword or vector search; rerank if needed; and pass the original text, version, and location to the model. Structured facts such as order status or payment amount should come from the business system, not from a guess based on a policy PDF.

```text
Visibility and valid version → retrieval → optional reranking → evidence and source
Customer's own order database ───────────────────────────────→ structured facts
```

A retrieval score means “possibly relevant,” not “policy applies.” A citation means “there is a source,” not “the reasoning is correct.” If sources conflict, the system should show the conflict and stop automatic judgment instead of letting the model pick the most fluent passage. When a policy is revised or withdrawn, historical decisions should still identify the version used at the time.

## Model: treat output as a proposal

Models are good at turning natural language into structure, summarizing material, and explaining rules. They have no inherent authority over external state. A model can report “the customer describes a fault, wants an exchange, and has not supplied the purchase date,” with evidence references. Its `eligible: true` output should not become the eligibility decision.

A useful interface contract separates extracted facts, evidence, and suggested wording:

```json
{
  "extracted_facts": { "issue": "fault", "requested_action": "exchange" },
  "evidence_ids": ["policy-2026-v3#exchange", "order-123"],
  "proposed_reply": "I will check your order and the applicable terms first."
}
```

The application must validate the structure and field lengths and verify that every cited source exists and is accessible. Business rules then determine eligibility. Record the model version, prompt version, and tool contract in the task trace; otherwise a changed result is difficult to explain. A larger model may help with ambiguous language, but it does not automatically fix stale policies or unauthorized access. Those are primarily data and permission problems.

## Execution: confirmation, idempotency, and recovery have separate jobs

Suppose the system proposes: “Create an exchange request for this order.” Before the customer confirms, the proposal should identify the order, action, relevant conditions, and version. The customer confirms **that specific proposal**. If the order or policy changes afterward, the old confirmation is invalid; the system must check again and show the revised proposal.

The common failure during a write is not a dramatic model error. It is a network timeout: the client does not know whether submission succeeded and tries again. Give each business operation a stable key, write inside a database transaction, and enforce uniqueness in the database. Replaying the same key returns the existing case. A state machine or LangGraph checkpoint remembers where the task was interrupted; **it does not replace transactions and uniqueness constraints**. One mechanism resumes the process, while the other prevents duplicate side effects.

If a support notification follows the database write, a transactional outbox or similar mechanism can deliver it asynchronously. Otherwise “case saved, notification failed” might be misreported as “submission failed.” The interface should distinguish “request recorded,” “awaiting staff action,” and “action completed.” These are business states, not model phrasing.

## Evaluation: locate errors instead of judging fluency

Test at least four layers separately:

| Layer | What to check | Typical failure |
| --- | --- | --- |
| Retrieval | Is applicable evidence among the candidates, with the right version and access scope? | An old policy or another customer's order appears. |
| Generation | Is the answer faithful to evidence, and can it admit uncertainty? | The citation is real, but the conclusion goes too far. |
| Workflow | Are missing details, policy changes, and human handoffs handled correctly? | The system skips renewed confirmation. |
| Write | Is the final state correct after timeouts, retries, and concurrency? | One confirmation creates two cases. |

One aggregate “answer accuracy” score rarely tells us which layer to improve. Start with a small set of human-reviewed questions. Preserve each question, the available document versions, the expected action, and the final state. When changing retrieval, prompts, or models, compare against the same inputs and add newly discovered failure cases. Always state what a metric measures: Recall@5 on a small synthetic set is not live customer satisfaction.

At runtime, trace routing, evidence versions, model and tool calls, latency, failure stage, and final business state. Keep secrets and unnecessary personal details out of logs. For paths with side effects, the final database state is stronger evidence than a model saying “done.”

## Cost and latency are architectural constraints

If a request needs a database lookup, reranking, three model calls, and two tool calls, users experience the total delay, not the speed of one model call. A rough decomposition is:

```text
Total latency ≈ routing + retrieval + model + tool wait + queueing and retries
```

Measure each part before optimizing. Route simple questions through fixed flows, cache reusable public material, and limit the evidence sent to the model. Give complex tasks a total time, step, and cost budget. When an external service is overloaded, bounded queues and concurrency matter more than blind retries. A useful fallback may show verified information and ask staff to continue, rather than let the model guess without evidence.

## Build it in stages

Start with one narrow but complete path: answer one policy question with a valid source. Then connect the customer's own order and apply business rules. Add confirmation and an idempotent write next. Only then let the model choose between a small set of constrained tools. Each new layer should come with failure cases and observable states.

The maturity of an AI architecture is not the number of boxes in its diagram. For one concrete request, can we answer five questions: **Where did the facts come from? Who decided? Who may act? How does failure recover? How is the result verified?** When those answers are clear, the model becomes a dependable part of a system.
