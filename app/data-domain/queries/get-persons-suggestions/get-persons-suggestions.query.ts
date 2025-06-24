import type { PersonsData } from './response.type';

export const key = "getPersonsSuggestions";


const RandomFirstNames = [
  "Max",
  "Moritz",
  "Lukas",
  "Anna",
  "Laura",
  "Julia",
  "Tim",
  "Felix",
];
const RandomLastNames = [
  "Mustermann",
  "Müller",
  "Schmidt",
  "Schneider",
  "Fischer",
  "Weber",
  "Hoffmann",
];

export const getPersonsSuggestionsQuery = () => {
  return new Promise<PersonsData>((resolve) => {
    setTimeout(() => {
      // simulate backend data change
      // const randomFirstName = RandomFirstNames[Math.floor(Math.random() * RandomFirstNames.length)];
      // const randomLastName = RandomLastNames[Math.floor(Math.random() * RandomLastNames.length)];
      resolve({personen: [{
          key: "1",
          vorname: "Max",
          nachname: "Mustermann",
          adresse: {
            strasse: "Musterstraße 1",
            hausnummer: "1",
            plz: "12345",
            stadt: "Musterstadt",
          },
          geburtsdatum: "1990-01-01",
          telefonnummer: "1234567890",
        },
        ]});
    }, (2000 + Math.random() * 3000));
  });
};
