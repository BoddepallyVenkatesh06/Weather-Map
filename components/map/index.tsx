"use client";
import { useCountryData } from "@/context";
import {
  getCurrentWeatherDetails,
  getHourlyWeatherDetails,
} from "@/services/weather";
import { CurrentWeatherDetailsParams } from "@/services/weather/types";
import { handleRequestError } from "@/utils";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerClusterer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Offline, Online } from "react-detect-offline";
import Spinner from "../loader";

type IMap = {
  currentLocation?: string;
  locationDetails?: string;
  coordinates?: string;
  url?: string;
  website?: string;
  weatherInfo?: string;
  summary?: string;
  temperature?: string;
  pressure?: string;
  humidity?: string;
  dewPoint?: string;
  windChill?: string;
  name?: string;
  mapOfflineMessage?: string;
  noWeather?: string;
  prep?: string;
  width?: number;
  zoom?: number;
  setZoom?: number;
};
const Map = ({
  coordinates,
  currentLocation,
  locationDetails,
  url,
  website,
  weatherInfo,
  summary,
  temperature,
  pressure,
  humidity,
  dewPoint,
  windChill,
  mapOfflineMessage,
  name,
  noWeather,
  prep,
  width,
  zoom,
  setZoom,
}: IMap) => {
  const [map, setMap] = useState<any>(null);
  const {
    place,
    coordinate,
    setCoordinate,
    weatherData,
    closeNotification,
    openInfo,
    setOpenInfo,
  } = useCountryData();
  const [, setCurrentWeatherData] = useState<any>();
  const [, setHourlyWeatherData] = useState<any>();

  const fetchCurrentWeatherDetails = async (
    coordinate: CurrentWeatherDetailsParams
  ) => {
    if (!coordinate) return;
    try {
      const res = await getCurrentWeatherDetails(coordinate);
      setCurrentWeatherData(res?.current);
      // setWeatherData(res?.current);
    } catch (error) {
      handleRequestError(error);
    }
  };

  const fetchHourlyWeatherDetails = async (
    coordinate: CurrentWeatherDetailsParams
  ) => {
    if (!coordinate) return;
    try {
      const res = await getHourlyWeatherDetails(coordinate);
      setHourlyWeatherData(res?.hourly);
    } catch (error) {
      handleRequestError(error);
    }
  };

  // useEffect(() => {
  //   // fetchCurrentWeatherDetails(coordinate);
  //   // fetchHourlyWeatherDetails(coordinate);
  // }, [coordinate]);

  const containerStyle = {
    width: "100%",
    height: `${width ? `${width}vh` : "500px"}`,
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`,
  });

  const onLoad = useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds(coordinate);
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const handleMarkerClick = (lat: number, lng: number) => {
    map?.setZoom(15);
    map?.panTo({ lat, lng });
  };

  function handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: google.maps.InfoWindow
  ) {
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  useEffect(() => {
    new google.maps.InfoWindow({});
    const infoWindow = new google.maps.InfoWindow();
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const { lat, lng } = pos;
          setCoordinate({ lat, lng });
        },

        () => {
          handleLocationError(true, infoWindow);
        }
      );
    } else {
      handleLocationError(false, infoWindow);
    }
  }, []);

  type IPosition = {
    lat: number;
    lng: number;
  };
  const generatePlaces = (position: IPosition) => {
    const _places = [];
    for (let i = 0; i < 7; i++) {
      const direction = Math.random() < 0.5 ? -2 : 2;
      _places.push({
        lat: position.lat + Math.random() / direction,
        lng: position.lng + Math.random() / direction,
      });
    }
    return _places;
  };

  const places = useMemo(() => generatePlaces(coordinate), [coordinate]);

  return (
    <>
      <Online>
        <div>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              mapContainerClassName="bg-[##3A3B65]"
              center={coordinate}
              zoom={zoom ?? 12}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onZoomChanged={() => {}}
              onCenterChanged={() => {
                map?.setZoom(setZoom ?? 10);
              }}
              onClick={closeNotification}
              options={{
                mapTypeControl: false,
                panControl: true,
                // styles: [
                //   {
                //     featureType: "all",
                //     stylers: [{ color: "#333" }],
                //   },
                //   {
                //     featureType: "road",
                //     stylers: [{ color: "#000" }],
                //   },

                //   {
                //     featureType: "water",
                //     stylers: [{ color: "#fff" }],
                //   },

                //   {
                //     featureType: "road.arterial",
                //     elementType: "geometry",
                //     stylers: [{ color: "#4E4DB0" }],
                //   },
                //   {
                //     featureType: "landscape",
                //     elementType: "labels",
                //     stylers: [{ color: "#380ABB" }],
                //   },
                // ],
                controlSize: null,
                disableDefaultUI: true,
                fullscreenControl: true,
                // streetViewControl: false,
              }}
            >
              <Marker
                onClick={() => {
                  handleMarkerClick(coordinate.lat, coordinate.lng);
                  setOpenInfo(true);
                }}
                position={coordinate}
                animation={google.maps.Animation.BOUNCE}
                draggable
                zIndex={10000}
                // icon={{
                //   // url: "",
                //   scaledSize: new window.google.maps.Size(30, 30),
                // }}
              >
                {openInfo && (
                  <InfoWindow onCloseClick={() => setOpenInfo(false)}>
                    <div className="text-black font-poppins text-xs shadow-lg pr-4 relative z-50">
                      <div className="font-medium py-2">
                        {place?.country && (
                          <p>
                            {currentLocation} : {place?.country}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="font-medium underline">
                          {locationDetails} :
                        </p>

                        <p className="py-2">
                          {coordinates} :
                          {` Latitude: ${coordinate?.lat} Longitude: ${coordinate?.lng}`}
                        </p>
                        {/* <div>
                          {url} :
                          <a
                            href={countryInfo?.url}
                            target="_blank"
                            className="text-blue-600"
                          >
                            {truncate(countryInfo?.url, 30)}
                          </a>
                        </div> */}
                        {place?.country && (
                          <p className="py-1">
                            {name} : {place?.country}
                          </p>
                        )}
                        {/* <p>
                          {website}:
                          <a
                            href={countryInfo?.website}
                            className="text-blue-600"
                            target="_black"
                          >
                            {countryInfo?.website}
                          </a>
                        </p> */}
                      </div>

                      <div className="py-2">
                        <h2 className="font-medium underline">
                          {weatherInfo}:
                        </h2>
                        {weatherData ? (
                          <>
                            <div className="flex items-center gap-4 py-2">
                              {weatherData?.map(
                                (weather: any, index: number) => {
                                  return (
                                    <div key={index}>
                                      <p>
                                        {summary} : {weather?.description}
                                      </p>
                                      <p>
                                        {temperature} :{weather?.temp}
                                      </p>
                                      <p>
                                        {pressure} : {weather?.pressure}
                                      </p>
                                      <p>
                                        {humidity} : {weather?.humidity}
                                      </p>
                                      <p>
                                        {dewPoint} : {weather?.dew}
                                      </p>
                                      <p>
                                        {windChill} : {weather?.windspeed}
                                      </p>
                                      <p>
                                        {prep} :
                                        {weather?.preciptype &&
                                          weather?.preciptype[0]}
                                      </p>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </>
                        ) : (
                          <p className="text-center pt-2 font-medium">
                            {noWeather}
                          </p>
                        )}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
              <MarkerClusterer>
                {(clusterer) => (
                  <div>
                    {places.map((obj: any, i) => (
                      <Marker
                        onClick={() =>
                          handleMarkerClick(coordinate.lat, coordinate.lng)
                        }
                        key={i}
                        position={obj}
                        animation={google.maps.Animation.DROP}
                      />
                    ))}
                  </div>
                )}
              </MarkerClusterer>
            </GoogleMap>
          ) : (
            <div className="flex items-center justify-center h-[440px]">
              <Spinner />
            </div>
          )}
        </div>
      </Online>
      <Offline>
        <div className="text-xs flex items-center justify-center h-[500px]">
          {mapOfflineMessage}
        </div>
      </Offline>
    </>
  );
};

export default Map;
