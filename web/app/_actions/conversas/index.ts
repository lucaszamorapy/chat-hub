"use server"

import { IMensagem } from '@/app/types/mensagens';
import { api, formatarError } from '..';
import { IConversa, IConversaUsuario } from '@/app/types/conversas';

export const getConversasByUsuario = async (usuarioId: number) => {
  try {
    const { data } = await api.get(`/ConversaUsuarios/usuario/${usuarioId}`)
    return data;
  } catch (error: any) {
    console.error(error)
    return formatarError(error.response?.data.mensagem || error.response?.data.title);
  }
}

export const visualizarMensagens = async (mensagens: IMensagem[]) => {
  try {
    const { data } = await api.post("/Mensagens/visualizar", mensagens)
    return data;
  } catch (error: any) {
    console.error(error)
    return formatarError(error.response?.data.mensagem || error.response?.data.title);
  }
}

export const criarConversa = async (conversa: FormData) => {
  try {
    const { data } = await api.post("/Conversas", conversa)
    return data;
  } catch (error: any) {
    console.error(error)
    return formatarError(error.response?.data.mensagem || error.response?.data.title);
  }
}

export const criarConversaUsuarios = async (conversaUsuarios: IConversaUsuario) => {
  try {
    const { data } = await api.post("/ConversaUsuarios", conversaUsuarios)
    return data;
  } catch (error: any) {
    console.error(error)
    return formatarError(error.response?.data.mensagem || error.response?.data.title);
  }
}