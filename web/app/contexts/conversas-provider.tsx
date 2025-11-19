"use client";

import React, { createContext, useState, useContext } from "react";
import { IConversaUsuario } from "../types/conversas";
import { IMensagem } from "../types/mensagens";

interface ConversasContextType {
  conversasContext: IConversaUsuario[];
  setConversasContext: React.Dispatch<React.SetStateAction<IConversaUsuario[]>>;
  removerConversa: (conversaId: number) => void;
  adicionarMensagem: (mensagem: IMensagem) => void;
}

interface IChildren {
  children: React.ReactNode;
}

const ConversasContext = createContext<ConversasContextType>(
  {} as ConversasContextType
);

export const ConversasProvider = ({ children }: IChildren) => {
  const [conversasContext, setConversasContext] = useState<IConversaUsuario[]>(
    []
  );

  const removerConversa = (conversaId: number) => {
    setConversasContext((prev) =>
      prev.filter((c) => c.conversaId !== conversaId)
    );
  };

  const adicionarMensagem = (mensagem: IMensagem) => {
    setConversasContext((prev) =>
      prev.map((c) => {
        if (c.conversaId !== mensagem.conversaId) return c;
        const novas = [...(c.mensagens ?? []), mensagem];
        novas.sort(
          (a, b) =>
            new Date(b.regidh!).getTime() - new Date(a.regidh!).getTime()
        );
        return { ...c, mensagens: novas };
      })
    );
  };

  return (
    <ConversasContext.Provider
      value={{
        conversasContext,
        setConversasContext,
        removerConversa,
        adicionarMensagem,
      }}
    >
      {children}
    </ConversasContext.Provider>
  );
};

export const useConversa = () => {
  const context = useContext(ConversasContext);
  if (!context) {
    throw new Error("useConversa must be used within an ConversasProvider");
  }
  return context;
};
