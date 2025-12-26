export type Project = {
  title: string;
  techs: string[];
  link: string;
  isComingSoon?: boolean;
};

const projects: Project[] = [
  {
    title: "arxiv2notion",
    techs: ["Chrome Extension", "Notion API"],
    link: "https://github.com/denkiwakame/arxiv2notion",
  },
  {
    title: "academic-project-template",
    techs: ["React", "UIKit"],
    link: "https://github.com/denkiwakame/academic-project-template",
  },
  {
    title: "numpy-blas-bench",
    techs: ["Numpy", "MKL", "OpenBLAS", "AOCL", "conda", "pypi"],
    link: "https://github.com/denkiwakame/numpy-blas-bench",
  },
  {
    title: "py-tiny-pkg",
    techs: ["Python Packaging", "PEP links for my personal use"],
    link: "https://github.com/denkiwakame/py-tiny-pkg",
  },
];

export default projects;
