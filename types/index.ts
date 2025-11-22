import { LucideIcon } from "lucide-react";

export type Game = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  categoryId: string;
  players: string;
  difficulty: string;
  color: string;
  image: string;
  webUrl: string;
  textIcon: string;
};

export type Category = {
  id: string;
  title: string;
};

export interface Country {
  name: string;
  flag: string;
  code: string;
}

export interface Question {
  correctCountry: Country;
  options: Country[];
}
