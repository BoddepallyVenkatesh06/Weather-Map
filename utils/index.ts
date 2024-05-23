import { truncate } from "@/helper";
import { AxiosError } from "axios";
import { Toastify } from "./toast";

export const handleRequestError = (
  error: AxiosError | any,
  defaultMessage = "An error occurred."
) => {
  let useMessage = null;
  let statusCode = error.response?.status?.toString();
  if (statusCode?.startsWith("4") || statusCode?.startsWith("5")) {
    const data = error?.response?.data;
    useMessage =
      truncate(data, 53) ||
      truncate(data?.message, 60) ||
      data?.message ||
      (data?.errors && data?.errors[0]?.message) ||
      error?.message ||
      defaultMessage;
  }
  Toastify.error(useMessage ?? defaultMessage);
};
