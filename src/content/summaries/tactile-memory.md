---
paper: tactile-memory
tldr: TaMeSo-bot pairs a soft wrist with a tactile memory; a masked Transformer (MAT³) encodes contact history, and retrieving the nearest stored action inserts unseen pegs with 85% success.
reviewed: true
---

## Motivation

> Can a robot, like a person inserting a key by touch, store and retrieve tactile experience to insert objects robustly under uncertainty?

Humans insert a key into an unseen lock by gentle exploration and tactile recall, which is hard to replicate in robots. On a rigid arm, slight pose errors during contact produce large forces that trigger protective stops, so contact-rich data is difficult to collect. Reusing experience also needs a representation that matches observations to relevant demonstrations from subtle sensor differences, without subtask labels.

![Tactile memory as encoding, storage, and retrieval of touch-based experience; TaMeSo-bot builds a robotic counterpart to each stage. The illustration is conceptual.](https://omron-sinicx.github.io/tameso/tactile_memory.png)

## Approach

TaMeSo-bot (Tactile Memory with Soft Robot) combines a soft wrist, which absorbs contact forces during teleoperated data collection and execution, with a non-parametric policy that retrieves actions from a database of demonstrations. Its core, MAT³ (Masked Tactile Trajectory Transformer), is a bidirectional Transformer over sub-trajectories of nine taxel tokens and one action token per timestep, with force-torque, arm pose, and gripper pose fused in as global context, trained by masked token prediction. At execution, the current action token is masked, the pooled embedding $\bm{z}_{q}$ serves as the query, and the $k$ nearest stored embeddings under $\mathrm{dist}(\bm{z}_{q},\bm{z}_{i})=\|\bm{z}_{q}-\bm{z}_{i}\|_{2}$ are found with an HNSW index; one neighbour's action is executed.

![MAT³ (Fig. 3 in the paper). Training reconstructs randomly masked states and actions within a window H; inference encodes a sub-trajectory into one embedding z.](https://omron-sinicx.github.io/tameso/method.png)

## Key results

- **Seen vs. unseen pegs (64 demonstrations on two shapes; 40 trials per shape):** on seen pegs MAT³ w/o Mask and MAT³ reach 90% and 88.8%; on five unseen pegs MAT³ reaches 85% versus 71% without masking. The Tactile Transformer gets 22.5% and 17.5% (Table I, Sec. IV-B).
- **Parametric baseline:** ACT, trained on the same 64 demonstrations, achieves 63.75% on seen pegs and 53% on unseen shapes, mostly failing by pushing down before alignment (Sec. IV-B).
- **Unseen conditions** (new starting positions, increased friction, 5° tilted grasp): MAT³ keeps 57.5%, versus 29.2% without masking, 14.17% for ACT, and 7.5% for the Tactile Transformer (Table II).

![Seen (square, cylinder ⌀40) and unseen (cylinder ⌀30, rectangle, oval, hexagon, pentagon) pegs, with dimensions in mm (Fig. 4 in the paper).](https://omron-sinicx.github.io/tameso/method2.png "460")

## Conclusion

TaMeSo-bot shows that a robot can build and use a tactile memory: the soft wrist makes contact-rich demonstrations safe to collect, and masked spatiotemporal encoding makes them retrievable for pegs and conditions never seen in training. Because actions come from stored demonstrations, behavior stays bounded by the dataset, and subtask structure (fit, align, insert) emerges in the embedding space without labels.
