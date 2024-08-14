import { QuoteFormDataToSendType } from "../types/quote";
import { instance } from "./axios";

export const createQuote = async (data: QuoteFormDataToSendType) => {
  return await instance.post("/quotes", data);
};

export const getQuotes = async ({
  page,
  queryString,
}: {
  page?: number | string;
  queryString?: string;
}) => {
  // return await instance.get("/quotes");
  return instance.get(
    `/quotes?page=${page ? page : ""}&limit=${page ? "2" : ""}${
      queryString ? `&${queryString}` : ""
    }`
  );
};

export const getQuote = async (id: string) => {
  return await instance.get(`/quotes/${id}`);
};

export const updateQuote = async ({
  id,
  data,
}: {
  id: string;
  data: QuoteFormDataToSendType;
}) => {
  return await instance.put(`/quotes/${id}`, data);
};

export const deleteQuote = async (id: string) => {
  return await instance.delete(`/quotes/${id}`);
};
