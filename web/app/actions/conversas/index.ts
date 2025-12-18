"use server"

import { IMensagem } from '@/app/types/mensagens';
import { api, formatarError } from '..';
import { IConversa, IConversaUsuario } from '@/app/types/conversas';
import { IData } from '@/app/types/index';
import { ApiError } from "@/app/class/index";

export const getConversasByUsuario = async (usuarioId: number): Promise<IData> => {
  try {
    const { data } = await api.get<IData>(`/ConversaUsuarios/usuario/${usuarioId}`)
    return data;
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}

export const getConversaById = async (id: number): Promise<IData> => {
  try {
    const { data } = await api.get<IData>(`/ConversaUsuarios/${id}`)
    return data;
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}

export const visualizarMensagens = async (mensagens: IMensagem[]): Promise<IData> => {
  try {
    const { data } = await api.post<IData>("/Mensagens/visualizar", mensagens)
    return data;
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}

export const criarConversa = async (conversa: FormData): Promise<IData> => {
  try {
    const { data } = await api.post<IData>("/Conversas", conversa)
    return data;
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}

export const criarConversaUsuarios = async (conversasUsuarios: IConversaUsuario[]): Promise<IData> => {
  try {
    const { data } = await api.post<IData>("/ConversaUsuarios", conversasUsuarios)
    return data;
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}

export const alterarConversa = async (conversaId: number, conversa: FormData): Promise<IData> => {
  try {
    const { data } = await api.put<IData>(`/Conversas/conversaGrupo/${conversaId}`, conversa)
    return data;
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}

export const alterarConversaUsuarios = async (conversaUsuario: IConversaUsuario): Promise<IData> => {
  try {
    const { data } = await api.put<IData>(`/ConversaUsuarios/${conversaUsuario.conversaUsuariosId}`, conversaUsuario)
    return data;
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}

export const excluirConversaUsuarios = async (conversaUsuario: IConversaUsuario): Promise<IData> => {
  try {
    const { data } = await api.delete<IData>(`/ConversaUsuarios/${conversaUsuario.conversaUsuariosId}`)
    return data;
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}

export const excluirConversa = async (conversa: IConversa): Promise<IData> => {
  try {
    const { data } = await api.delete<IData>(`/Conversas/${conversa.conversaId}`)
    return data;
  } catch (error: any) {
    const formatado = await formatarError(error.response?.data);
    throw new ApiError(
      formatado.mensagem
    );
  }
}

