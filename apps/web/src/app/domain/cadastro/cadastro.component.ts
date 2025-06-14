import { eTipoCadastro } from './../../widget/enums/tipo-cadastro.enum';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { StepperModule } from 'primeng/stepper';
import { BemVindoComponent } from "./bem-vindo/bem-vindo.component";
import { ClienteCadastroComponent } from "./cliente/cliente-cadastro/cliente-cadastro.component";
import { ClienteServicosComponent } from "./cliente/cliente-servicos/cliente-servicos.component";
import { EmpresaCadastroComponent } from "./empresa/empresa-cadastro/empresa-cadastro.component";
import { EmpresaServicosComponent } from "./empresa/empresa-servicos/empresa-servicos.component";
import { UtilService } from "@shared/services/util/util.service";
import { ButtonModule } from "primeng/button";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { CadastroService } from "./cadastro.service";

interface iStep {
  index: number
  label: string
}

@Component({
  selector: 'app-cadastro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepperModule,
    BemVindoComponent,
    ClienteCadastroComponent,
    ClienteServicosComponent,
    EmpresaCadastroComponent,
    EmpresaServicosComponent,
    ButtonModule
  ],
  providers: [MessageService],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css',
})
export class CadastroComponent implements OnInit {

  formBuilder = inject(FormBuilder)
  utils = inject(UtilService)
  router = inject(Router)
  cadastro = inject(CadastroService)

  isMobile = signal(false)
  tipo = signal<eTipoCadastro | null>(null)

  eTipoCadastro = eTipoCadastro

  steps: iStep[] = [
    {
      index: 1,
      label: 'Bem-vindo'
    },
    {
      index: 2,
      label: 'Cadastro'
    },
    {
      index: 3,
      label: 'Serviços'
    }
  ]
  stepAtivo = signal<iStep>(this.steps[0])

  ngOnInit(): void {
    this.isMobile.set(this.utils.isMobile())
  }

  tipoSelecionado(tipo: eTipoCadastro): void {
    this.tipo.set(tipo)
  }

  toLogin(): void {
    this.router.navigate(['login'])
  }

  alterarStepAtivo(index: number): void {
    this.stepAtivo.set(this.steps[index])
  }

  proximoPasso(): void {
    this.cadastro.transmitirProximoPasso(true)
  }

}
