import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from '@angular/core';
import { Observable } from "rxjs";

interface iViaCep {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro: string
}

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {

  http = inject(HttpClient)

  buscarDadosCEP(cep: string): Observable<iViaCep> {
    const cepTratado = cep?.replace(/-/g, '')?.replace(/\./, '');
    return this.http.get<iViaCep>(`https://viacep.com.br/ws/${cepTratado}/json`);
  }

}
