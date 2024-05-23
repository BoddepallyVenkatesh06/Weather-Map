"use client";
import { WeatherProvider } from "@/context";

export default function Template({ children }: { children: React.ReactNode }) {
  return <WeatherProvider>{children}</WeatherProvider>;
}
