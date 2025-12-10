"use server";

import { IAlterarSenha, ILogin } from '@/app/types/usuarios';
import { api, formatarError } from '..';
import { cookies } from 'next/headers';
import { IData } from '@/app/types/index';

export const login = async (credenciais: ILogin): Promise<IData> => {
  try {
    const { data } = await api.post<IData>("/Usuarios/Login", credenciais);
    const cookieStore = await cookies();

    cookieStore.set("token", data.resultado.token, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    });

    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
};

export const cadastro = async (credenciais: FormData): Promise<IData> => {
  try {
    const { data } = await api.post<IData>("/Usuarios", credenciais);
    const cookieStore = await cookies();

    cookieStore.set("token", data.resultado.token, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    });
    return data;
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
};

export const alterar = async (usuarioId: number, usuario: FormData): Promise<IData> => {
  try {
    const { data } = await api.put<IData>(`/Usuarios/${usuarioId}`, usuario);
    return data
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const logout = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

export const getUsuarios = async (): Promise<IData> => {
  try {
    const { data } = await api.get<IData>("/Usuarios");
    return data
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const getUsuario = async (usuarioId: number): Promise<IData> => {
  try {
    const { data } = await api.get<IData>(`/Usuarios/${usuarioId}`);
    return data
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const esqueciMinhaSenha = async (email: string): Promise<IData> => {
  try {
    const { data } = await api.post<IData>("/Usuarios/esqueciminhasenha", { email });
    return data
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}

export const alterarSenha = async (usuario: IAlterarSenha): Promise<IData> => {
  try {
    const { data } = await api.put<IData>(`/Usuarios/alterarsenha/${usuario.usuarioId}`, usuario);
    return data
  } catch (error: any) {
    return formatarError(error.response?.data || error.response?.data.title);
  }
}