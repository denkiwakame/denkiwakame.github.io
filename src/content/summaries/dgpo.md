---
paper: dgpo
tldr: DGPO trains 0.5–1B language models as search agents by warm-starting from teacher demonstrations and applying a KL penalty toward the teacher only when the student's answer is wrong.
reviewed: true
---

## Motivation

> Can compact language models search like agents?

Agentic RAG turns an LLM into a search agent, but existing systems rely on models with billions of parameters. For compact models (0.5–1B), both standard training routes break down. Reinforcement learning starts from near-zero accuracy, so rewards are sparse and training becomes unstable early. Distillation on teacher outputs suffers from exposure bias, and on-policy distillation inherits the noise of the student's poor outputs.

![Prompt-based vs. RL-based (PPO) agentic RAG across model sizes (Fig. 3 in the paper). Even after RL, small models lag far behind larger ones.](https://omron-sinicx.github.io/dgpo/acl26_scaling.jpg "320")

## Approach

DGPO (Distillation-Guided Policy Optimization) has two phases. First, a cold start: the student is distilled from a frozen teacher (cross-entropy plus KL) on correct teacher outputs only. Second, PPO with a search engine, rewarded by exact match. A correct answer earns reward 1; an incorrect one is penalized by its KL divergence from the teacher (Eq. 4):

$$
r_{\phi}(x,y)=\begin{cases}1 & \text{if } y=y^{*}\\ -\beta D_{\text{KL}}\left[\pi_{\theta}(y\mid x;\mathcal{R})\,\|\,\pi_{\text{g}}(y\mid x;\mathcal{R})\right] & \text{otherwise.}\end{cases}
$$

The teacher thus becomes an active guide invoked only on errors, rather than a passive reference regularizer. The paper also introduces ARCap, an evaluation that scores three agentic capabilities separately: thinking, query rewriting, and source referencing.

![Standard PPO (top) vs. DGPO (bottom) (Fig. 5 in the paper). The frozen teacher replaces the reference LLM; its KL penalty applies only to incorrect answers.](https://omron-sinicx.github.io/dgpo/acl26_fig2_v3.png "650")

## Key results

- **Qwen2.5 3B → 0.5B, seven QA benchmarks (EM):** DGPO averages 0.329, up from the untrained student's 0.006 (55×), near the 3B teacher's 0.353; PPO reaches 0.238 and KD 0.298 (Table 2, Sec. 6).
- **Beating the teacher:** the 0.5B student surpasses the teacher on NQ (0.378 vs. 0.365), PopQA (0.402 vs. 0.393), and HotpotQA (0.342 vs. 0.340) (Table 2).
- **Larger gaps, another family:** DGPO averages 0.323 for Qwen 7B → 0.5B and 0.389 for Llama 8B → 1B, ahead of PPO (0.238, 0.250) and KD (0.280, 0.347) (Table 3).
- **Stability and ARCap:** without cold-start initialization, training collapses around step 800 (Sec. 5.6). On MuSiQue, DGPO has the highest hit ratio among the 0.5B models (0.583; teacher 0.668), taking 2.64 search steps vs. the teacher's 1.60 (Table 5).

![Training curves of DGPO and its variants (Fig. 6 in the paper). DGPO stays stable beyond 1000 steps (Sec. 5.7), while the GRPO variant, the variant without cold-start initialization, and KD → GKD collapse; GKD alone is stable but lower.](https://omron-sinicx.github.io/dgpo/acl_26_curve_v2.jpg "390")

![ARCap (Fig. 2 in the paper) evaluates agentic RAG along three capabilities: thinking, query rewriting, and source referencing.](https://omron-sinicx.github.io/dgpo/neurips_ws_teaser_bottom.jpg)

## Conclusion

Trained with DGPO, a 0.5B model searches like an agent: it approaches its 3B teacher and beats it on three datasets, with the teacher used only for inference during RL (+9.5% training time; Limitations). Since 0.5B models run efficiently on CPUs, this opens agentic search to devices such as laptops and smartphones. ARCap shows how compact students differ, e.g. taking more search steps on multi-hop questions.
