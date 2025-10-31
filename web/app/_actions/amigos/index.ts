"use server"

import { api } from "..";

export const getAmigosByUsuario = async (usuarioId: number) => {
  try {
    const { data } = await api.get(`/Amigos/usuario/${usuarioId}`)
    return data;
  } catch (error: any) {
    console.error(error)
    return error.response?.data;
  }
}

export const excluirAmigo = async (amigoId: number) => {
  try {
    const { data } = await api.delete(`/Amigos/${amigoId}`)
    return data;
  } catch (error: any) {
    console.error(error)
    return error.response?.data;
  }
}