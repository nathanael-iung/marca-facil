import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from '@angular/core';
import { env } from "@environments/env.dev";
import { iClient, iCompany, iFormCadastroCliente, iUser } from "@widget/interfaces/cadastro/cadastro";
import { Observable, Subject } from "rxjs";

interface iRegisterClient {
  user: iUser,
  client: iClient
}

interface iRegisterCompany {
  user: iUser,
  Company: iCompany
}

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  http = inject(HttpClient)
  private readonly API = env.API

  private readonly proximoPasso = new Subject<boolean>()

  transmitirProximoPasso(avancar: boolean) {
    this.proximoPasso.next(avancar)
  }

  escutarProximoPasso(): Observable<boolean> {
    return this.proximoPasso.asObservable()
  }

  cadastrarCliente(cliente: iFormCadastroCliente): Observable<iRegisterClient> {
    return this.http.post<iRegisterClient>(this.API + 'auth/register/client', cliente);
  }

  cadastrarEmpresa(empresa: iFormCadastroCliente): Observable<iRegisterCompany> {
    return this.http.post<iRegisterCompany>(this.API + 'auth/register/company', empresa);
  }

}
