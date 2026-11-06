---
paper: calm-ws
tldr: Language anchoring turns a stock VLM into a real-robot VLA from 120 demonstrations, with a template action prefix and co-training on a teacher VLM's descriptions of the robot's own frames.
reviewed: true
---

## Motivation

> Can a VLA be built in low-resource settings, without massive annotation or dataset construction?

Action experts, learned tokenizers, and numeric behavior cloning pull a VLA out of its VLM's pretrained distribution. The zero-modification VLA-0, which writes actions as numeric text, is brittle with little data. On a cluttered real-robot pick task with 120 demonstrations, a 2B VLA-0 policy reaches 15% in-domain and 5% with unseen distractors; flipping the input changes its predictions almost arbitrarily, and its attention locks onto shadows rather than objects.

## Approach

A _distribution anchor_ is any change to training that keeps the fine-tuned weights near the pretrained ones. _Language anchoring_ does this with language targets at two levels, with no architecture or tokenizer change.

- **Output level (CLAP):** a fixed template renders the ground-truth action chunk in centimeters and degrees ("move back 0.5 cm, …, open gripper").
- **Data level (CALM):** a frozen teacher VLM of the same family describes the robot's own training frames, and the student is distilled on these descriptions. Each step draws a VQA sample with probability $r$:

$$
\mathcal{L} = (1 - r)\,\mathcal{L}_{\mathrm{LA}} + r\,\mathcal{L}_{\mathrm{VQA}}, \quad r = 0.2
$$

![The recipe. (a) CLAP: the student emits a template-generated language prefix before the numeric actions. (b) CALM: a frozen Qwen3.5-4B teacher describes the robot's frames and the Qwen3.5-0.8B student learns to reproduce them.](/papers/calm-ws/recipe.webp)

## Key results

- **Real UR5e:** with the prefix alone (CLAP), a 0.8B policy reaches 25% in-domain and 10% with unseen distractors. CALM with a 4B teacher raises it to 85% and 50%; a 4B student with the same teacher reaches 80% and 65%. Success rates (%) over 20 trials per configuration, 120 demonstrations:

  | Policy              | Teacher and prompts              | In-domain | Unseen distractors |
  | ------------------- | -------------------------------- | --------: | -----------------: |
  | VLA-0 2B, no prefix | –                                |        15 |                  5 |
  | CLAP 0.8B           | –                                |        25 |                 10 |
  | CLAP 0.8B + CALM    | 0.8B: describe, describe and act |        30 |                n/a |
  | CLAP 0.8B + CALM    | 0.8B: + poem, song, shakespeare  |        55 |                n/a |
  | CLAP 0.8B + CALM    | 4B: describe, describe and act   |    **85** |                 50 |
  | CLAP 4B + CALM      | 4B: describe, describe and act   |        80 |             **65** |

- **Teacher quality matters more than prompt variety:** adding poem, song, and shakespeare prompts to the 0.8B teacher raises success from 30% to 55%, while the 4B teacher reaches 85%. The teachers' targets for the first UR5e frame show why (verbatim excerpts):

  > [!teacher 0.8B] describe | Hallucination
  >
  > "… A long, orange, carrot-shaped object with green leaves attached is lying horizontally in the lower-left area. … Right Side: … Action: The robot arm is **holding the carrot and tomato together**."

  > [!teacher 4B] describe | Grounded robot + gripper state
  >
  > "… A robotic arm (**looks like a UR5 or similar industrial arm**) is visible in the top left, hovering over the plate. **Its gripper is open.** … Right Panel: … The robotic gripper is holding the orange carrot by its green leaves."

  > [!teacher 0.8B] describe and act | Plan OK, then drifts into irrelevant code
  >
  > "1. Grasp the Carrot … 3. Drop the Carrot: … release it from the gripper and drop it onto the light blue plate. 4. Confirm Placement. … **Final Output python # This is a Python script that demonstrates the task** …"

  > [!teacher 4B] describe and act | Cross-checks views, revises state
  >
  > "The robot gripper is hovering near the carrot but hasn't grasped it yet. **Wait, looking closer** … Actually, looking at the right image, the gripper is holding the carrot. **Let's re-evaluate.**"

  > [!teacher 0.8B] poem | Poetry set
  >
  > The robot's fingers, dark and precise, / Reach out to the carrot, green and bright. / It grasps with steady, careful hands, / And drops it gently onto the plate.

  > [!teacher 0.8B] song | Poetry set
  >
  > … With a gentle, careful touch. / The carrot is ready, / To be dropped onto the plate.

- **The anchor needs language about the task:** on the LIBERO simulation benchmark (2B), random words barely help (79.0 vs. 75.9), and a numeric prefix trails on long tasks (74.4 vs. 82.0). Success rates (%) by prefix:

  | Prefix               |  Spatial |   Object |     Goal |     Long |      Avg |
  | -------------------- | -------: | -------: | -------: | -------: | -------: |
  | none (VLA-0)         |     77.8 |     86.6 |     77.0 |     62.4 |     75.9 |
  | random words         |     79.2 |     84.0 |     85.6 |     67.0 |     79.0 |
  | numeric, no language |     91.2 | **98.2** | **90.8** |     74.4 |     88.7 |
  | language (CLAP)      | **93.0** |     97.4 | **90.8** | **82.0** | **90.8** |

![The real-robot task: pick one of three training objects (carrot, cube, tomato) from a cluttered table; out-of-domain trials add unseen distractors.](https://omron-sinicx.github.io/clap/real-robot-tasks.png)

## Conclusion

**Anchor first, scale later.** Learn new tasks while keeping the general capabilities of the foundation model: two language anchors make a 0.8B VLA robust on a real robot from 120 demonstrations.
