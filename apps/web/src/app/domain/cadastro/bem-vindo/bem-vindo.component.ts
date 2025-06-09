import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { eTipoCadastro } from "@widget/enums/tipo-cadastro.enum";

@Component({
  selector: 'app-bem-vindo',
  imports: [
    CommonModule,
    CardModule
  ],
  templateUrl: './bem-vindo.component.html',
  styleUrl: './bem-vindo.component.css',
})
export class BemVindoComponent {

  selecionado = output<eTipoCadastro>()
  eTipoCadastro = eTipoCadastro

  tipoSelecionado(tipo: eTipoCadastro): void {
    this.selecionado.emit(tipo)
  }

}
