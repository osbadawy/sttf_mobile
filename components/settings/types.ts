export type Option = { label: string; value: string };
export type PlayHand = "right" | "left";

export const getDemonym = (c: WorldCountry): string => {
  const eng = c.demonyms?.eng;
  return eng?.m || eng?.f || c.demonym || c.name.common;
};

export type WorldCountry = {
  cca2: string;
  name: { common: string };
  demonyms?: { eng?: { m?: string; f?: string } };
  demonym?: string; // some versions still expose this
};
