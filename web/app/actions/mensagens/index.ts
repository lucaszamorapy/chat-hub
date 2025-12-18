"use server"

import { IMensagem } from "@/app/types/mensagens";
import { api, formatarError } from "..";
import { IData } from "@/app/types/index";
import { ApiError } from "@/app/class/index";

export const enviarMensagem = async (mensagem: IMensagem): Promise<IData> => {
  try {
    const { data } = await api.post<IData>("/Mensagens", mensagem)
    return data;
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}