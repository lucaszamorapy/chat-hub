"use server";

import axios, { AxiosHeaders } from "axios";
import https from "https";
import { cookies } from "next/headers";
import { IData } from "../types";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      const headers = new AxiosHeaders(config.headers);
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }
  }
  return config;
});



export const formatarError = async (error: any): Promise<IData> => {
  console.log(error)
  const erroFormatado = {
    resultado: error.resultado,
    erro: true,
    mensagem:
      error?.mensagem ||
      error?.response?.data?.mensagem ||
      "Erro inesperado ou falha de conexão com o servidor.",
    mensagemApi:
      error?.mensagemApi ||
      error?.response?.data?.mensagemApi ||
      "Erro ao comunicar com a API."
  };
  console.error(erroFormatado.mensagem || erroFormatado.mensagemApi)
  return erroFormatado;
};
