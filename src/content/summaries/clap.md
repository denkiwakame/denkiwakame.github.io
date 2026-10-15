---
paper: clap
tldr: CLAP turns a pretrained VLM into a VLA by predicting a short natural-language action description before the numeric action tokens, with no action expert or architecture change.
demos:
  - url: https://omron-sinicx.github.io/clap/2b_ood.gif
    caption: "Out-of-distribution rollout of CLAP (2B): \"pick up tomato and place it on the plate\"."
reviewed: true
---

## Motivation

> What would it take to make VLA research as accessible as VLM research?

Vision-language-action models (VLAs) are built by fine-tuning pretrained VLMs on robot data, often with extra action experts, diffusion heads, and large-scale robot pretraining. This complexity makes it hard to isolate what the VLM itself contributes to control, and to carry advances from the broader VLM community over to robots. The paper traces much of it to an *output-distribution mismatch*: a VLM pretrained to generate structured language is trained to emit bare action tokens such as "4 12 98 3 0 0", which carry little of its pretrained linguistic or spatial structure. Compact VLAs may be especially sensitive to this shift.

## Approach

CLAP (Causal Language-Action Prediction) changes only the target output sequence. Before the discretized action tokens, the model generates a short description of the action chunk, such as "move back 0.5 cm, move up 3.5 cm, …, open gripper". During training, this prefix is produced from the ground-truth actions by a fixed template, so no manual annotation is needed, and every action token is causally conditioned on it. Backbone, tokenizer, output head, and loss stay unchanged; masking input action tokens is an optional augmentation. CLAP is instantiated on Qwen3.5 at 0.8B, 2B, and 4B.

![Overview (Fig. 2 in the paper). Training: the language description is generated from the ground-truth action chunk by a template. Inference: the fine-tuned VLM generates the description, then the action tokens, autoregressively.](https://arxiv.org/html/2607.08974v1/clap_inv.png)

## Key results

- **LIBERO, one training epoch, matched against VLA-0:** CLAP improves the average success rate by +13.5, +14.9, and +20.7 points at 0.8B, 2B, and 4B. 2B CLAP reaches 90.8% (VLA-0: 75.9%), outperforming 4B CLAP (84.9%) (Table 2).
- **LIBERO-PRO (OOD):** unmasked CLAP raises average success over VLA-0 by +5.5, +11.1, and +10.9 points at 0.8B, 2B, and 4B. At 4B, on the Spatial suite with novel object instances, the gains are +42.6 points (unmasked) and +54.4 points (masked) (Table 4).
- **Cost:** training takes a single epoch on one 8-GPU node, under 6.5 hours for every model size (Sec. 6). The prefix adds about 1.0 s per query (+32%) at inference (Appendix C).

![Real-robot pick-and-place tasks with three training objects (carrot, cube, tomato) under randomized layouts. Out-of-distribution evaluation adds unseen distractor objects.](https://omron-sinicx.github.io/clap/real-robot-tasks.png)

## Conclusion

A minimal recipe is enough to adapt a VLM into a VLA: change only the output representation, keep the backbone a standard VLM, and fine-tune for a single epoch. With no new modules or robot pretraining, the 0.8B/2B/4B family becomes a controlled testbed for studying how VLM capabilities transfer to robot control, and VLM-side advances such as quantization apply directly. In the authors' words, making VLA fine-tuning as lightweight and transparent as standard VLM fine-tuning is a necessary step toward bringing the VLM community's progress to robot learning.
