"use server"

import { IAmigo } from "@/app/types/amigos";
import { api, formatarError } from "..";
import { revalidatePath } from "next/cache";
import { IData } from "@/app/types/index";
import { ApiError } from "@/app/class/index";

export const getAmigosByUsuario = async (usuarioId: number): Promise<IData> => {
  try {
    const { data } = await api.get<IData>(`/Amigos/usuario/${usuarioId}`)
    return data
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}

export const excluirAmigo = async (amigoId: number, usuarioAmigoId: number): Promise<IData> => {
  try {
    const { data } = await api.delete<IData>(`/Amigos/${amigoId}/${usuarioAmigoId}`)
    return data;
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}

export const adicionarAmigo = async (amigo: IAmigo): Promise<IData> => {
  try {
    const { data } = await api.post<IData>(`/Amigos`, amigo)
    revalidatePath("/")
    return data;
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}

export const alterarAmigo = async (amigo: IAmigo): Promise<IData> => {
  try {
    const { data } = await api.put<IData>(`/Amigos/${amigo.amigoId}`, amigo)
    return data;
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}