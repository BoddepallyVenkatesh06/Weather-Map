export const COUNTRY_API_BASE_URL = process.env.NEXT_PUBLIC_COUNTRY_URL;
export const WEATHER_FORECAST_URL = process.env.NEXT_PUBLIC_WEATHER_API;
export const WEATHER_DETAILS = process.env.NEXT_PUBLIC_WEATHER_DETAILS;
export const WEATHER_REPORT = process.env.NEXT_PUBLIC_WEATHER_VISUAL_API;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export class Endpoints {
  static country = COUNTRY_API_BASE_URL;
  static weatherForecast = WEATHER_FORECAST_URL + "weather";
  static currentWeatherDetails = WEATHER_DETAILS + "current";
  static hourlyWeatherDetails = WEATHER_DETAILS + "hourly";
  static visualCrossingWeatherReport = WEATHER_REPORT + `timeline/`;
  static city = BASE_URL + `city`;
  static getCities = BASE_URL + `getCity`;
  static deleteCity = BASE_URL + `deleteCity`;
}
