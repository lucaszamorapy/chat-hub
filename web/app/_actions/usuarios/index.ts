"use server";

import { ILogin, IUsuario } from '@/app/types/usuarios';
import { api } from '..';
import { cookies } from 'next/headers';

export const login = async (credenciais: ILogin) => {
  try {
    const { data } = await api.post("/Usuarios/Login", credenciais);
    const cookieStore = await cookies();

    cookieStore.set("token", data.resultado.token, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    });

    cookieStore.set("usuarioId", data.resultado.usuario.usuarioId, {
      path: "/",
      sameSite: "lax",
    });

    cookieStore.set("nome", data.resultado.usuario.nome, {
      path: "/",
      sameSite: "lax",
    });

    cookieStore.set("apelido", data.resultado.usuario.apelido, {
      path: "/",
      sameSite: "lax",
    });
    return data;
  } catch (error: any) {
    return error.response?.data;
  }
};

export const cadastro = async (credenciais: IUsuario) => {
  try {
    const { data } = await api.post("/Usuarios", credenciais);
    const cookieStore = await cookies();

    cookieStore.set("token", data.resultado.token, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    });

    cookieStore.set("usuarioId", data.resultado.usuario.usuarioId, {
      path: "/",
      sameSite: "lax",
    });

    cookieStore.set("nome", data.resultado.usuario.nome, {
      path: "/",
      sameSite: "lax",
    });

    cookieStore.set("apelido", data.resultado.usuario.apelido, {
      path: "/",
      sameSite: "lax",
    });
    return data;
  } catch (error: any) {
    return error.response?.data;
  }
};

export const alterar = async (usuario: IUsuario) => {
  try {
    const { data } = await api.put(`/Usuarios/${usuario.usuarioId}`, usuario);
    return data
  } catch (error: any) {
    return error.response?.data;
  }
}

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("usuarioId");
  cookieStore.delete("nome");
  cookieStore.delete("apelido");
}
