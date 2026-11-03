---
type: projects
slug: caseflow
title: Zhixu · CaseFlow
description: An after-sales case agent that checks orders and policy evidence, asks for user confirmation, and records a recoverable service request.
---

A customer says, “My headphones stopped working. Can I exchange them?” A useful response has to do more than sound plausible. The system must identify the customer, find their order, check the policy version and eligibility, and ask for missing facts. It should record a case only after the customer has reviewed and confirmed the proposed action.

Zhixu · CaseFlow is built around that flow. Its current demo covers **fault-related exchange requests** and **delivery exception reports**, using synthetic orders, authored demo policies, and demo identities. The customer workspace shows the conversation, sources, progress, and result. A separate support workspace lets staff review cases and record a human handoff.

## Evidence before an answer

Policy retrieval filters candidate passages by product model and policy version, then presents sources that can be opened in the original document. This matters because a similar-looking paragraph may come from an outdated policy or apply to a different product.

On a small, fixed synthetic set of policies and labelled questions, a comparison using real embeddings found that Recall@5 for 16 queries rose from 56.25% with global candidates to 100% after model and policy filtering. This is evidence about retrieval on that set. It does not establish answer accuracy for real customers or production traffic. When the evidence is insufficient, the system is expected to explain the gap.

## A model can explain; business rules decide what is written

LangGraph coordinates a persistent task. A model helps extract the request and phrase the proposed solution. Deterministic business logic handles identity, order ownership, eligibility, explicit confirmation, and the database write.

Confirmation has a specific meaning: if new information changes the proposal, an earlier confirmation cannot authorize the revised one. Before recording a case, the system checks the relevant conditions again. Stable operation identifiers, a database transaction, and a uniqueness constraint prevent duplicate cases when a command is retried. Persistent task state helps the conversation recover, but it does not replace those write safeguards.

Both supported flows follow the same pattern: check the customer's order and the relevant evidence, propose an action, wait for confirmation, then record the request. **A recorded case is an application for service; it does not mean a refund, exchange, or delivery operation has already been completed.**

## What has been verified

The two workspaces, task recovery, read-only progress updates, and source viewing have been implemented. In an isolated environment, six fixed synthetic cases passed a same-run evaluation using a real model and database, followed by human review. Engineering checks also cover permission rejection, confirmation replay, and recovery. These results have clear scope and a small sample size.

Production use has further gates: trustworthy full-input accounting for model calls is not yet accepted, the formal real-model baseline remains incomplete, and a public HTTPS deployment has not been accepted. This page describes implemented and verified project behaviour, not a live customer service.

The central design decision is to place generative AI inside a workflow with evidence, permissions, confirmation, and a recovery path—keeping a suggested response distinct from a service request actually written to the database.
