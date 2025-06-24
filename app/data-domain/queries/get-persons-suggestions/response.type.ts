export type PersonsData = {
  personen: {
    key: string;
    vorname: string;
    nachname: string;
    adresse: {
      strasse: string;
      hausnummer: string;
      plz: string;
      stadt: string;
    };
    geburtsdatum: string;
    telefonnummer: string;
  }[];
};
