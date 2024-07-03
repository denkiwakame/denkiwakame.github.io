type Social = {
  label: string;
  link: string;
  icon: string;
};

type Presentation = {
  mail: string;
  title: string;
  description: string;
  socials: Social[];
  profile?: string;
  experiences: Experience[];
};

type Experience = {
  affiliation: string;
  position: string;
  year: string;
  description?: string;
  country: string;
};

type Degree = {
  degree: string;
  univ: string;
  country: string;
  year: string;
};

const presentation: Presentation = {
  title: "denkiwakame",
  description:
    "Bonjour, i'm a *french frontend developer* with over *3 years* of web experience. I am currently working with *NextJS and Typescript*. Outside of work I complete my pokemon card collection and learning TypeScript.",
  socials: [
    {
      label: "GitHub",
      link: "https://github.com/denkiwakame",
      icon: "mingcute:github-line",
    },
    {
      label: "X",
      link: "https://twitter.com/denkivvakame",
      icon: "mingcute:twitter-line",
    },
    {
      label: "linkedin",
      link: "https://www.linkedin.com/in/mai-nishimura-86930b62",
      icon: "mingcute:linkedin-line",
    },
    {
      label: "email",
      link: "denkivvakam@gmail.com",
      icon: "mingcute:mailbox-line",
    },
    {
      label: "dblp",
      link: "https://dblp.org/pid/176/1422.html",
      icon: "academicons:dblp",
    },
  ],
  experiences: [
    {
      affiliation: "OMRON SINIC X",
      position: "Senior Researcher",
      year: "2023-current",
      description:
        "Mobile Robot Navigation / 3D Computer Vision / GPU-accelerated Machine Learning",
      country: "JPN",
    },
    {
      affiliation: "OMRON SINIC X",
      position: "Research Engineer",
      year: "2019-2023",
      description:
        "Mobile Robot Navigation / 3D Computer Vision / GPU-accelerated Machine Learning",
      country: "JPN",
    },
    {
      affiliation: "Fixstars",
      position: "Senior Software Engineer",
      year: "2017-2019",
      description: "Computer Vision / Autonomous Driving / SIMD / CUDA",
      country: "JPN",
    },
    {
      affiliation: "NTT Labs",
      position: "Researcher",
      year: "2015-2017",
      description: "Computer Vision / Low-level Vision / MRF Optimization",
      country: "JPN",
    },
    {
      affiliation: "Hatena",
      position: "Part-time Web Application Engineer",
      year: "2013-2015",
      description: "Frontend / Backend / Web Application",
      country: "JPN",
    },
    {
      affiliation: "IBM Tokyo Research Laboratory (TRL)",
      position: "Research Intern",
      year: "August 2013 - September 2013",
      description: "Computer Vision / Traffic Monitoring",
      country: "JPN",
    },
    {
      affiliation: "Google",
      position: "Software Engineer Intern (BOLD)",
      year: "August 2012 - September 2012",
      description: "Native Client Project, Chrome Team",
      country: "JPN",
    },
  ],
  education: [
    {
      univ: "Kyoto University",
      degree: "Ph.D. in Informatics",
      country: "JPN",
      year: "2020-2023",
    },
    {
      univ: "Kyoto University",
      degree: "M.S. in Informatics",
      country: "JPN",
      year: "2013-2015",
    },
    {
      univ: "Kyoto University",
      degree: "B.E. in Electrical and Electronic Engineering",
      country: "JPN",
      year: "2009-2013",
    },
  ],
};

export default presentation;
