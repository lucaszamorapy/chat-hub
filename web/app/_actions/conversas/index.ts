"use server"

import { api } from '..';

export const getConversasByUsuario = async (usuarioId: number) => {
  try {
    const { data } = await api.get(`/ConversaUsuarios/usuario/${usuarioId}`)
    return data;
  } catch (error: any) {
    console.error(error)
    return error.response?.data;
  }
}