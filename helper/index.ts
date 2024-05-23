import Icon1 from "@/assets/Icon (1).svg";
import Icon2 from "@/assets/Icon (2).svg";
import Icon3 from "@/assets/Icon (3).svg";
import Icon4 from "@/assets/Icon (4).svg";
import Icon5 from "@/assets/Icon (5).svg";
import Icon6 from "@/assets/Icon (6).svg";
import Icon7 from "@/assets/Icon (7).svg";
import Icon8 from "@/assets/Icon (8).svg";
import Pakistan from "@/assets/london.svg";
import Mosco from "@/assets/mosco.svg";

export default function selectRandomImage(images: string[]): string | null {
  if (images.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

export const items = [Icon1, Icon2, Icon3, Icon4, Icon5, Icon6, Icon7, Icon8];
export const imageUrls = [Pakistan, Mosco];

export const truncate = (str: string, n: number): string => {
  if (str?.length <= n) {
    return str;
  }
  return str?.slice(0, n) + "...";
};

export const formatLargeNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
