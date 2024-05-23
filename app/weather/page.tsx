"use client";
import Spinner from "@/components/spinner";
import Weather from "@/components/weather";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Weather />
      </Suspense>
    </>
  );
}
