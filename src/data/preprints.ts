import { Publication } from "@/utils/types/data.ts";

const preprints: Publication[] = [
  {
    authors: ["Mai Nishimura", "Shohei Nobuhara", "Ko Nishino"],
    title:
      "InCrowdFormer: On-Ground Pedestrian World Model From Egocentric Views",
    journal: "arXiv",
    year: "2023",
    links: {
      paper: "https://arxiv.org/abs/2303.09534",
    },
  },
  {
    authors: [
      "Yuta Yoshitaka",
      "Mai Nishimura",
      "Shohei Nobuhara",
      "Ko Nishino",
    ],
    title:
      "TransPoser: Transformer as an Optimizer for Joint Object Shape and Pose Estimation",
    journal: "arXiv",
    year: "2023",
    links: {
      paper: "https://arxiv.org/abs/2303.13477",
    },
  },
];

export default preprints;
