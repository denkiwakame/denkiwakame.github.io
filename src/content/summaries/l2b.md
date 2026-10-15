---
paper: l2b
tldr: L2B lets a crowd-navigating robot choose between bypassing pedestrians and asking them to make room, using a reward shaped by sequential social dilemmas to balance safety and efficiency.
reviewed: true
---

## Motivation

> How can agents learn to balance the safety-efficiency trade-off?

Most crowd-aware navigation methods only avoid collisions, and in dense crowds they hit the "freezing robot problem": every forward path looks unsafe, so the robot stops or detours. A robot could instead ask nearby people to make room, for example with a beep. But clearing a path too often can collapse the crowd flow and raise the risk of collisions, and there is no optimal rule for when to do which.

## Approach

L2B (Learning to Balance) is a deep RL framework whose actions add path-clearing beeps to movement. Treating the crowd as one agent, it casts robot-crowd interaction as a Sequential Social Dilemma: frequent passive avoidance is the sucker outcome, and aggressive path clearing is a temptation that can end in mutual defection. The reward $R = R_{\rm e} + R_{\rm s}$ adds a crowd term to the environment reward:

$$
R_{\rm s}(\boldsymbol{s}^{jn}_{t},\boldsymbol{a}_{t})=\begin{cases}\beta(d_{t}-r^{(\rm b)}) & \mathrm{if}\,d_{t}<r^{(\rm b)}\land b_{t}=1\\ \eta(d_{t}-d_{\mathrm{disc}}) & \mathrm{elseif}\,d_{t}<d_{\mathrm{disc}}\\ 0 & \text{otherwise}\end{cases}
$$

The first term penalizes beeping at pedestrians inside the beep range $r^{(\rm b)}$ (the paper's aggressiveness term); the second penalizes coming within the discomfort distance $d_{\mathrm{disc}}$, with $\eta>\beta$. L2B is applied to SARL (L2B-SARL); simulated pedestrians react to beeps via a simplified ERVO model.

![Fig. 1 in the paper. Left: freezing robot problem. Right: an agent that interacts with the crowd by actively clearing a path or passively finding a bypath.](https://arxiv.org/html/2003.09207v2/iros20-fig1.svg "480")

![ERVO-based reactive pedestrians (Fig. 2 in the paper): when the robot clears its path, pedestrians within radius r(b) change direction.](https://arxiv.org/html/2003.09207v2/eorca.svg "340")

## Key results

- **Circle crossing, 500 test cases per crowd size $N \in \{5,10,15,20\}$:** on average, L2B-SARL vs. SARL: success 0.917 vs. 0.841, timeout 0.002 vs. 0.077, collision 0.079 vs. 0.081 (Table I).
- **Densest crowd ($N=20$):** success 0.906 vs. 0.700, collision 0.094 vs. 0.184, timeout 0.000 vs. 0.116 (Table I).
- **Trade-offs remain:** at $N=15$ collisions are higher (0.118 vs. 0.064), and at $N=10$ SARL succeeds more often (0.922 vs. 0.904) (Table I).
- **Adaptive path clearing:** with $\beta=0.2$, the learned beep frequency rises from 6.14% at $N=5$ to 12.92% at $N=15$, then drops to 7.88% at $N=20$ (Fig. 5a).

![Effect of β (Fig. 5a in the paper): frequency [%\] of active path-clearing actions for each penalty factor β and crowd size N.](https://arxiv.org/html/2003.09207v2/agg_beep.png "340")

![Effect of β (Fig. 5b in the paper): success rate [%\] for each penalty factor β and crowd size N.](https://arxiv.org/html/2003.09207v2/agg_success.png "340")

## Conclusion

L2B gives the robot a second way to interact with a crowd, plus a social-dilemma reward deciding when to use it. The learned policy clears its path more often as crowds grow up to $N=15$, but holds back in the most congested scenes. Balancing safety and efficiency thus becomes a matter of reward design, which points toward settings where pedestrians also clear paths or learn to cooperate.
