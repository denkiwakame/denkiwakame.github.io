---
paper: <paper-id>            # id in src/data/papers.yaml
tldr: <one sentence, ≤200 characters>
demos:                       # optional, ≤4: demo videos / GIFs only, shown in a carousel after the text
  - video: https://<project-page>/<demo>.mp4
    caption: <caption>
  - url: https://<project-page>/<rollout>.gif
    caption: <caption>
reviewed: false              # never set to true; the author does
---

## Motivation

> <The question the paper asks, quoted or closely paraphrased from its introduction.>

<Why the problem is important and what stands in the way. 60–100 words.>

## Approach

<The method in plain words. 60–100 words. Inline math: $x$, display math:>

$$
<optional key equation>
$$

![<Caption for the overview figure (Fig. N in the paper).>](https://<project-page-or-arxiv-html>/<overview>.png)

## Key results

- **<Benchmark / setting>:** <result with exact numbers> (<Table/Fig/Sec reference>).
- **<…>:** <…>

![<Caption for a result figure, if one helps (Fig. N in the paper).>](https://<project-page-or-arxiv-html>/<result>.png)

## Conclusion

<The takeaway, stated directly as a claim (no "Yes," and no "this answers the question"); it should resolve the Motivation question by its content. 50–90 words.>
