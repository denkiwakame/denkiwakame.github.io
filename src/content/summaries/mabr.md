---
paper: mabr
tldr: A database of multi-robot coordination skills, keyed by Transformer embeddings, lets a few target demonstrations retrieve similar past behaviors to augment policy training for cooperative pushing.
demos:
  - video: https://omron-sinicx.github.io/mabr/assets/ours.mp4
    caption: "Real-robot rollout of the policy trained on the human demonstrations plus retrieved simulated demonstrations (ours)."
  - video: https://omron-sinicx.github.io/mabr/assets/baseline.mp4
    caption: "Real-robot rollout of the baseline trained on the human demonstrations only, with no retrieved data."
reviewed: true
---

## Motivation

> How to reuse specific coordination behaviors involved in past demonstrations, and how to efficiently retrieve the specific coordination skills from a large number of unlabeled demonstrations?

Because agents interact with each other and with the object, learning a multi-agent policy often requires a prohibitive amount of data; collecting it for every new configuration is impractical. Prior retrieve-and-learn methods cover only single agents. Cooperative pushing needs both local coordination (where each robot contacts the object) and global coordination (pushing or rotating it), and similarity between individual agents does not always match similarity of the whole team.

## Approach

A Transformer skill encoder is trained on a large, task-agnostic prior dataset, including sub-optimal demonstrations, to predict each agent's next action from past states of the agents, object, and goal. Per-agent features are average-pooled into a skill vector invariant to the number and order of agents; these vectors form the Multi-Agent Coordination Skill Database. A few target demonstrations act as queries: FastDTW with cosine similarity compares skill-vector sequences, and the top-$K$ matches per query form $\mathcal{D}_{\text{ret}}$. The policy is trained on $\mathcal{D}_{\text{train}} = \mathcal{D}_{\text{target}} \cup \mathcal{D}_{\text{ret}}$. On real robots, an RVO controller avoids collisions.

![Retrieve-and-learn framework (Fig. 2 in the paper): (i) database construction, (ii) coordination skill retrieval, (iii) retrieval-augmented policy training.](https://omron-sinicx.github.io/mabr/assets/method.png)

![Multi-agent coordination skill encoder (Fig. 3 in the paper): trained to predict each agent's next actions from past trajectories, then pooled into a single skill vector.](https://omron-sinicx.github.io/mabr/assets/skill_encoder.png "470")

## Key results

- **Simulation ($N \in \{2,3,4\}$ robots, stick/block, easy/hard; 70 new test environments):** overall success is 56.9 ± 1.7%, against 52.1 ± 1.7% for agent-wise trajectory matching and 30.6 ± 1.6% for few-shot imitation learning (Table I). Trajectory matching wins some individual tasks.
- **Ablation:** target data alone gives 12.4 ± 1.1%; all prior plus target data, 23.5 ± 1.5%; Euclidean instead of cosine distance, 55.4 ± 1.7%; similarity-weighted behavior cloning, 51.5 ± 1.7% (Table II).
- **Real wheeled robots:** with three hand-gesture demonstrations as queries and 300 simulated demonstrations retrieved per query, the policy pushes the object closer to the goal, while one trained on the real demonstrations alone fails (Sec. V-H, Fig. 7; qualitative).

## Conclusion

Retrieval turns a large pool of unlabeled, partly sub-optimal multi-robot data into training data for a new task, given only a few demonstrations of it. Because similarity is measured in a learned coordination space rather than on raw trajectories, a database built in simulation can be queried with real-robot demonstrations. Coordination skills can thus be stored once and reused across tasks and domains.
