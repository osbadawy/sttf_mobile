// components/settings/countryOptions.ts
import countriesData from "world-countries";

type Demonyms = { eng?: { m?: string; f?: string } };
type CountryRec = {
  cca2: string;                   // ISO alpha-2 (e.g., "IT", "SA")
  name: { common: string };
  demonyms?: Demonyms;
  demonym?: string;               // some versions still expose this
};

export type CountryOption = { label: string; value: string }; // label = demonym, value = cca2

export const getDemonym = (c: CountryRec): string => {
  const eng = c.demonyms?.eng;
  return eng?.m ?? eng?.f ?? c.demonym ?? c.name.common;
};

export const buildNationalityOptions = (): CountryOption[] => {
  const list = (countriesData as CountryRec[])
    .filter((c) => typeof c.cca2 === "string" && /^[A-Z]{2}$/.test(c.cca2))
    .map((c) => ({ label: getDemonym(c), value: c.cca2 }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return list;
};

export const buildNationalityLabelMap = (options: CountryOption[]): Map<string, string> => {
  const m = new Map<string, string>();
  for (const o of options) m.set(o.value, o.label);
  return m;
};
