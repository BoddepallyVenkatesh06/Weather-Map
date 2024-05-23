"use client";
import { useCountryData } from "@/context";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Offline, Online } from "react-detect-offline";
import Input from "../input";

export interface MyObject {
  countryName: string;
  coordinates: { lat: number; lng: number };
  // Add other properties as needed
}
type ISearchPropsType = {
  isClassName?: boolean;
  textObj: {
    search: string;
    mapMessage: string;
    clearValue: string;
    alert: string;
  };
};
const GooglePlaceSearch: React.ForwardRefRenderFunction<
  {},
  ISearchPropsType
> = (
  { isClassName, textObj: { search, mapMessage, clearValue, alert } },
  ref
) => {
  const router = useRouter();
  const session = useSession();
  const searchParams = useSearchParams();
  const searchParamsQuery = searchParams.get("query");
  let autoCompleteRef = useRef(null);
  const [query, ,] = useState(searchParamsQuery ?? "");
  const {
    addPlace,
    coordinate,
    setCoordinate,
    setValue,
    countryName,
    setCountryName,
    setCountryInfo,
    closeNotification,
    handleIsNotificationOpen,
  } = useCountryData();

  const checkIfObjectInArray = (
    object: MyObject,
    array: MyObject[]
  ): boolean => {
    return array.some(
      (item) =>
        item.countryName === object.countryName &&
        item.coordinates.lat === object.coordinates.lat
    );
  };

  const addObjectToList = (object: MyObject) => {
    let currentList: MyObject[] = [];
    const storedList = localStorage.getItem("myCountries");
    if (storedList) {
      currentList = JSON.parse(storedList);
    }
    const obj = checkIfObjectInArray(object, currentList);
    if (obj || object.countryName === "") {
      return;
    } else {
      if (session?.status === "unauthenticated") {
        currentList.push(object);
        localStorage.setItem("myCountries", JSON.stringify(currentList));
      }
      return;
    }
  };

  const countryRegex = /<span class="country-name">(.*?)<\/span>/;
  const match = countryName.match(countryRegex);
  const country = match ? match[1] : "";
  const localityRegex = /<span class="locality">(.*?)<\/span>/;
  const localityMatch = countryName.match(localityRegex);
  const locality = localityMatch ? localityMatch[1] : "";

  useEffect(() => {
    addObjectToList({
      countryName: locality ? locality : country,
      coordinates: { lat: coordinate.lat, lng: coordinate.lng },
    });
  }, [countryName]);

  const updateURLFromSearchQuery = (query: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("query", query);
    router.push(`?${params.toString()}`);
    handleIsNotificationOpen();
  };

  const options = {
    fields: [
      "formatted_address",
      "geometry",
      "name",
      "address_components",
      "adr_address",
      "url",
      "website",
    ],
    strictBounds: false,
  };
  let autoComplete: any;

  const loadGoogleAutoComplete = async (autoCompleteRef: any) => {
    autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef?.current,
      options
    );

    autoComplete.addListener("place_changed", () => {
      const place = autoComplete.getPlace();
      setCountryInfo(place);

      if (!place?.geometry || !place?.geometry.location) {
        window.alert(alert + place?.name + "");
        return;
      } else {
        setCoordinate({
          ...coordinate,
          lat: place?.geometry.location.lat(),
          lng: place?.geometry.location.lng(),
        });
        addPlace({
          country: place?.formatted_address,
          lat: place?.geometry.location.lat(),
          long: place?.geometry.location.lat(),
        });
        setCountryName(place?.adr_address);
        place?.formatted_address;
        setValue(place?.formatted_address);
        updateURLFromSearchQuery(place?.address_components[0]?.long_name);
      }
    });
  };

  useEffect(() => {
    if (typeof window !== undefined && !window.google) {
      setTimeout(() => {
        loadGoogleAutoComplete(autoCompleteRef);
      }, 1000);
    }
    loadGoogleAutoComplete(autoCompleteRef);
  }, []);

  return (
    <div className={`${isClassName ? "w-full" : "mt-4"} `}>
      <Offline>
        <div>
          <p className="pb-4 text-xs">{mapMessage}</p>
          <Input
            defaultValue={query}
            type="search"
            clearValue={clearValue}
            onChange={(event) => {
              setValue(event?.target?.value);
              closeNotification();
            }}
            placeholder={`${search}`}
            className="pac-input"
          />
        </div>
      </Offline>
      <Online>
        <Input
          defaultValue={query}
          type="search"
          ref={autoCompleteRef}
          clearValue={clearValue}
          onChange={(event) => {
            setValue(event?.target?.value);
            closeNotification();
          }}
          placeholder={`${search}`}
          className="pac-input"
        />
      </Online>
    </div>
  );
};

export default forwardRef(GooglePlaceSearch);
