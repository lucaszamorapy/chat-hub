"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { getCookie } from "../utils";

export interface IAuth {
  usuarioId: string | null;
  nome: string | null;
  apelido: string | null;
  token: string | null;
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
    token: null,
  });

  useEffect(() => {
    const storedNome = getCookie("nome");
    const storedUsuarioId = getCookie("usuarioId");
    const storedApelido = getCookie("apelido");
    const storedToken = getCookie("token");

    if (storedNome && storedUsuarioId && storedApelido && storedToken) {
      Promise.resolve().then(() => {
        setAuth({
          usuarioId: storedUsuarioId,
          nome: storedNome,
          apelido: storedApelido,
          token: storedToken,
        });
      });
    }
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
