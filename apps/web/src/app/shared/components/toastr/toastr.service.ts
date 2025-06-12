import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";

interface iToastr {
  titulo?: string,
  mensagem: string
}

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  private toastrSuccess = new Subject<iToastr>();
  private toastrSuccess$ = this.toastrSuccess.asObservable();

  private toastrWarning = new Subject<iToastr>();
  toastrWarning$ = this.toastrWarning.asObservable();

  private toastrDanger = new Subject<iToastr>();
  toastrDanger$ = this.toastrDanger.asObservable();

  success(mensagem: string, titulo?: string): void {
    const dados = {
      titulo: titulo,
      mensagem: mensagem
    }
    this.toastrSuccess.next(dados)
  }

  escutarSuccess(): Observable<iToastr> {
    return this.toastrSuccess$
  }

  warning(mensagem: string, titulo?: string): void {
    const dados = {
      titulo: titulo,
      mensagem: mensagem
    }
    this.toastrWarning.next(dados)
  }

  escutarWarning(): Observable<iToastr> {
    return this.toastrWarning$
  }

  danger(mensagem: string, titulo?: string): void {
    const dados = {
      titulo: titulo,
      mensagem: mensagem
    }
    this.toastrDanger.next(dados)
  }

  escutarDanger(): Observable<iToastr> {
    return this.toastrDanger$
  }
}
