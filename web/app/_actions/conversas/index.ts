"use server"

import { IMensagem } from '@/app/types/mensagens';
import { api, formatarError } from '..';
import { IConversa, IConversaUsuario } from '@/app/types/conversas';

export const getConversasByUsuario = async (usuarioId: number) => {
  try {
    const { data } = await api.get(`/ConversaUsuarios/usuario/${usuarioId}`)
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const getConversaById = async (id: number) => {
  try {
    const { data } = await api.get(`/ConversaUsuarios/${id}`)
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const visualizarMensagens = async (mensagens: IMensagem[]) => {
  try {
    const { data } = await api.post("/Mensagens/visualizar", mensagens)
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const criarConversa = async (conversa: FormData) => {
  try {
    const { data } = await api.post("/Conversas", conversa)
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const criarConversaUsuarios = async (conversaUsuarios: IConversaUsuario) => {
  try {
    const { data } = await api.post("/ConversaUsuarios", conversaUsuarios)
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const alterarConversa = async (conversaId: number, conversa: FormData) => {
  try {
    const { data } = await api.put(`/Conversas/conversaGrupo/${conversaId}`, conversa)
    return data;
  } catch (error: any) {
    console.log(error.response?.data)
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const alterarConversaUsuarios = async (conversaUsuario: IConversaUsuario) => {
  try {
    const { data } = await api.put(`/ConversaUsuarios/${conversaUsuario.conversaUsuariosId}`, conversaUsuario)
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const excluirConversaUsuarios = async (conversaUsuario: IConversaUsuario) => {
  try {
    const { data } = await api.delete(`/ConversaUsuarios/${conversaUsuario.conversaUsuariosId}`)
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const excluirConversa = async (conversa: IConversa) => {
  try {
    const { data } = await api.delete(`/Conversas/${conversa.conversaId}`)
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

