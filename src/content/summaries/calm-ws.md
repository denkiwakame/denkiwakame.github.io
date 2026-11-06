---
paper: calm-ws
tldr: Two language anchors, a template action prefix and VQA co-training on teacher-VLM descriptions of the robot's own frames, turn a stock VLM into a real-robot VLA from 120 demonstrations.
reviewed: false
---

## Motivation

> Can a VLA be built in low-resource settings, without massive annotation or dataset construction?

Most VLAs come from a VLM backbone, but action experts, learned action tokenizers, and numeric behavior cloning pull the policy away from the VLM's pretrained distribution. The zero-modification VLA-0, which writes actions as numeric text, keeps the architecture intact yet is brittle with limited data: on a cluttered real-robot pick task with 120 demonstrations, a 2B VLA-0 policy reaches only 15% in-domain and 5% with unseen distractors.

## Approach

The key idea is *language anchoring*: add language targets that keep fine-tuning close to the VLM, with no change to its architecture. At the output level, CLAP precedes each numeric action chunk with a template description in physical units ("move back 0.5 cm, …, open gripper"). At the data level, CALM has a frozen teacher VLM from the same family describe the robot's own training frames, and distills these descriptions into the student (sequence-level KD). Each step draws a VQA sample with probability $r$:

$$
\mathcal{L} = (1 - r)\,\mathcal{L}_{\mathrm{LA}} + r\,\mathcal{L}_{\mathrm{VQA}}, \quad r = 0.2
$$

## Key results

- **Real UR5e, 120 demonstrations:** with the prefix alone, a 0.8B policy reaches 25% ID and 10% OOD. CALM with a 4B teacher raises it to 85% ID and 50% OOD; a 4B student with the same teacher reaches 80% and 65% (Table 5).
- **Teacher quality over prompt variety:** adding poem, song, and shakespeare prompts to a 0.8B teacher raises success from 30% to 55%, whereas a 4B teacher reaches 85% (Table 5).
- **What the prefix anchors to (LIBERO, 2B):** random words barely help (79.0 vs. 75.9), a numeric prefix trails on long tasks (74.4 vs. 82.0), and only the natural-language prefix gives the full gain (90.8) (Table 2).
- **Drift from the base VLM:** per-token JS divergence from the frozen Qwen3.5-2B is 0.515 for CLAP against 0.651 for VLA-0 (Fig. 3).
- **Cost:** with torch.compile the 0.8B and 2B students run at 6.1 and 4.1 Hz (Table 3).

![Real-robot pick task with three training objects (carrot, cube, tomato); out-of-domain trials add unseen distractors.](https://omron-sinicx.github.io/clap/real-robot-tasks.png)

## Conclusion

A VLM becomes a real-robot VLA at low cost when its fine-tuning is anchored to language: a template action prefix plus VQA co-training on teacher descriptions of the robot's own frames, with the architecture untouched. The policy stays a stock VLM, so any VLM can be evaluated on VLA tasks with a handful of demonstrations.
