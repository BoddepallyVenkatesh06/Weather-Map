import Pakistan from "@/assets/london.svg";
import Mosco from "@/assets/mosco.svg";

export interface CountryEntries {
  country: string;
  image: any;
}

export const countryDataEntries: CountryEntries[] = [
  { country: "Lahore, Pakistan", image: Pakistan },
  { country: "Moscow, Russia", image: Mosco },
  { country: "Rivers, Scotland", image: Pakistan },
];
