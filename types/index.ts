export type Game = {
  id: string;
  title: string;
  description: string;
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
