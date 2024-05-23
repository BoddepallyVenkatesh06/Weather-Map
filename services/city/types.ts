export interface CityRequestParams {
  name: string;
  image: string;
  email: string;
  coordinates: { lat: number; lng: number };
}

export interface UserCityRequestParams {
  email: string;
}

export interface DeleteCityRequestParams {
  email: string;
  cityName: string;
}
