import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from '@angular/core';
import { env } from "@environments/env.dev";
import { Observable } from "rxjs";

interface iResponseLogin {
  access_token: string
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  http = inject(HttpClient)
  private readonly API = env.API

  teste(dados: {username: string, password: string}): Observable<iResponseLogin> {
    return this.http.get<iResponseLogin>(this.API);
  }

  login(dados: {username: string, password: string}): Observable<iResponseLogin> {
    return this.http.post<iResponseLogin>(this.API + 'auth/login', dados);
  }
}
