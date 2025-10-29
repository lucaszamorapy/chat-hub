"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { getCookie } from "../utils";

export interface IAuth {
  usuarioId: number | null;
  nome: string | null;
  apelido: string | null;
  perfilFoto?: string | null;
}

interface AuthContextType {
  auth: IAuth;
  setAuth: React.Dispatch<React.SetStateAction<IAuth>>;
}

interface IChildren {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: IChildren) => {
  const [auth, setAuth] = useState<IAuth>({
    usuarioId: null,
    nome: null,
    apelido: null,
    perfilFoto: null,
  });

  useEffect(() => {
    const loadAuth = async () => {
      const usuario = localStorage.getItem("usuario");
      if (usuario) {
        const usuarioFormatado = JSON.parse(usuario);
        setAuth({
          usuarioId: Number(usuarioFormatado.usuarioId),
          nome: usuarioFormatado.nome,
          apelido: usuarioFormatado.apelido,
          perfilFoto: usuarioFormatado.perfilFoto,
        });
      }
    };
    loadAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
