---
paper: swarm-body
tldr: Tabletop swarm robots can be embodied as a user's hand; VR and real-robot studies show how robot size, density, and the formation/assignment algorithm shape body ownership and agency.
demos:
  - video: https://shigeodayo.me/video/sb/intro_720p.mp4
    caption: "Physical telepresence: a remote user's hand, represented by swarm robots, rolls a ball with a person at another table."
  - video: https://shigeodayo.me/video/sb/multipliable_720p.mp4
    caption: "Multipliable body: the swarm splits from one-handed into two-handed operation and merges back."
  - video: https://shigeodayo.me/video/sb/transformable_720p.mp4
    caption: "Transformable body: the same user's hand is represented as a normal-sized hand and as a large hand (x1.5)."
reviewed: true
---

## Motivation

> When do swarm robots give users a sense of body ownership and agency?

Teleoperated arms and virtual avatars can be embodied, but they cannot easily change size or shape, or work around obstacles. A swarm body could split, reshape, and tolerate losing robots. Yet swarm robots have no joints tying them together, so robot size, density, subgoal placement, and robot assignment may all affect embodiment in ways not yet understood.

## Approach

Each timestep, a three-step framework maps the tracked hand to robots. (1) *Subgoal formation*: bone-based places subgoals at predetermined positions relative to the hand bones, projected onto the table; silhouette-based clusters hand-mesh vertices with k-means. (2) *Assignment*: either static (each subgoal always goes to the same robot) or dynamic (re-solved as a linear sum assignment problem with the Hungarian algorithm). (3) *Local planning*: RVO with nonholonomic constraints. This gives three conditions: bone-static, bone-dynamic, and silhouette-dynamic. The real-world study uses custom 30 mm robots with Zooids-style projector-based tracking.

![Bone-based (top) and silhouette-based (bottom) subgoal formation for two hand shapes; gray crosses are subgoal positions (Fig. 3 in the paper).](https://arxiv.org/html/2402.15830v2/fig3_algorithm.png)

## Key results

- **VR study (10 participants; 2 sizes × 3 densities × 3 algorithms, within-subjects; ART + repeated-measures ANOVA, Holm-corrected ART-C contrasts):** body ownership had main effects of density ($F(2,153)=4.00$, $p=.020$, $\eta_p^2=.05$) and algorithm ($F(2,153)=15.28$, $p=.000$, $\eta_p^2=.17$). Sparse beat dense ($p=.016$, $d=0.516$). Bone-dynamic beat silhouette-dynamic ($p=.000$, $d=1.002$) and bone-static ($p=.033$, $d=0.393$). Agency was higher for 20 mm than 30 mm ($p=.016$, $d=0.363$) and for bone-dynamic than silhouette-dynamic ($p=.006$, $d=0.576$) (Sec. 4.6).
- **Real robots (30 mm; 3 × 3 design; 10 participants, one excluded for hand-tracking failure):** density had a main effect on body ownership ($F(2,64)=3.31$, $p=.043$, $\eta_p^2=.09$). Medium beat sparse ($p=.047$, $d=0.676$), unlike VR, where sparse beat dense. No pairwise algorithm difference was significant (Sec. 5.7).
- **Bone-dynamic vs. the neutral level:** on real robots, body ownership ($p=.042$, $d=0.751$) and agency ($p=.000$, $d=2.354$) were significantly higher, and cognitive load significantly lower ($p=.000$, $d=1.722$) (Sec. 5.8.1).

![Body ownership and agency on real robots by density and algorithm (Fig. 13 in the paper).](https://arxiv.org/html/2402.15830v2/fig13_robot_bo_agency.png "500")

## Conclusion

Swarm robots are likely to be embodied given a suitable algorithm and density, though individuals differ. Bone-dynamic, which keeps robots on the fingertips and reassigns them to avoid collisions, gave the strongest embodiment in VR and exceeded neutral on real robots. Real robots shifted preference toward denser swarms, possibly through visual similarity, sense of accomplishment, and collisions. This grounds physical-telepresence applications: bodies that split, rescale, avoid obstacles, tap, and gesture.
