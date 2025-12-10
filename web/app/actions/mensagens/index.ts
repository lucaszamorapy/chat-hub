"use server"

import { IMensagem } from "@/app/types/mensagens";
import { api, formatarError } from "..";
import { IData } from "@/app/types/index";

export const enviarMensagem = async (mensagem: IMensagem): Promise<IData> => {
  try {
    const { data } = await api.post<IData>("/Mensagens", mensagem)
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}