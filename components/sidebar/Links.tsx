import Achievement from "@/assets/achievement icon.svg";
import Dark from "@/assets/light,dark mode.svg";
import Ball from "@/assets/pokemon ball icon.svg";
import { IRoutesType, Routes } from "./routes";

export const appRoutes: IRoutesType[] = [
  {
    id: 1,
    path: Routes.dashboard,
    icon: Ball,
  },

  {
    id: 2,
    path: Routes.order,
    icon: Ball,
  },
  { id: 3, path: Routes.achievement, icon: Achievement },
  { id: 4, path: Routes.files, icon: Dark },
];
