import { Component, ElementRef, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { InputMaskModule } from 'primeng/inputmask';
import { debounceTime, Subject, take, takeUntil } from "rxjs";
import { CadastroService } from "@domain/cadastro/cadastro.service";
import { UtilService } from "@shared/services/util/util.service";
import { ToastrService } from "@shared/components/toastr/toastr.service";
import { CpfValidatorDirective } from "@widget/directives/cpf-validator/cpf-validator.directive";
import { DateValidatorDirective } from "@widget/directives/date-validator/date-validator.directive";
import { ViaCepService } from "@shared/services/via-cep/via-cep.service";

@Component({
  selector: 'app-cliente-cadastro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    InputMaskModule,
    CpfValidatorDirective,
    DateValidatorDirective
  ],
  templateUrl: './cliente-cadastro.component.html',
  styleUrl: './cliente-cadastro.component.css',
})
export class ClienteCadastroComponent implements OnInit, OnDestroy {

  formBuilder = inject(FormBuilder)
  cadastroService = inject(CadastroService)
  utils = inject(UtilService)
  toastr = inject(ToastrService)
  viaCep = inject(ViaCepService)
  el = inject(ElementRef)
  renderer = inject(Renderer2)

  formCliente: FormGroup = this.formBuilder.group({})

  sub$ = new Subject<void>()
  proximoPasso$ = this.cadastroService.escutarProximoPasso()

  ngOnInit(): void {
    this.initFormCliente()
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

  initFormCliente(): void {
    this.formCliente = this.formBuilder.group({
      cpf: [null, {
        validators: [Validators.required],
        updateOn: 'blur'
      }],
      nome: [null, Validators.required],
      data_nascimento: [null, {
        validators: [Validators.required],
        updateOn: 'blur'
      }],
      cep: [null, Validators.required],
      uf: [{value: null, disabled: true}],
      cidade: [{value: null, disabled: true}],
      bairro: [{value: null, disabled: true}],
      email: [null, [Validators.required, Validators.email]],
      telefone: [null, Validators.required],
      password: [null, Validators.required],
      password_repeat: [null, Validators.required]
    })

    this.verificarValidadeCPF()
    this.verificarValidadeDataNascimento()
  }

  verificarValidadeCPF(): void {
    const cpfControl = this.formCliente.get('cpf')
    if(!cpfControl?.value)
      return
    cpfControl.statusChanges.pipe(
      debounceTime(50),
      takeUntil(this.sub$)
    )?.subscribe(status => {
      if (status === 'INVALID' && cpfControl.hasError('cpfInvalido')) {
        cpfControl.setValue('', { emitEvent: false });
        this.toastr.danger("O CPF informado é invalido")
      }
    })
  }

  verificarValidadeDataNascimento(): void {
    const dataNascControl = this.formCliente.get('dat_nasc')
    if(!dataNascControl?.value)
      return
    dataNascControl.statusChanges.pipe(
      debounceTime(50),
      takeUntil(this.sub$)
    )?.subscribe(status => {
      if (status === 'INVALID' && dataNascControl.hasError('dataNascInvalida')) {
        dataNascControl.setValue('', { emitEvent: false });
        this.toastr.danger("A data de nascimento informada é invalida")
      }
    })
  }

  buscarCEP(): void {
    const cep = this.formCliente.get('cep')?.value
    if(!cep)
      return
    this.viaCep.buscarDadosCEP(cep).pipe(
      takeUntil(this.sub$)
    ).subscribe({
      next: (res) => {
        if(res.erro) {
          this.toastr.danger("Os dados do CEP informado não foram encontrados.")
          this.formCliente.patchValue({
            cep: null,
            uf: null,
            cidade: null,
            bairro: null
          })
          return
        }

        this.formCliente.patchValue({
          uf: res.uf,
          cidade: res.localidade,
          bairro: res.bairro
        })

        const targetElement = this.el.nativeElement.ownerDocument.getElementById('email');
        if(targetElement)
          this.renderer.selectRootElement(targetElement).focus();

      }, error: () => {
        this.toastr.danger("Os dados do CEP informado não foram encontrados. Tente novamente.")
      }
    })
  }

  onSubmit(): void {

    this.formCliente.markAllAsTouched()

    if(this.formCliente.invalid){
      this.toastr.danger("Preencha os campos obrigatórios para prosseguir")
      return
    }

    const cliente = this.formCliente.getRawValue()

    if(cliente.password != cliente.password_repeat){
      this.toastr.danger("As senhas informadas são diferentes. Corrija-as para prosseguir.")
      return
    }

    cliente.cpf = this.utils.sanitizarString(cliente.cpf)
    cliente.cep = this.utils.sanitizarString(cliente.cep)
    cliente.data_nascimento = this.utils.formatarData(cliente.data_nascimento, "DD/MM/YYYY", "YYYY-MM-DD")
    delete cliente.password_repeat

    this.cadastroService.cadastrarCliente(cliente).pipe(
      take(1)
    ).subscribe({
      next: () => {
        this.toastr.success("Cadastro realizado com sucesso")
      }
    })

  }

}
