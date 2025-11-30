import { Publication } from "@/utils/types/data.ts";

const workshops: Publication[] = [
  {
    authors: ["Rikuto Kotoge", "Mai Nishimura", "Jiaxin Ma"],
    title:
      "Democratizing Agentic RAG: Distillation-Guided Policy Optimization for Compact Language Models",
    journal:
      "NeurIPS Workshop on LAW: Bridging Language, Agent, and World Models",
    year: "2025",
    links: {
      openreview: "https://openreview.net/forum?id=CP0H9NAWES",
      workshop: "https://sites.google.com/view/law-2025",
    },
  },
  {
    authors: [
      "Tatsuya Kamijo",
      "Mai Nishimura",
      "Cristian Camilo Beltran-Hernandez",
      "Masashi Hamaya",
    ],
    title:
      "Tactile Memory with Soft Robot: Tactile Retrieval-based Contact-rich Manipulation with a Soft Wrist",
    journal:
      "CoRL Workshop on Dexterous Manipulation: Learning and Control with Diverse Modalities",
    year: "2025",
    links: {
      openreview: "https://openreview.net/forum?id=uLE44csBAT",
    },
  },
  {
    authors: [
      "Michikuni Eguchi",
      "Shigeo Yoshida",
      "Mai Nishimura",
      "Takefumi Hiraki",
    ],
    title:
      "FluidicSwarm: Embodiment of Swarm Robots Using Fluid Behavior Imitation",
    journal: "ACM SIGGRAPH 2025 Emerging Technologies (SIGGRAPH 2025)",
    year: "2025",
    links: {
      paper: "https://dl.acm.org/doi/10.1145/3721257.3734028",
      project: "https://mvml.slis.tsukuba.ac.jp/research_ja/fluidicswarm/",
    },
  },
];

export default workshops;
