"use server"

import { IAmigo } from "@/app/types/amigos";
import { api, formatarError } from "..";

export const getAmigosByUsuario = async (usuarioId: number) => {
  try {
    const { data } = await api.get(`/Amigos/usuario/${usuarioId}`)
    return data;
  } catch (error: any) {
    console.error(error)
    return formatarError(error.response?.data.mensagem || error.response?.data.title);
  }
}

export const excluirAmigo = async (amigoId: number) => {
  try {
    const { data } = await api.delete(`/Amigos/${amigoId}`)
    return data;
  } catch (error: any) {
    console.error(error)
    return formatarError(error.response?.data.mensagem || error.response?.data.title);
  }
}

export const adicionarAmigo = async (amigo: IAmigo) => {
  try {
    const { data } = await api.post(`/Amigos`, amigo)
    return data;
  } catch (error: any) {
    console.error(error)
    return formatarError(error.response?.data.mensagem || error.response?.data.title);
  }
}

export const alterarAmigo = async (amigo: IAmigo) => {
  try {
    const { data } = await api.put(`/Amigos/${amigo.amigoId}`, amigo)
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data.title);
  }
}