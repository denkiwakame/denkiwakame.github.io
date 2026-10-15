---
paper: phase
tldr: PHASE uses a compliant wrist and tactile torque to split peg-in-hole demos into search and insert phases, then retrieves phase-consistent prior segments to train a few-shot ACT policy.
reviewed: true
---

## Motivation

> How can we enable robots to leverage prior experience in the same way [as people reuse what they learned inserting other connectors]?

People who have inserted a few connector types can draw on that experience for a new shape. Retrieval-based imitation learning does something similar, augmenting a few target demonstrations with relevant prior segments, but it has mostly been studied on motion-dominant tasks such as pick-and-place. In insertion, the transition from searching to inserting shows up in force and tactile signals rather than kinematics, and phase durations vary with geometry and initial pose, so kinematic or fixed-window retrieval can mix fragments of different contact regimes.

## Approach

PHASE (PHase-Aware Segmentation and REtrieval) relies on a soft wrist with passive 6D compliance: it keeps the peg in sustained contact without protective stops, so tactile signals reveal the phase structure. A frozen MAT³ encoder, trained by masked reconstruction on prior data, gives per-frame embeddings. Each demonstration is split into *search* and *insert* using the torque estimated from the 3×3 taxels,

$$
\hat{\bm{\tau}}=\sum_{i}\mathbf{r}_{i}\times\mathbf{f}_{i},
$$

with the boundary at the first frame after the contact peak where the coefficient of variation of $\|\hat{\bm{\tau}}\|$ drops below $\eta$. Prior segments are matched to target segments of the same phase with FastDTW, and an ACT policy is trained on the target demonstrations plus the retrieved segments.

![Overview of PHASE (Fig. 2 in the paper): tactile representation learning, phase-aware segmentation and retrieval, and ACT policy training.](https://omron-sinicx.github.io/phase/method.png)

![Tactile-based phase segmentation (Fig. 3 in the paper). Top: tactile-estimated torque magnitude and its signed components. Bottom: coefficient of variation (CV) of the torque magnitude. The search/insert boundary is the first frame after the contact peak where CV < η.](https://omron-sinicx.github.io/phase/method2.png "610")

## Key results

- **Real-world peg-in-hole, five geometries (circle and square seen; rectangle, oval, hexagon unseen):** with 122 prior demonstrations and 4 target demonstrations per shape, PHASE reaches 77/100 (77%), versus 64% for BC-Prior and Retrieval-Full, 56% for Retrieval-Single, 55% for Retrieval-Window, and 50% for Target-Only (Table I, Sec. IV-A).
- **Unseen starting positions:** PHASE keeps 47/100 (47%), a 30-percentage-point improvement over BC-Prior (17%); Target-Only drops to 0% (Table III).
- **Retrieved data:** PHASE yields 15,548 unique training frames with 100% boundary coverage, versus 4,479 frames and 4% for single-pair retrieval (Table II).

## Conclusion

In contact-rich insertion, prior experience is best reused at the level of contact phases, which compliance makes visible through touch. PHASE needs no phase labels and leaves the policy unchanged, yet outperforms BC-Prior trained on all prior demonstrations, with the largest gain when starting positions shift. Compliance and tactile sensing thus help decide not only how to make contact safely, but *what* past experience to retrieve.
