---
type: projects
slug: caseflow
title: Zhixu · CaseFlow
description: An after-sales case agent that checks orders and policy evidence, asks for user confirmation, and records a recoverable service request.
---

A customer says, “My headphones stopped working. Can I exchange them?” The system checks their identity and order, finds the applicable policy and eligibility rules, and asks for any missing facts. After the customer reviews and confirms the proposed action, it records a case.

Zhixu · CaseFlow is built around that flow. It covers **fault-related exchange requests** and **delivery exception reports** as demo scenarios, using synthetic orders, authored demo policies, and demo identities. The customer workspace shows the conversation, sources, progress, and result. A separate support workspace lets staff review cases and record a human handoff.

## Evidence before an answer

Policy retrieval filters candidate passages by product model and policy version, then presents sources that can be opened in the original document. Source and version details help users check the basis for a proposed action.

On a fixed demo set of four synthetic policies and 16 labelled questions, retrieval using real embeddings improved Recall@5 from 56.25% to 100% after adding product model and policy filters. When supporting evidence is insufficient, the system explains what needs further review or hands the case to a person.

## A model can explain; business rules decide what is written

LangGraph coordinates a persistent task. A model helps extract the request and phrase the proposed solution. Deterministic business logic handles identity, order ownership, eligibility, explicit confirmation, and the database write.

Confirmation has a specific meaning: when new information changes the proposal, the customer confirms the updated version. Before recording a case, the system checks the relevant conditions again. Stable operation identifiers, a database transaction, and a uniqueness constraint make retries return the same case. Persistent task state lets the conversation and execution resume.

Both flows follow the same pattern: check the customer's order and the relevant evidence, propose an action, wait for confirmation, then record a traceable service request for further handling.

## Engineering practice

The project implements customer and support workspaces, task recovery, read-only progress updates, and source viewing. In an isolated environment, six fixed synthetic cases were evaluated in one run using a real model and PostgreSQL, followed by human review. Engineering checks cover permission rules, confirmation replay, and recovery.

The central design decision is to place generative AI inside a workflow with evidence, permissions, confirmation, and a recovery path, with clear steps from a proposed response to a recorded service request.
