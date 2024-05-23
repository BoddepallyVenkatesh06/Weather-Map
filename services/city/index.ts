import { handleRequestError } from "@/utils";
import Request from "..";
import { Endpoints } from "../endpoints";
import {
  CityRequestParams,
  DeleteCityRequestParams,
  UserCityRequestParams,
} from "./types";

export const city = async (data: CityRequestParams) => {
  try {
    const response = await Request.post(Endpoints.city, {
      data,
      headers: { "Content-Type": "application/json" },
    });
    return response;
  } catch (error) {
    handleRequestError(error);
  }
};

export const getAllUserCities = async (params: UserCityRequestParams) => {
  try {
    const response = await Request.get(Endpoints.getCities, {
      params: params,
    });
    return response;
  } catch (error) {
    handleRequestError(error);
  }
};

export const deleteCity = async (params: DeleteCityRequestParams) => {
  try {
    const response = await Request.delete(Endpoints.deleteCity, {
      params: params,
    });
    return response;
  } catch (error) {
    handleRequestError(error);
  }
};
