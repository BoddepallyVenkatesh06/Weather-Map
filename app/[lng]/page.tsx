"use client";
import Logout from "@/assets/SignOff Icon.svg";
import Plus from "@/assets/plus.svg";
import Button from "@/components/button";
import { WeatherChart } from "@/components/chart";
import City from "@/components/city";
import Spinner from "@/components/loader";
import Map from "@/components/map";
import Modal, { IModalType } from "@/components/modal";
import GooglePlaceSearch from "@/components/search";
import CustomTable from "@/components/table";
import { useCountryData } from "@/context";
import { items, truncate } from "@/helper";
import Request from "@/services";
import { city } from "@/services/city";
import { Endpoints } from "@/services/endpoints";
import {
  FilterWeatherInformation,
  getWeatherForecasts,
  weatherInformation,
} from "@/services/weather";
import { handleRequestError } from "@/utils";
import { Toastify } from "@/utils/toast";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { TbError404Off } from "react-icons/tb";
import { useTranslation } from "../i18n/client";
import { languages } from "../i18n/settings";
import { LanguageSwitcher } from "./components/switcher";

type WeatherResponse = {
  temp: string;
  humidity: string;
  windspeed: string;
  datetime: string;
  dew: string;
};
type IFilterProps = { startDate: string; endDate: string };
type IStateType = {
  startDate: Date;
  endDate: Date;
  key: string;
};

