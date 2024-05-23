import { languages } from "@/app/i18n/settings";
import Dutch from "@/assets/de.svg";
import English from "@/assets/gb.svg";
import { i18n } from "i18next";
import Image from "next/image";
import Link from "next/link";

export const LanguageSwitcher = ({
  lng,
  path = "",
}: {
  i18n: i18n;
  lng: string;
  path?: string;
}) => {
  return (
    <div>
      {languages
        .filter((l) => lng !== l)
        .map((l, index) => {
          return (
            <span key={l}>
              {index > 0 && " or "}
              <Link href={`/${l}${path}`}>
                {l === "en" ? (
                  <div className="flex gap-2 text-sm items-center">
                    <Image
                      src={English}
                      alt="flag"
                      className="w-[30px] h-[30px]"
                    />
                  </div>
                ) : (
                  <div className="flex gap-2 text-sm items-center">
                    <Image
                      src={Dutch}
                      alt="flag"
                      className="w-[30px] h-[30px]"
                    />
                  </div>
                )}
              </Link>
            </span>
          );
        })}
    </div>
  );
};
