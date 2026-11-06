---
paper: clap
tldr: CLAP turns a pretrained VLM into a VLA by prepending a natural-language action plan to each numeric action chunk, with no architectural change. 2B CLAP reaches 90.8% on LIBERO (+14.9 pt over VLA-0).
demos:
  - url: https://omron-sinicx.github.io/clap/2b_in.gif
    caption: "In-distribution rollout of CLAP (2B): \"grasp carrot and drop it onto the plate\"."
  - url: https://omron-sinicx.github.io/clap/2b_ood.gif
    caption: "Out-of-distribution rollout of CLAP (2B), with unseen distractors: \"pick up tomato and place it on the plate\"."
reviewed: false
---

## Motivation

> What would it take to make VLA research as accessible as VLM research?

VLAs inherit rich semantic capabilities from pretrained VLMs, yet fine-tuning on robot actions can silently collapse them: predicting bare numeric action tokens pulls generation far from the pretrained language distribution, degrading multimodal understanding, spatial reasoning, and generalization. Existing VLM-to-VLA approaches each leave something on the table. Language-only action representations stay close to the VLM but are too imprecise for low-level control or still need an action expert; capability-preserving methods add extra modules, gradient-blocking schemes, or co-training data; compact VLAs are usually released at a single fixed scale.

## Approach

CLAP (Causal Language-Action Prediction) first generates a short natural-language description of the intended motion, then predicts the discrete action tokens conditioned on it. Because generation is autoregressive, each action token causally attends to this description, making it a conditioning intermediate rather than an auxiliary output. During training, a fixed template generates the description deterministically from the ground-truth action chunk ("move forward 3 cm, tilt right 1 degree, close gripper"), and the model is trained on the concatenated sequence with the standard cross-entropy objective. CLAP changes only the output representation: no action expert, vocabulary change, architectural change, or manual annotation.

![Training. A fixed template renders the ground-truth action chunk as a language description, and the VLM (Qwen3.5-0.8B / 2B / 4B) is fine-tuned to emit the description before the action tokens.](https://omron-sinicx.github.io/clap/train.png)

At inference, the fine-tuned VLM generates both, the language prefix is stripped, and the integer tokens are decoded into an 8-step action chunk for open-loop execution.

![Inference. The fine-tuned VLM generates the language description, then the action tokens, autoregressively.](https://omron-sinicx.github.io/clap/inference.png)

## Key results

- **LIBERO, matched against VLA-0:** with the same Qwen3.5 backbones, data, and training budget, CLAP raises the average from 76.1% to 89.6% at 0.8B (+13.5 pt) and from 75.9% to 90.8% at 2B (+14.9 pt), with 4-5 hours of fine-tuning.
- **Against robot-pretrained VLAs:** with no robot pretraining beyond LIBERO, 2B CLAP (90.8%) exceeds SmolVLA (88.8%) and OpenVLA (76.5%) on average.
- **Real UR5e, 120 demonstrations:** 2B CLAP reaches 60% in-domain and keeps 60% with unseen distractor objects, while 0.8B drops from 35% to 10% (20 trials per condition).

![Real-robot pick-and-place with three training objects (carrot, cube, tomato) under randomized layouts. Out-of-distribution trials add unseen distractors (silver watering can, orange toy car).](https://omron-sinicx.github.io/clap/real-robot-tasks.png)

## Conclusion

A VLA can stay anchored to its VLM's pretrained distribution and still emit executable numeric actions: a language-action prefix is enough, with no new modules or robot pretraining. Released as an open-weight family at several scales from a single VLM lineage, CLAP makes VLA fine-tuning as lightweight as VLM fine-tuning and gives a controlled testbed for how VLM capabilities transfer to robot control.
