"use client"

import moment from "moment";

export const formatoMoeda = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export const getCookie = (cname: string): string | undefined => {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
}

export const formatarData = (data: string | number | Date, formato: string = "padrão") => {
  let retorno

  switch (formato) {
    case "padrão": retorno = moment(data).format("DD/MM/YYYY");
      break;
    case "dataehoratexto": retorno = moment(data).format("DD/MM/yyyy [às] HH:mm");
      break;
    case "dataehora": retorno = moment(data).format("DD/MM/yyyy HH:mm");
      break;
    case "formatobanco": retorno = moment(data).format("yyyy-MM-DD HH:mm:ss");
      break;
  }
  if (retorno == "Invalid date") {
    return "";
  }
  return retorno;
}