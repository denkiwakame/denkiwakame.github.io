---
paper: calm-ws
tldr: Language anchoring turns a stock VLM into a real-robot VLA from 120 demonstrations, with a template action prefix and co-training on a teacher VLM's descriptions of the robot's own frames.
reviewed: false
---

## Motivation

> Can a VLA be built in low-resource settings, without massive annotation or dataset construction?

Turning a VLM into a VLA usually takes large-scale robot data, and action experts, learned tokenizers, and numeric behavior cloning pull the policy out of the VLM's pretrained distribution. The zero-modification VLA-0, which writes actions as numeric text, is brittle with little data. On a cluttered real-robot pick task with 120 demonstrations, a 2B VLA-0 policy reaches only 15% in-domain and 5% with unseen distractors; flipping the input changes its predictions almost arbitrarily, and its attention locks onto shadows rather than objects.

## Approach

A *distribution anchor* is any change to training that keeps the fine-tuned weights near the pretrained ones. *Language anchoring* does this with language targets at two levels, with no architecture or tokenizer change.

- **Output level (CLAP):** a fixed template renders the ground-truth action chunk in centimeters and degrees ("move back 0.5 cm, …, open gripper"). This prefix of about 20 tokens precedes the 56 action tokens.
- **Data level (CALM):** a frozen teacher VLM of the same family describes the robot's own training frames, and the student is distilled on these descriptions. Each step draws a VQA sample with probability $r$:

$$
\mathcal{L} = (1 - r)\,\mathcal{L}_{\mathrm{LA}} + r\,\mathcal{L}_{\mathrm{VQA}}, \quad r = 0.2
$$

![The recipe. (a) CLAP: the student emits a template-generated language prefix before the numeric actions. (b) CALM: a frozen Qwen3.5-4B teacher describes the robot's frames and the Qwen3.5-0.8B student learns to reproduce them (Fig. 1 in the paper).](/papers/calm-ws/recipe.webp)

## Key results

- **Real UR5e:** with the prefix alone, a 0.8B policy reaches 25% in-domain and 10% out-of-domain. CALM with a 4B teacher raises it to 85% and 50%; a 4B student with the same teacher reaches 80% and 65% (Table 5).
- **Teacher quality matters more than prompt variety:** the 0.8B teacher hallucinates scene content, while the 4B teacher cross-checks the two camera views (Tables 8–11). Adding poem, song, and shakespeare prompts to the 0.8B teacher raises success from 30% to 55%; the 4B teacher reaches 85% (Table 5).
- **The anchor needs language about the task:** on LIBERO (2B), random words barely help (79.0 vs. 75.9), and a numeric prefix trails on long tasks (74.4 vs. 82.0) (Table 2).
- **The policy stays near the VLM:** per-token JS divergence from the frozen Qwen3.5-2B is 0.515 for CLAP against 0.651 for VLA-0 (Fig. 3).

![The real-robot task: pick one of three training objects (carrot, cube, tomato) from a cluttered table; out-of-domain trials add unseen distractors.](https://omron-sinicx.github.io/clap/real-robot-tasks.png)

## Conclusion

**Anchor first, scale later.** Learn new tasks while keeping the general capabilities of the foundation model: two language anchors make a 0.8B VLA robust on a real robot from 120 demonstrations. The policy stays a stock VLM, so any VLM can be evaluated on VLA tasks in low-resource settings.
