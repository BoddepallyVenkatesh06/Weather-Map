import type { Metadata } from "next";
import Script from "next/script";
import "../[lng]/globals.css";
import Template from "../[lng]/template";
import { poppins } from "../fonts";
import Provider from "../provider/layout";

export const metadata: Metadata = {
  title: "Weather",
  description: "Get weather details",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <Template>
          <body className={`${poppins.variable} font-poppins overflow-hidden`}>
            {children}
            <Script
              type="application/javascript"
              src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&libraries=places`}
              strategy="beforeInteractive"
            />
          </body>
        </Template>
      </Provider>
    </html>
  );
}
