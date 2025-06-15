import { Component, ElementRef, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from 'primeng/inputnumber';
import { CnpjValidatorDirective } from "@widget/directives/cnpj-validator/cnpj-validator.directive";
import { ToastrService } from "@shared/components/toastr/toastr.service";
import { ViaCepService } from "@shared/services/via-cep/via-cep.service";
import { debounceTime, Subject, take, takeUntil } from "rxjs";
import { CadastroService } from "@domain/cadastro/cadastro.service";
import { UtilService } from "@shared/services/util/util.service";

@Component({
  selector: 'app-empresa-cadastro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    InputMaskModule,
    InputNumberModule,
    CnpjValidatorDirective
  ],
  templateUrl: './empresa-cadastro.component.html',
  styleUrl: './empresa-cadastro.component.css',
})
export class EmpresaCadastroComponent implements OnInit, OnDestroy {

  formBuilder = inject(FormBuilder)
  toastr = inject(ToastrService)
  viaCep = inject(ViaCepService)
  cadastroService = inject(CadastroService)
  el = inject(ElementRef)
  renderer = inject(Renderer2)
  utils = inject(UtilService)

  formEmpresa: FormGroup = this.formBuilder.group({})

  sub$ = new Subject<void>()
  proximoPasso$ = this.cadastroService.escutarProximoPasso()

  ngOnInit(): void {
    this.initFormEmpresa()
    this.escutarSubs()
  }

  ngOnDestroy(): void {
    this.sub$.next()
    this.sub$.complete()
  }

  escutarSubs(): void {
    this.proximoPasso$.pipe(takeUntil(this.sub$)).subscribe({
      next: (avancar) => {
        if(avancar)
          this.onSubmit()
      }
    })
  }

  initFormEmpresa(): void {
    this.formEmpresa = this.formBuilder.group({
      cnpj: [null, {
        validators: [Validators.required],
        updateOn: 'blur'
      }],
      razao_social: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      telefone: [null, Validators.required],
      cep: [null, Validators.required],
      uf: [{value: null, disabled: true}],
      cidade: [{value: null, disabled: true}],
      bairro: [{value: null, disabled: true}],
      endereco: [{value: null, disabled: true}],
      numero: [null, Validators.required],
      complemento: [null],
      password: [null, Validators.required],
      password_repeat: [null, Validators.required]
    })

    this.verificarValidadeCNPJ()
  }

  verificarValidadeCNPJ(): void {
    const cnpjControl = this.formEmpresa.get('cnpj')
    cnpjControl?.statusChanges.pipe(
      debounceTime(50),
      takeUntil(this.sub$)
    )?.subscribe(status => {
      if (status === 'INVALID' && cnpjControl.hasError('cnpjInvalido')) {
        cnpjControl.setValue('', { emitEvent: false });
        this.toastr.danger("O CNPJ informado é invalido")
      }
    })
  }

  buscarCEP(): void {
    const cep = this.formEmpresa.get('cep')?.value
    if(!cep)
      return

    this.viaCep.buscarDadosCEP(cep).pipe(
      takeUntil(this.sub$)
    ).subscribe({
      next: (res) => {
        if(res.erro) {
          this.toastr.danger("Os dados do CEP informado não foram encontrados.")
          this.formEmpresa.patchValue({
            cep: null,
            uf: null,
            cidade: null,
            bairro: null,
            endereco: null
          })
          return
        }

        this.formEmpresa.patchValue({
          uf: res.uf,
          cidade: res.localidade,
          bairro: res.bairro,
          endereco: res.logradouro
        })

        const targetElement = this.el.nativeElement.ownerDocument.getElementById('numero');
        if(targetElement)
          this.renderer.selectRootElement(targetElement).focus();

      }, error: () => {
        this.toastr.danger("Os dados do CEP informado não foram encontrados. Tente novamente.")
      }
    })
  }

  onSubmit(): void {

    this.formEmpresa.markAllAsTouched()

    if(this.formEmpresa.invalid){
      this.toastr.danger("Preencha os campos obrigatórios para prosseguir")
      return
    }

    const empresa = this.formEmpresa.getRawValue()

    if(empresa.password != empresa.password_repeat){
      this.toastr.danger("As senhas informadas são diferentes. Corrija-as para prosseguir.")
      return
    }

    empresa.cnpj = this.utils.sanitizarString(empresa.cnpj)
    empresa.cep = this.utils.sanitizarString(empresa.cep)
    empresa.numero = String(empresa.numero)
    delete empresa.password_repeat

    this.cadastroService.cadastrarEmpresa(empresa).pipe(
      take(1)
    ).subscribe({
      next: () => {
        this.toastr.success("Cadastro realizado com sucesso")
      }
    })

  }

}