export default function Home({ params: { lng } }: { params: { lng: string } }) {
  // if (languages.indexOf(lng) < 0) lng = fallbackLng;
  const session = useSession();
  const { t } = useTranslation(lng);
  const { i18n } = useTranslation(lng);
  const [weatherForecastArray, setWeatherForecastArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    value,
    setValue,
    countryName,
    allCountriesArray,
    tableArray,
    coordinate,
    weatherData,
    setWeatherData,
  } = useCountryData();
  const cache = useRef<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<IModalType>(null);
  const modal = useRef<IModalType>(null);
  const logoutRef = useRef<IModalType>(null);
  const [, setWeatherChartData] = useState([]);
  const { data } = session;
  const [image, setImage] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const autoCompleteReference = useRef(null);
  const countryRegex = /<span class="country-name">(.*?)<\/span>/;
  const match = countryName.match(countryRegex);
  const country = match ? match[1] : "";
  const countryParam = country !== "" ? country : countryName;
  const columns = [
    {
      title: `${t("country")}`,
      dataIndex: "name",
      key: "name",
      render: (text: any) => <p className="!text-sm">{text?.common}</p>,
    },
    {
      title: `${t("capital")}`,
      dataIndex: "capital",
      key: "capital",
    },

    {
      title: `${t("capitalCoords")}`,
      dataIndex: "capitalInfo",
      key: "capitalInfo",
      render: (item: any) => (
        <p className="!text-sm">
          {item && item?.latlng && item?.latlng[0]},{" "}
          {item && item?.latlng && item?.latlng[1]}
        </p>
      ),
    },

    {
      title: `${t("currency")}`,
      dataIndex: "currencies",
      key: "currencies",
      render: (value: any) => {
        const values: any = Object.values(value ?? {});
        return (
          <p>
            {values[0]?.name} {values[0]?.symbol}{" "}
          </p>
        );
      },
    },

    {
      title: `${t("continent")}`,
      dataIndex: "continents",
      key: "continents",
    },

    {
      title: `${t("region")}`,
      dataIndex: "subregion",
      key: "subregion",
    },

    {
      title: `${t("coat")}`,
      dataIndex: "coatOfArms",
      key: "coatOfArms",
      render: (value: any) => (
        <Image src={value?.svg} alt="flag" width={20} height={20} />
      ),
    },
    {
      title: `${t("flag")}`,
      dataIndex: "flags",
      key: "flags",
      render: (value: any) => (
        <Image src={value?.svg} alt="flag" width={20} height={20} />
      ),
    },
    {
      title: `${t("maps")}`,
      dataIndex: "maps",
      key: "maps",
      render: (text: any) => (
        <a
          href={`${text?.googleMaps}`}
          target="_blank"
          className="text-blue-500"
        >
          {truncate(text?.googleMaps, 15)}
        </a>
      ),
    },

    {
      title: `${t("coordinate")}`,
      dataIndex: "latlng",
      key: "latlng",
      render: (value: string) => (
        <p>
          lat-lng {value && value[0]},{value && value[1]}
        </p>
      ),
    },

    {
      title: `${t("timezone")}`,
      dataIndex: "timezones",
      key: "timezones",
      render: (text: string) => {
        return <p>{truncate(text, 3)}</p>;
      },
    },
    {
      title: `${t("Fifa")}`,
      dataIndex: "fifa",
      key: "fifa",
    },
    {
      title: `${t("population")}`,
      dataIndex: "Population",
      key: "population",
    },

    {
      title: `${t("area")}`,
      dataIndex: "area",
      key: "area",
    },
  ];
  const [state, setState] = useState<IStateType[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const handleOpenModal = () => {
    modalRef?.current?.open();
  };

  const fetchCountryInfo = async (country: string) => {
    setLoading(true);
    if (languages.indexOf(lng) < 0) return;
    if (!country && !countryName) {
      setLoading(false);
    } else {
      try {
        const res = await Request.get(`${Endpoints.country}${country}`);
        if (countryName && res) {
          allCountriesArray(res);
        }
      } catch (error) {
        handleRequestError(error);
      }
    }
    setLoading(false);
  };
  const fetchChartWeatherForecast = async (location: string) => {
    setLoading(true);
    if (!location || location === "") {
      setLoading(false);
    } else {
      if (cache.current[location]) {
        const data = cache.current[location];
        setWeatherChartData(data);
      } else {
        const res = await getWeatherForecasts({ location: location });
        if (res) {
          cache.current[location] = res?.forecasts;
          setWeatherChartData(res?.forecasts);
        } else {
          setWeatherChartData([]);
        }
      }
    }
    setLoading(false);
  };

  const fetchWeatherInfo = async () => {
    setLoading(true);
    if (languages.indexOf(lng) < 0) return;
    const res = await weatherInformation(
      `${coordinate.lat},${coordinate.lng}/today`,
      {
        key: `${process.env.NEXT_PUBLIC_WEATHER_VISUAL_API_KEY}`,
      }
    );
    if (res) {
      setWeatherData(res?.days);
    }
    setLoading(false);
  };

  const filterWeatherInformation = async ({
    startDate,
    endDate,
  }: IFilterProps) => {
    setLoading(true);
    if (languages.indexOf(lng) < 0) return;
    const res = await FilterWeatherInformation(
      `${coordinate.lat},${coordinate.lng}/${startDate}/${endDate}`
    );
    if (res) {
      setWeatherForecastArray(res?.days);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCountryInfo(countryParam);
  }, [country, countryName, coordinate]);

  useEffect(() => {
    fetchWeatherInfo();
  }, [coordinate]);

  const handleSubmit = async () => {
    if (!value || !image) return;

    const formData = new FormData();
    formData.append("file", image as File);
    formData.append("upload_preset", "weather");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env
          .NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const res = await response.json();
      setUrl(res.public_id);
    } catch (error) {
      return;
    }
    setIsSubmitting(true);
    setLoading(true);

    try {
      const res = await city({
        name: value,
        image: `${
          url
            ? url
            : `https://res.cloudinary.com/dgvoxqjr2/image/upload/v1712578369/country_rlq3kv.jpg`
        }`,
        email: data?.user?.email!,
        coordinates: { ...coordinate },
      });
      if (res?.statusCode === 201) {
        Toastify.success(res?.message);
        modalRef?.current?.close();
        setImage(null);
        setValue("");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Toastify.error("An error ocurred");
    }
    setLoading(false);
    setIsSubmitting(false);
    setImage(null);
  };

  const temps = weatherForecastArray?.map(
    (weather: WeatherResponse) => weather.temp
  );
  const chartDates = weatherForecastArray?.map(
    (weather: WeatherResponse) => weather.datetime
  );
  const humidity = weatherForecastArray?.map(
    (weather: WeatherResponse) => weather.humidity
  );
  const wind = weatherForecastArray?.map(
    (weather: WeatherResponse) => weather.windspeed
  );

  const pressure = weatherForecastArray?.map(
    (weather: WeatherResponse) => weather.dew
  );

  const areaSeries = [
    {
      name: "Temperature",
      data: temps,
    },

    {
      name: "Humidity",
      data: humidity,
    },
    {
      name: "Wind Speed",
      data: wind,
    },
    {
      name: "Pressure",
      data: pressure,
    },
  ];

  const weatherColumns = [
    {
      title: `${t("dateTime")}`,
      dataIndex: "datetime",
      key: "datetime",
    },
    {
      title: `${t("cloudCover")}`,
      dataIndex: "cloudcover",
      key: "cloudcover",
    },
    {
      title: `${t("condition")}`,
      dataIndex: "conditions",
      key: "conditions",
    },

    {
      title: `${t("humidity")}`,
      dataIndex: "humidity",
      key: "humidity",
    },

    {
      title: `${t("pressure")}`,
      dataIndex: "pressure",
      key: "pressure",
    },

    {
      title: `${t("snow")}`,
      dataIndex: "snow",
      key: "snow",
    },

    {
      title: `${t("sunrise")}`,
      dataIndex: "sunrise",
      key: "sunrise",
    },

    {
      title: `${t("dew")}`,
      dataIndex: "dew",
      key: "dew",
    },

    {
      title: `${t("temperature")}`,
      dataIndex: "temp",
      key: "temp",
    },

    {
      title: `${t("windSpeed")}`,
      dataIndex: "windspeed",
      key: "windspeed",
    },

    {
      title: `${t("describe")}`,
      dataIndex: "description",
      key: "description",
    },
  ];

  const weatherSummaryColumns = [
    {
      title: `${t("dateTime")}`,
      dataIndex: "datetime",
      key: "datetime",
    },

    {
      title: `${t("condition")}`,
      dataIndex: "conditions",
      key: "conditions",
    },

    {
      title: `${t("describe")}`,
      dataIndex: "description",
      key: "description",
    },
  ];

  const router = useRouter();
  const handleRouterClick = () => {
    if (session.status === "unauthenticated") {
      router.push("/weather");
    } else {
      router.push("/en");
    }
  };
  if (languages.indexOf(lng) < 0) {
    return (
      <div className="flex items-center justify-center text-white h-screen gap-6 flex-col md:max-w-[100%] w-fu">
        <TbError404Off className="text-white text-8xl" />
        <div>{"We can't find the page you are looking for."}</div>
        {session.status === "unauthenticated" ? (
          <Button className="!w-[22%]" onClick={handleRouterClick}>
            Back to Home
          </Button>
        ) : (
          <Button className="!w-[20%]" onClick={handleRouterClick}>
            Back
          </Button>
        )}
      </div>
    );
  }

  if (session.status === "authenticated")
    return (
      <main className="max-w-[92%] md:max-w-[100%] mx-auto lg:grid grid-flow-col lg:grid-cols-[55%_40%] lg:justify-between bg-dark text-white">
        <Modal
          ref={modal}
          type="post"
          textObj={{ text: t("closeModal"), message: t("placeAdded") }}
        />
        <Modal
          ref={modalRef}
          textObj={{ text: t("closeModal"), message: t("placeAdded") }}
          modalClassName="text-xs"
        >
          <div className="py-5 flex gap-5 flex-col max-w-[90%] mx-auto justify-center">
            <GooglePlaceSearch
              isClassName={false}
              ref={autoCompleteReference}
              textObj={{
                search: t("searchPlace"),
                mapMessage: t("mapMessage"),
                clearValue: t("clear"),
                alert: t("alert"),
              }}
            />
            <div>
              <div
                className="cursor-pointer flex gap-2 justify-between items-center w-full"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                <Button>{t("upload")}</Button>
                <p
                  className={`text-[12px] w-[20%] flex justify-end ${
                    image?.name ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {image ? truncate(image?.name, 10) : t("noFile")}
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/jpeg, image/png, image/jpg, image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setImage(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
          <Button
            className="!bg-primary flex items-center justify-center gap-2"
            disabled={(!value && true) || loading || !image}
            onClick={handleSubmit}
          >
            {loading && <Spinner />} {t("submit")}
          </Button>
        </Modal>

        <Modal
          ref={logoutRef}
          textObj={{ text: t("closeModal") }}
          modalClassName="text-xs"
        >
          <p className="text-white py-8 font-medium text-center">
            Are you sure you want to logout ?
          </p>
          <div className="flex flex-col items-center pb-7">
            <div className="flex gap-4 w-[80%]">
              <Button
                onClick={() => {
                  signOut({ redirect: false, callbackUrl: "/" });
                  router.push("/");
                }}
                className=" !bg-white !text-black "
              >
                Yes
              </Button>
              <Button
                className="!bg-primary"
                onClick={() => logoutRef?.current?.close()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
        <div className=" pl-0 md:pl-8 lg:h-screen lg:overflow-y-scroll">
          <div className="pt-6 sticky top-0 left-0 bg-dark z-20 flex items-center gap-5">
            <div className="w-full md:w-[80%]">
              <GooglePlaceSearch
                isClassName
                ref={autoCompleteReference}
                textObj={{
                  search: t("searchPlace"),
                  mapMessage: t("mapMessage"),
                  clearValue: t("clear"),
                  alert: t("alert"),
                }}
              />
            </div>

            <div className="flex gap-5 items-center">
              <LanguageSwitcher i18n={i18n} lng={lng} path="" />

              <div onClick={() => signOut({ callbackUrl: "/weather" })}>
                <Image src={Logout} alt="icon" className="w-4 cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="relative pt-8 md:pt-10">
            <div className="w-full grid grid-flow-col grid-cols-[50%_45%] gap-2 md:grid-cols-[70%_25%] justify-between items-center">
              <City reloadFlag={isSubmitting} />
              <div
                className="bg-transparent border-2 border-secondary w-full flex flex-col gap-2 items-center justify-center h-[170px] md:h-[190px] rounded-xl cursor-pointer"
                onClick={handleOpenModal}
              >
                <Image src={Plus} alt="add city" />
                <p>{t("addCity")}</p>
              </div>
            </div>

            <div>
              <div className="flex gap-2 justify-between w-full pt-2 md:pt-10 overflow-scroll">
                {items?.map((item, index) => {
                  return (
                    <motion.div
                      key={index}
                      className="bg-secondary px-5 py-3 flex items-center justify-center rounded-sm cursor-not-allowed"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Image src={item} alt="" className="w-7" />
                    </motion.div>
                  );
                })}
              </div>
              <div className="pt-8 md:pt-16">
                <div className="flex justify-between items-center text-sm text-[#ACAFC8] pb-4">
                  <p>
                    {countryParam} {t("weatherForecast")}
                  </p>
                  <p className="text-xs">{t("monthlyForecast")}</p>
                </div>

                <div className="sticky top-0 left-0 z-10 my-5">
                  <CustomTable
                    cols={weatherColumns}
                    rows={weatherData}
                    isLoading={loading}
                    availability={t("weatherData")}
                  />
                </div>
                <div className="lg:w-[600px] overflow-x-scroll mt-10">
                  <p className="text-xs pb-4">{t("note")}</p>
                  <DateRangePicker
                    onChange={(item: any) => {
                      setState([item.selection]);
                      if (state) {
                        filterWeatherInformation({
                          startDate: format(
                            item.selection.startDate,
                            "yyyy-MM-dd"
                          ),
                          endDate: format(item.selection.endDate, "yyyy-MM-dd"),
                        });
                      }
                    }}
                    moveRangeOnFirstSelection={true}
                    months={1}
                    ranges={state}
                    direction="horizontal"
                  />
                </div>

                <div className="flex items-end justify-end py-3">
                  <Button
                    className="!w-[180px] !bg-primary text-xs"
                    disabled={!areaSeries[0]?.data?.length}
                  >
                    <CSVLink data={areaSeries} className="text-xs py-5 px-7">
                      {t("download")}
                    </CSVLink>
                  </Button>
                </div>
                {weatherForecastArray ? (
                  <WeatherChart
                    id="area-chart"
                    type="line"
                    colors={["#B619A6", "#380ABB", "#fff", "#00FF00"]}
                    series={areaSeries}
                    categories={chartDates}
                    curve="smooth"
                    width={"100%"}
                  />
                ) : (
                  <WeatherChart
                    id="area-chart"
                    type="line"
                    colors={["#B619A6", "#380ABB"]}
                    series={[]}
                    categories={[]}
                    curve="smooth"
                    width={"100%"}
                  />
                )}

                <div className="mt-7 mb-4 md:h-[45vh] sticky top-0 left-0 z-10 overflow-y-scroll">
                  <CustomTable
                    cols={weatherSummaryColumns}
                    rows={weatherForecastArray}
                    isLoading={loading}
                    availability={t("weatherData")}
                  />
                </div>
              </div>
            </div>

            {/* <div className="grid grid-flow-col grid-cols-[auto] items-start overflow-x-scroll gap-2 py-6 lg:pb-8">
              {loading ? (
                <div className="flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <>
                  {weatherChartData.length === 0 ? (
                    <p className="text-sm ">{t("weatherStatus")}</p>
                  ) : (
                    weatherChartData?.map(
                      (weather: WeatherResponse, index: number) => {
                        return (
                          <div
                            key={index}
                            className="text-xs items-center gap-8"
                          >
                            <p className="text-[8px]">{weather?.day}</p>
                            <p className="text-[8px]">{weather?.text}</p>
                          </div>
                        );
                      }
                    )
                  )}
                </>
              )}
            </div> */}
          </div>
        </div>

        <div className="w-full sticky top-0 left-0 z-20 flex flex-col justify-between pb-8 h-[100vh] overflow-y-scroll">
          <div className="h-[80vh]">
            <Map
              coordinates={t("coordinates")}
              currentLocation={t("currentLocation")}
              locationDetails={t("locationDetails")}
              url={t("url")}
              website={t("website")}
              weatherInfo={t("weatherInfo")}
              summary={t("summary")}
              temperature={t("temperature")}
              pressure={t("pressure")}
              humidity={t("humidity")}
              dewPoint={t("dewPoint")}
              windChill={t("windChill")}
              mapOfflineMessage={t("mapOfflineMessage")}
              name={t("name")}
              noWeather={t("noWeather")}
              prep={t("prep")}
            />
          </div>
          <div className="md:h-[30vh] sticky top-0 left-0 z-10 overflow-y-scroll">
            <CustomTable
              cols={columns}
              rows={tableArray}
              isLoading={loading}
              availability={t("availability")}
              isHeight
            />
          </div>
        </div>
      </main>
    );
}
