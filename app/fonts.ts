import { Lato, Poppins } from "next/font/google";

export const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["400", "700"],
});

export const poppins = Poppins({
  weight: ["300", "500"],
  subsets: ["latin"],
  variable: "--font-poppins",
});
