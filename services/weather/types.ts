export interface WeatherRequestParams {
  location: string;
}

export interface CurrentWeatherDetailsParams {
  lat: number;
  lng: number;
}

export interface CurrentWeatherServicesRequestParams {
  key: string;
}
