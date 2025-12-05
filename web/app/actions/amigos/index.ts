"use server"

import { IAmigo } from "@/app/types/amigos";
import { api, formatarError } from "..";
import { revalidatePath } from "next/cache";

export const getAmigosByUsuario = async (usuarioId: number) => {
  try {
    const { data } = await api.get(`/Amigos/usuario/${usuarioId}`)
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const excluirAmigo = async (amigoId: number, usuarioAmigoId: number) => {
  try {
    const { data } = await api.delete(`/Amigos/${amigoId}/${usuarioAmigoId}`)
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const adicionarAmigo = async (amigo: IAmigo) => {
  try {
    const { data } = await api.post(`/Amigos`, amigo)
    revalidatePath("/")
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const alterarAmigo = async (amigo: IAmigo) => {
  try {
    const { data } = await api.put(`/Amigos/${amigo.amigoId}`, amigo)
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}