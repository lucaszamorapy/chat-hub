"use server"

import { IMensagem } from "@/app/types/mensagens";
import { api, formatarError } from "..";

export const enviarMensagem = async (mensagem: IMensagem) => {
  try {
    const { data } = await api.post("/Mensagens", mensagem)
    return data;
  } catch (error: any) {
    console.error(error.response?.data.mensagemApi)
    return formatarError(error.response?.data || error.response?.data.title);
  }
}