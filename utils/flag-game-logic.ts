import { countries } from "@/mock/countries";
import { Country, Question } from "@/types";

export const generateQuestion = (): Question => {
  const correctCountry =
    countries[Math.floor(Math.random() * countries.length)];

  const wrongOptions: Country[] = [];
  while (wrongOptions.length < 3) {
    const randomCountry =
      countries[Math.floor(Math.random() * countries.length)];
    if (
      randomCountry.code !== correctCountry.code &&
      !wrongOptions.find((c) => c.code === randomCountry.code)
    ) {
      wrongOptions.push(randomCountry);
    }
  }

  const options = [...wrongOptions, correctCountry].sort(
    () => Math.random() - 0.5
  );

  return {
    correctCountry,
    options,
  };
};
