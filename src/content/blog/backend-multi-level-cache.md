---
slug: backend-multi-level-cache
title: Caffeine + Redis：用商品详情页讲清后端多级缓存
description: 用 Java 商品详情服务讲清 Caffeine 本地缓存、Redis 共享缓存和数据库的读写流程，以及多实例失效与热点数据更新。
pubDate: 2026-10-30
tags: [后端, 缓存, Caffeine, Redis, 工程实践]
featured: false
draft: false
---

假设一个商品详情页一分钟被访问十万次。商品名称、图片地址、介绍可能一天只改一次。如果每次访问都去数据库查同一行数据，数据库就像一位店员，被十万人反复问“这件商品叫什么”。

缓存的办法很直白：把常用答案提前放在离请求更近的地方。这里讨论的是 Java 服务里很常见的一种组合：**Caffeine 做进程内的第一层，Redis 做多实例共享的第二层，数据库保存最终数据。**

```text
请求 → Caffeine（L1）→ Redis（L2）→ 数据库
       当前 JVM 内存      多实例共享       最终数据来源
```

这里的“最快”“最慢”是通常情况，具体耗时仍取决于网络、数据大小和机器负载。缓存也不一定越多越好；每增加一层，就多一套过期和更新规则。

## Caffeine 到底是什么

Caffeine 是 Java 进程里的缓存库。它把对象放在当前 JVM 的内存中，查找时不需要走网络。它能限制最多保留多少条数据，也能让条目在写入一段时间后过期；超出容量时，会按淘汰策略移走一部分数据。

**它不是 Redis 的替代品。** 如果应用部署了三个实例，每个实例都有自己的一份 Caffeine。A 实例刚缓存了商品，B 实例的 Caffeine 里可能还没有。这就是为什么还需要 Redis 作为共享缓存。

## 为什么要两层，而不是只用 Redis

如果服务只有一个实例，少量热点数据放进进程内存就够快。但真实服务常有多个实例：A 实例的内存，B 实例看不到。Redis 可以做共享层，避免每个实例都去查数据库。

本地缓存和 Redis 的分工可以这样理解：

| 层级 | 放在哪里 | 优点 | 要付出的代价 |
| --- | --- | --- | --- |
| L1 Caffeine | 当前 Java 进程的内存 | 不走网络，读取快；可限制容量和过期时间 | 每个实例各存一份，更新不容易同步；重启会消失 |
| L2 Redis | 独立的缓存服务 | 多个实例共用，能承受较多读取 | 需要网络请求，还要维护 Redis 的容量和可用性 |
| 数据库 | 持久化存储 | 保存业务事实，负责最终查询 | 每次查都要花数据库资源 |

商品详情中的名称、描述适合短时间缓存。库存和价格如果要求很高的实时准确性，就要单独设计，不能因为“商品详情可以缓存”就把所有字段一起缓存十分钟。

## 一次读取到底怎么走

最常用的方式叫 *cache-aside*，也就是“应用自己先查缓存，没找到再查数据库”。过程只有四步：

1. 查 Caffeine。命中就直接返回。
2. Caffeine 没有，查 Redis。命中后把数据放进 Caffeine，再返回。
3. Redis 也没有，查数据库。查到后写入 Redis 和 Caffeine，再返回。
4. 数据库也没有，返回“商品不存在”。

下面是一个 Java 示例。项目需要引入 `com.github.ben-manes.caffeine:caffeine` 依赖；`ProductRepository` 负责查数据库，`ProductRedisCache` 封装 Redis 读写，这两个接口需要按项目实际技术栈实现。重点看 Caffeine 的配置和逐级回填路径：

```java
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;

record Product(long id, String name, String description) {}

interface ProductRepository {
    Product findById(long id); // 找不到时返回 null
}

interface ProductRedisCache {
    Product get(long id);      // 找不到时返回 null
    void put(long id, Product product, Duration ttl);
    void evict(long id);
}

final class ProductService {
    private final ProductRepository database;
    private final ProductRedisCache redis;
    private final Cache<Long, Product> local = Caffeine.newBuilder()
        .maximumSize(10_000)
        .expireAfterWrite(Duration.ofSeconds(30))
        .recordStats()
        .build();

    ProductService(ProductRepository database, ProductRedisCache redis) {
        this.database = database;
        this.redis = redis;
    }

    Product getProduct(long id) {
        return local.get(id, this::loadFromRedisOrDatabase);
    }

    private Product loadFromRedisOrDatabase(long id) {
        Product product = redis.get(id);
        if (product != null) return product;

        product = database.findById(id);
        if (product != null) redis.put(id, product, Duration.ofMinutes(5));
        return product;
    }

    void evictProduct(long id) {
        redis.evict(id);
        local.invalidate(id);
    }
}
```

`local.get(id, loader)` 的意思是：本地有值就拿本地的；没有才执行 `loader`。同一个 JVM 内，多个请求同时读同一商品时，Caffeine 会协调这次加载，减少重复回源。**这个协调只发生在当前进程**；三个实例同时失去热点键，仍可能一起请求 Redis 或数据库。

示例中数据库没有找到商品时返回 `null`；Caffeine 不会把这个 `null` 当作正常商品缓存，因此不存在的 ID 仍会重复查库。实际服务可以另设短时间的“未找到”标记；不要把它和真实商品对象混在一起。示例也省略了 Redis 超时、序列化、更新事务及异常处理。

