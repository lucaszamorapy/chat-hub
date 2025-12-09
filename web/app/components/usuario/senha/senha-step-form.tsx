"use client";

import { useState } from "react";
import { fasesStep } from "@/app/utils/lists";
import { IAlterarSenha } from "@/app/types/usuarios";

const SenhaStepForm = () => {
  const [faseAtiva, setFaseAtiva] = useState<number>(0);
  const [dadosSenha, setDadosSenha] = useState<IAlterarSenha>();

  const avancarStep = (fase: number, dadosSenha?: IAlterarSenha) => {
    setFaseAtiva(fase);
    if (dadosSenha) {
      setDadosSenha(dadosSenha);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          Esqueceu sua senha? O Chat
          <span className="text-primary">Hub</span> pode ajudar.
        </h1>
        <p className="text-muted-foreground text-balance font-sx">
          Informe seu e-mail, receba o código e crie uma nova senha.
        </p>
      </div>
      {fasesStep.map((f, i: number) => {
        let c: any = null;
        if (faseAtiva === i) {
          const Component = f.componente;
          if (dadosSenha) {
            c = (
              <Component
                key={i}
                avancarStep={(fase: number, dadosSenha?: IAlterarSenha) =>
                  avancarStep(fase, dadosSenha)
                }
                dadosSenha={dadosSenha}
              />
            );
          } else {
            c = (
              <Component
                key={i}
                avancarStep={(fase: number, dadosSenha?: IAlterarSenha) =>
                  avancarStep(fase, dadosSenha)
                }
              />
            );
          }
        }
        return c;
      })}
    </>
  );
};

export default SenhaStepForm;
