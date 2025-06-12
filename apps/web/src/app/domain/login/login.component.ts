import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RouterLink } from "@angular/router";
import { LoginService } from "./login.service";
import { ToastrComponent } from "@shared/components/toastr/toastr.component";
import { ToastrService } from "@shared/components/toastr/toastr.service";
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    RouterLink,
    ToastrComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  formBuilder = inject(FormBuilder);
  loginService = inject(LoginService)
  toastrService = inject(ToastrService)

  formLogin: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.formLogin = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login(): void {
    this.formLogin.markAllAsTouched()
    if(this.formLogin.invalid){
      this.toastrService.danger('Preencha os campos obrigatórios para realizar o Login')
      return
    }

    this.loginService.login(this.formLogin.value).subscribe({})
  }

}