Caffeine 的 30 秒与 Redis 的 5 分钟只是说明“本地短、共享层长”的例子，实际值要根据更新频率、可容忍的旧数据时间和流量来定。Redis 的过期时间还可以加一点随机抖动，避免大量键在同一秒集体失效。`maximumSize(10_000)` 限制的是**条目数**，不是占用字节；如果商品对象大小差异很大，还要结合内存预算评估。

## 更新时，真正难的是“旧答案”

读缓存很简单，写入数据后才容易出现问题。假设管理员把商品名称从“基础版”改为“进阶版”，数据库已经更新，但 L1 和 Redis 里还是旧名称。用户就可能在一段时间内看到旧数据。

一种常见做法是：**数据库事务提交成功后，删除 Redis 缓存，并清理当前实例的 Caffeine。** 下一次读取会重新加载。这里通常选择“删除”，而不是在写入时顺手重算缓存，因为数据库才是事实来源，删除后让读请求按统一路径回填更容易维护。务必在事务提交后才执行失效操作；若提交失败，缓存不该提前被当成“已更新”。

但不要误以为这样就绝对一致。考虑这个时间线：

```text
请求 A：发现 Redis 没有商品，开始查询旧数据
请求 B：更新数据库，并删除 Redis 缓存
请求 A：把先前查到的旧数据写回 Redis
```

结果是“刚删完的旧数据又回来了”。而且上面的 `local.invalidate(id)` **只能清理当前 JVM**：A 实例更新后，B 实例的 Caffeine 仍可能存着旧名称。因此，多级缓存需要先确定业务能接受多长时间的旧数据：

- **允许短暂过期**：给 Caffeine 较短 TTL，让其他实例的旧值很快自行消失；Redis 也设 TTL，作为最终兜底。普通商品介绍往往可以这样处理。
- **需要更快同步**：数据更新后，通过消息通知各实例调用 `local.invalidate(id)`；消息可能丢失，所以仍保留 TTL 兜底。通知里带商品 ID，避免误删全部本地缓存。
- **要求强一致**：关键字段在关键操作处直接读权威数据，或采用版本号、事务和专门的并发控制。单靠缓存失效通知通常不够。

“页面上展示的库存大约是多少”和“下单时是否还有库存”是两件事。后者必须在下单流程里做可信的校验，不能只看商品页缓存的数字。

## 三种常见的“缓存被打穿”

这些术语听着像一回事，其实触发原因不同：

| 名称 | 发生了什么 | 常见处理 |
| --- | --- | --- |
| 缓存穿透 | 请求的 ID 根本不存在，每次都一路查到数据库 | 对不存在结果做短 TTL 缓存；先校验 ID 格式；必要时用布隆过滤器 |
| 缓存击穿 | 一个特别热门的商品刚好过期，大量请求同时去查数据库 | 对同一键的回源请求合并；必要时加短期锁或保留可接受的旧值 |
| 缓存雪崩 | 大量缓存同时过期，或 Redis 故障，流量一起落到数据库 | TTL 加抖动；限流、降级；做好 Redis 容量与故障预案 |

比如“商品 123 不存在”，可以缓存一个明确的“未找到”标记几秒或几十秒，而不是把 `null` 当成缓存未命中。记得设置较短 TTL，因为这个商品未来可能真的被创建。

热门键过期时，Caffeine 的 `get(id, loader)` 可以合并**同一实例**内的加载，但挡不住多个实例一起回源。如果数据库仍承受不了，可以在 Redis 回源处做跨实例协调或限流。“加锁”会让其他请求等待，锁持有者出错还可能拖慢所有人。若业务允许短暂展示旧数据，可以考虑“先返回旧值，后台刷新”，但要在页面或业务规则上接受这种延迟。

## Redis 出问题时怎么办

缓存是加速层。Redis 变慢或不可用时，Caffeine 命中的请求仍可快速返回；**Caffeine 未命中的请求**不能无限等待 Redis。给 Redis 请求设置合理超时，并决定失败后是直接查数据库、返回旧数据，还是暂时拒绝部分请求。

直接把所有请求放行到数据库看似能保住功能，实际上可能把数据库也压垮。因此，降级时最好配合限流或请求合并。对不重要的推荐信息，可以暂时不显示；对下单这种关键流程，则要按业务要求保住正确性。

## 上线前看四个指标

多级缓存是否值得保留，要用数据判断：

1. **各层命中率**：Caffeine、Redis 分别挡住了多少请求？Caffeine 的 `recordStats()` 可用于观察本地层。
2. **回源量**：每秒有多少请求最终到了数据库，热点键过期时峰值是多少？
3. **延迟**：看 P95、P99，而不只看平均响应时间。
4. **旧数据时间**：更新后，用户最长多久还可能看到旧值？这个数字是否符合业务要求？

如果 Caffeine 命中率很低，却让更新逻辑复杂了很多，就可以先去掉本地层。一个简单、可解释的结构，往往比堆满技巧的多层结构更可靠。

多级缓存的核心不是“把数据复制三份”，而是**让常用读取更快，同时明确每一份副本可能旧多久、出错时该怎么办**。先画清读写流程，再按真实流量决定要不要加下一层。

## 延伸阅读

- [Caffeine：容量与过期策略](https://github.com/ben-manes/caffeine/wiki/Eviction)
- [Caffeine：读取、加载与主动失效](https://github.com/ben-manes/caffeine/wiki/Population)
- [Redis：键过期的 `EXPIRE` 命令](https://redis.io/docs/latest/commands/expire/)
- [Redis：内存淘汰策略](https://redis.io/docs/latest/develop/reference/eviction/)
- [AWS：常见缓存读写模式](https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html)
