"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import { IAmigo } from "../types/amigos";
import AmigoCard from "./amigo-card";
import { Badge } from "./ui/badge";

interface AmigosAccordionProps {
  amigos: IAmigo[];
  getAmigos: () => Promise<IAmigo[]>;
}

interface Accordions {
  amigosAceitos: IAmigo[];
  amigosPendentes: IAmigo[];
}

const AmigoAccordion = ({ amigos, getAmigos }: AmigosAccordionProps) => {
  const [amigosInternos, setAmigosInternos] = useState<IAmigo[]>([]);
  const [accordions, setAccordions] = useState<Accordions>({
    amigosAceitos: [],
    amigosPendentes: [],
  });

  const inicializarAccordions = useCallback((amigos: IAmigo[]) => {
    const amigosAceitos = amigos.filter((a) => a.status === "Aceito");
    const amigosPendentes = amigos.filter((a) => a.status === "Pendente");
    setAccordions({ amigosAceitos, amigosPendentes });
  }, []);

  const atualizarListaAmigos = async () => {
    await getAmigos();
  };

  useEffect(() => {
    setAmigosInternos(amigos);
  }, [amigos]);

  useEffect(() => {
    inicializarAccordions(amigosInternos);
  }, [amigosInternos, inicializarAccordions]);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem className="px-4" value="item-1">
        <AccordionTrigger className="cursor-pointer text-inherit no-underline hover:no-underline hover:text-inherit">
          <div className="flex items-center gap-2">
            Aceitos
            <Badge
              variant="default"
              className="h-5 min-w-5 rounded-full px-1 text-xs shrink-0 whitespace-nowrap"
            >
              {accordions.amigosAceitos.length}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {accordions.amigosAceitos.length > 0 ? (
            accordions.amigosAceitos.map((amigo) => (
              <AmigoCard
                key={amigo.amigoId}
                amigo={amigo}
                status={"Aceito"}
                atualizar={() => atualizarListaAmigos()}
              />
            ))
          ) : (
            <div className="text-xs text-muted-foreground p-2">
              Nenhum amigo aceito.
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem className="px-4" value="item-2">
        <AccordionTrigger className="cursor-pointer text-inherit no-underline hover:no-underline hover:text-inherit">
          <div className="flex items-center gap-2">
            Pendentes
            <Badge
              variant="default"
              className="h-5 min-w-5 rounded-full px-1 text-xs shrink-0 whitespace-nowrap"
            >
              {accordions.amigosPendentes.length}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {accordions.amigosPendentes.length > 0 ? (
            accordions.amigosPendentes.map((amigo) => (
              <AmigoCard
                key={amigo.amigoId}
                amigo={amigo}
                status={"Pendente"}
                atualizar={() => atualizarListaAmigos()}
              />
            ))
          ) : (
            <div className="text-xs text-muted-foreground p-2">
              Nenhum pedido de amizade pendente.
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AmigoAccordion;
