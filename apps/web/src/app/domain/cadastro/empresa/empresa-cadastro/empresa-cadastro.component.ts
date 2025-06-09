import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-empresa-cadastro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    InputMaskModule,
    InputNumberModule
  ],
  templateUrl: './empresa-cadastro.component.html',
  styleUrl: './empresa-cadastro.component.css',
})
export class EmpresaCadastroComponent implements OnInit {

  formBuilder = inject(FormBuilder)

  formCliente: FormGroup = this.formBuilder.group({})

  ngOnInit(): void {
    this.initFormEmpresa()
  }

  initFormEmpresa(): void {
    this.formCliente = this.formBuilder.group({
      cnpj: [null, Validators.required],
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      telefone: [null, Validators.required],
      cep: [null, Validators.required],
      uf: [{value: null, disabled: true}],
      cidade: [{value: null, disabled: true}],
      endereco: [{value: null, disabled: true}],
      numero: [null, Validators.required],
      complemento: [null],
      password: [null, Validators.required],
      password_repeat: [null, Validators.required]
    })
  }

}
