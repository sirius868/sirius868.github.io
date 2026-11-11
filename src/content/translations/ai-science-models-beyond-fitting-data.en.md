---
type: blog
slug: ai-science-models-beyond-fitting-data
title: "AI Can Help Build Scientific Models. Does That Mean We Understand More?"
description: "A recent discussion of AI in science shows why fitting data is only the beginning: alternative models, interventions, and human interpretation still matter."
---

On November 6, three researchers from the University of Tübingen and ELLIS Institute Tübingen published a guest article on Anthropic's website about AI's role in building scientific models. Their most interesting question was not whether AI could produce another equation. It was this: **if a machine finds a model that fits the data, do we understand the phenomenon any better?**

There is a familiar engineering analogy. A program passing today's tests does not mean it will work for every input. Likewise, a curve matching existing observations does not necessarily reveal the mechanism behind them. Scientists need models that can also predict what happens under conditions they have not measured, and help them choose the next experiment.

## An old story about firing neurons

Hodgkin and Huxley developed equations for the electrical pulses produced by nerve cells. They found that raising one variable to the fourth power helped the equations fit experimental data. At first, that exponent was an informed modeling choice, not something they had directly seen inside the cell. Later work on a related ion channel found four similar structural units, lending support to the proposed interpretation.

The important result was not just the number four. The researchers had also tried simpler explanations and understood why those were inadequate. That gave them a reason to take the four-part mechanism seriously. **A final equation without the rejected alternatives tells us much less about the strength of a conclusion.**

## Three jobs for AI in scientific modeling

The researchers divide modeling into three connected activities:

1. **Build a model:** choose the variables and how they interact. An AI Agent can propose candidate equations and write code to run them.
2. **Constrain a model:** compare it with measurements and identify parameter ranges that remain plausible. Simulation-based inference can preserve a range rather than a single best fit.
3. **Interpret a model:** ask what its variables mean in the real system and what new experimental outcomes it predicts.

Think of the second job as reconstructing a restaurant bill. You know that the group paid $120, but not what each person ordered. Many combinations could produce the same total. Publishing one plausible bill would hide other equally plausible explanations. Scientific measurements can have the same ambiguity: different parameters, or even different equations, can fit the same observations.

AI can help generate, run, and filter candidates repeatedly. But a useful system should retain **a range of plausible models** and show where they agree or disagree. The disagreements often suggest the most informative next experiment.

## Why accurate predictions are still not enough

Imagine two models that reproduce the same recorded neuron pulses. One depends strongly on a sodium channel; the other proposes a different mechanism. Existing data may not distinguish them. Changing that channel's activity could make their predictions diverge. An intervention like this can test which explanation survives.

Evaluating an AI science tool therefore requires more than a small error on the data used to build its model. We should ask:

- Does it predict outcomes under new experimental conditions?
- Does it show alternative models that also explain the evidence?
- Can it identify an intervention that would separate those alternatives?
- Can scientists extract a mechanism they can inspect and challenge?

The guest article is careful about the current evidence: these systems have mostly been tested by rediscovering models scientists already know. Evidence on problems with no known answer remains limited. This is a promising research direction, not proof that AI can independently discover scientific laws.

## What engineers can take from this news

The most valuable output of an AI science tool may be the **record of the search**, not one polished result: candidate models, plausible parameter ranges, failed comparisons, data versions, executable code, and predictions that a new experiment can test. That record lets researchers ask why they should trust a model and how they might disprove it.

The same principle applies beyond science. A model's answer can start the work. A dependable system also exposes evidence, alternative explanations, and a path to verification. Producing a fluent answer is fast; building trustworthy understanding takes longer.

**Source:** [Teaching AI to build scientific models](https://www.anthropic.com/research/teaching-ai-to-build-scientific-models), Jakob Macke, Daniel Gedon, and Stefan Wahl, November 6, 2026. This article is an interpretation of that guest post.
