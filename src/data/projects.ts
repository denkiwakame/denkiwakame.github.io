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
    title: "py-tiny-pkg",
    techs: ["Python Packaging", "PEP links for my personal use"],
    link: "https://github.com/MaeWolff/dictionary-app",
  },
];

export default projects;
