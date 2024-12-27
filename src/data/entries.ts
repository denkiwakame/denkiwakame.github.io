export type Entry = {
  title: string;
  techs: string[];
  link: string;
  isComingSoon?: boolean;
};

const entries: Entry[] = [
  {
    title:
      "Essential Pointers for Smooth NVIDIA Driver, CUDA, and Docker Integration",
    techs: ["CUDA", "docker", "driver"],
    link: "https://denkiwakame.notion.site/Mastering-NVIDIA-Setup-Essential-Pointers-for-Smooth-CUDA-Docker-Integration-64a44a98e7f940c483b6600c927f41f8",
  },
  {
    title: "Setting up a faiss build environment with Pixi",
    techs: ["CUDA", "Pixi", "faiss", "conda", "PyPI"],
    link: "https://denkiwakame.notion.site/pixi-faiss-14c3175c6b6a80b39eebf2ab8eb7b05d",
  },
  {
     title: "Manageng Dotfiles by Rust Tools",
     techs: ["Rust", "Pixi", "dotfiles", "nvim", "PyPI"],
     link: "https://denkiwakame.notion.site/Shell-Tools-Rust-1693175c6b6a80319e06c71dea5162db",
  },
];

export default entries;
