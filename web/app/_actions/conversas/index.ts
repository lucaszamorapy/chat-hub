"use server"

import { IMensagem } from '@/app/types/mensagens';
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

export const visualizarMensagens = async (mensagens: IMensagem[]) => {
  try {
    const { data } = await api.post("/Mensagens/visualizar", mensagens)
    return data;
  } catch (error: any) {
    console.error(error)
    return error.response?.data;
  }
}