import axios, { AxiosInstance } from "axios";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: "https://6ft4bgs2e6.execute-api.ap-south-1.amazonaws.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
export const InvoiceaxiosClient: AxiosInstance = axios.create({
  baseURL: "https://4t8rhvq1ye.execute-api.ap-south-1.amazonaws.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
export const getAuthHeaders = (token: string) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
