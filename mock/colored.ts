export type RangliConturAlbum = {
  id: string;
  title: string;
  combinedImage: string; // album-style single image (left color, right contour)
  level: "Easy" | "Medium" | "Hard";
};

export const ALBUMS: RangliConturAlbum[] = [
  {
    id: "woody",
    title: "Toy Story",
    combinedImage: "/images/colored/toy1.png",
    level: "Hard",
  },
  {
    id: "forky",
    title: "Toy Story",
    combinedImage: "/images/colored/toy4.png",
    level: "Easy",
  },
  {
    id: "big_hero",
    title: "Big Hero",
    combinedImage: "/images/colored/Big Hero.png",
    level: "Easy",
  },

  {
    id: "frozen",
    title: "Frozen",
    combinedImage: "/images/colored/frozen.png",
    level: "Hard",
  },
  {
    id: "buzz-ligthyear",
    title: "Toy Story",
    combinedImage: "/images/colored/toy2.png",
    level: "Medium",
  },
  {
    id: "train_dragon",
    title: "How to Train Your Dragon",
    combinedImage: "/images/colored/How to Train Your Dragon.png",
    level: "Medium",
  },
  {
    id: "incredibles",
    title: "The Incredibles",
    combinedImage: "/images/colored/The Incredibles.png",
    level: "Medium",
  },
  {
    id: "lion",
    title: "The Lion",
    combinedImage: "/images/colored/the Lion.png",
    level: "Hard",
  },
  {
    id: "jessie",
    title: "Toy Story",
    combinedImage: "/images/colored/toy3.png",
    level: "Medium",
  },
];
