import { Injectable } from '@angular/core';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  isMobile(): boolean {
    return window.innerWidth < 640;
  }

  isCpfValido(cpf: string): boolean {
    if (!cpf)
      return false;
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999")
      return false;
    // Valida 1o digito
    let add = 0;
    for (let i = 0; i < 9; i++)
      add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
      return false;
    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++)
      add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
      rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
      return false;
    return true;
  }

  isDataValida(data: string): boolean {
    return dayjs(data, 'DD/MM/YYYY', true).isValid()
  }

  sanitizarString(string: string): string {
    if(!string)
      return string
    const stringNormalizada = string.normalize("NFD");
    const stringSemAcentos = stringNormalizada.replace(/[\u0300-\u036f]/g, "");
    return stringSemAcentos.replace(/[^a-zA-Z0-9]/g, '');
  }

  formatarData(data: string, formatoAtual = 'DD/MM/YYYY', formatoDesejado = 'YYYY-MM-DD'): string {
    if(!data)
      return data
    return dayjs(data, formatoAtual).format(formatoDesejado)
  }

}
