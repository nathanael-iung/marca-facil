import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-cliente-cadastro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    InputMaskModule
  ],
  templateUrl: './cliente-cadastro.component.html',
  styleUrl: './cliente-cadastro.component.css',
})
export class ClienteCadastroComponent implements OnInit {

  formBuilder = inject(FormBuilder)

  formCliente: FormGroup = this.formBuilder.group({})

  ngOnInit(): void {
    this.initFormCliente()
  }

  initFormCliente(): void {
    this.formCliente = this.formBuilder.group({
      cpf: [null, Validators.required],
      nome: [null, Validators.required],
      dat_nasc: [null, Validators.required],
      cep: [null, Validators.required],
      uf: [{value: null, disabled: true}],
      cidade: [{value: null, disabled: true}],
      endereco: [{value: null, disabled: true}],
      email: [null, [Validators.required, Validators.email]],
      telefone: [null, Validators.required],
      password: [null, Validators.required],
      password_repeat: [null, Validators.required]
    })
  }

}
