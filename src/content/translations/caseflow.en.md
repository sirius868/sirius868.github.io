---
type: projects
slug: caseflow
title: Zhixu · CaseFlow
description: An after-sales case agent that combines policy evidence and business rules to clarify requests, obtain confirmation, record cases, and support follow-up work.
---

A customer says, “My headphones stopped working. Can I exchange them?” The system checks their identity and order, finds the applicable policy and eligibility rules, and asks for any missing facts. After the customer reviews and confirms the proposed action, it records a case.

Zhixu · CaseFlow is built around that flow. It covers **fault-related exchange requests** and **delivery exception reports** as demo scenarios, using synthetic orders, authored demo policies, and demo identities. Customers can search their own cases, follow public updates, and provide more information. Support staff can take ownership, add internal notes, send public messages, request details, and close cases. Internal notes stay separate from customer-facing updates.

## Evidence before an answer

Policy retrieval filters candidate passages by product model and policy version, then presents sources that can be opened in the original document. Source and version details help users check the basis for a proposed action. Policy management supports drafting, validation, publication, and withdrawal. Historical sources remain traceable, while a pending proposal must be checked again after a relevant policy change.

On a fixed demo set of four synthetic policies and 16 labelled questions, retrieval using real embeddings improved Recall@5 from 56.25% to 100% after adding product model and policy filters. When supporting evidence is insufficient, the system explains what needs further review or hands the case to a person.

## A model can explain; business rules decide what is written

LangGraph coordinates a persistent task. A model helps extract the request and phrase the proposed solution. Deterministic business logic handles identity, order ownership, eligibility, explicit confirmation, and the database write.

Confirmation has a specific meaning: when new information changes the proposal, the customer confirms the updated version. Before recording a case, the system checks the relevant conditions again. Stable operation identifiers, a database transaction, and a uniqueness constraint make retries return the same case. Persistent task state lets the conversation and execution resume.

Both flows follow the same pattern: check the customer's order and the relevant evidence, propose an action, wait for confirmation, then record a traceable service request for further handling. Recording a case means the request exists; it does not mean a refund, exchange, or delivery action has already happened.

## Engineering practice

The project also provides help on three common topics, plus a path from customer feedback through staff review to de-identified evaluation candidates. A read-only MCP interface lets a trusted local client inspect the customer's own orders, tasks, cases, and sources; it cannot confirm or write a case.

In an isolated environment, six fixed synthetic cases were evaluated in one run using a real model and PostgreSQL, followed by human review. Engineering checks cover permission rules, confirmation replay, task recovery, and both workspaces. These checks establish behavior in fixed demo scenarios, not a success rate for live traffic.

The central design decision is to place generative AI inside a workflow with evidence, permissions, confirmation, and a recovery path, with clear steps from a proposed response to a recorded service request.
