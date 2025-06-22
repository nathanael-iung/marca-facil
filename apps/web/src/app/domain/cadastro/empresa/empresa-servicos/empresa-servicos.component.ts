import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { iSelectOption } from "@widget/interfaces/primeng/primeng";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastrService } from "@shared/components/toastr/toastr.service";
import { Subject, takeUntil } from "rxjs";
import { CadastroService } from "@domain/cadastro/cadastro.service";
import { subscribe } from "diagnostics_channel";


export enum eDiaDaSemana {
  DOMINGO = 0,
  SEGUNDA = 1,
  TERCA = 2,
  QUARTA = 3,
  QUINTA = 4,
  SEXTA = 5,
  SABADO = 6
}

@Component({
  selector: 'app-empresa-servicos',
  imports: [
    CommonModule,
    DividerModule,
    ButtonModule,
    CardModule,
    ReactiveFormsModule,
    DatePickerModule,
    MultiSelectModule,
    DividerModule,
    InputTextModule,
    InputNumberModule,
    ToggleSwitchModule
  ],
  templateUrl: './empresa-servicos.component.html',
  styleUrl: './empresa-servicos.component.css',
})
export class EmpresaServicosComponent implements OnInit, OnDestroy {

  formBuilder = inject(FormBuilder);
  formServicos: FormGroup = this.formBuilder.group({});
  toastr = inject(ToastrService)
  cadastroService = inject(CadastroService)

  categorias: iSelectOption[] = [
    { value: 'Beleza e Estética', label: 'BELEZA' },
    { value: 'Saúde e Bem-estar', label: 'SAUDE' },
    { value: 'Serviços Automotivos', label: 'AUTO' },
  ];

  subCategorias: iSelectOption[] = [
    { value: 'Cabelo', label: 'CABELO' },
    { value: 'Manicure', label: 'MANICURE' },
    { value: 'Revisão', label: 'REVISAO' },
  ];

  diasDaSemana: iSelectOption[] = [
    { value: eDiaDaSemana.DOMINGO, label: 'Domingo' },
    { value: eDiaDaSemana.SEGUNDA, label: 'Segunda-feira' },
    { value: eDiaDaSemana.TERCA, label: 'Terça-feira' },
    { value: eDiaDaSemana.QUARTA, label: 'Quarta-feira' },
    { value: eDiaDaSemana.QUINTA, label: 'Quinta-feira' },
    { value: eDiaDaSemana.SEXTA, label: 'Sexta-feira' },
    { value: eDiaDaSemana.SABADO, label: 'Sábado' },
  ]

  sub$ = new Subject<void>()
  proximoPasso$ = this.cadastroService.escutarProximoPasso()

  get servicos(): FormArray {
    return this.formServicos.get('servicos') as FormArray;
  }

  servico(indexServico: number): FormGroup {
    return this.servicos?.at(indexServico) as FormGroup
  }

  servicoDisponibilidade(indexServico: number): FormArray {
    return this.servico(indexServico)?.get('disponibilidade') as FormArray
  }

  servicoDisponibilidadePausa(indexServico: number, indexDisponibilidade: number): FormArray {
    const disponibilidades = this.servico(indexServico)?.get('disponibilidade') as FormArray
    return disponibilidades.at(indexDisponibilidade)?.get('pausas') as FormArray
  }

  ngOnInit(): void {
    this.initForm();
    this.escutarSubs()
  }

  ngOnDestroy(): void {
    this.sub$.next()
    this.sub$.complete()
  }

  escutarSubs(): void {
    this.proximoPasso$.pipe(
      takeUntil(this.sub$)
    ).subscribe({
      next: (avancar) => {
        if(avancar)
          this.onSubmit()
      }
    })
  }

  initForm(): void {
    this.formServicos = this.formBuilder.group({
      categoria: [null, Validators.required],
      servicos: this.formBuilder.array([this.initFormServicos()])
    });
  }

  adicionarServico(): void {
    this.servicos.push(this.initFormServicos());
    console.log(this.servicos)
  }

  removerServico(index: number): void {
    this.servicos.removeAt(index);
  }

  initFormServicos(): FormGroup {
    return this.formBuilder.group({
      nome: [null, Validators.required],
      sub_categoria: [null, Validators.required],
      profissional: [null, Validators.required],
      valor: [0, [Validators.required, Validators.min(0)]],
      duracao: [30, [Validators.required, Validators.min(5)]],
      intervalo: [10],
      disponibilidade: this.formBuilder.array([this.initFormDisponibilidade()]),
      status: [true],
    });
  }

  adicionarDisponibilidade(indexServico: number): void {
    this.servicoDisponibilidade(indexServico)?.push(this.initFormDisponibilidade());
  }

  removerDisponibilidade(indexServico: number, indexDisponibilidade: number): void {
    this.servicoDisponibilidade(indexServico)?.removeAt(indexDisponibilidade);
  }

  initFormDisponibilidade(): FormGroup {
    return this.formBuilder.group({
      dias_da_semana: [[], Validators.required],
      horario_inicio: [null, Validators.required],
      horario_fim: [null, Validators.required],
      pausas: this.formBuilder.array([]),
    })
  }

  adicionarPausa(indexServico: number, indexDisponibilidade: number): void {
    this.servicoDisponibilidadePausa(indexServico, indexDisponibilidade)?.push(this.initFormPausa());
  }

  removerPausa(indexServico: number, indexDisponibilidade: number, indexPausa: number): void {
    this.servicoDisponibilidadePausa(indexServico, indexDisponibilidade)?.removeAt(indexPausa);
  }

  initFormPausa(): FormGroup {
    return this.formBuilder.group({
      horario_inicio: [null, Validators.required],
      horario_fim: [null, Validators.required]
    })
  }

  onSubmit(): void {

    console.log(this.formServicos.value);

    this.formServicos.markAllAsTouched();

    if (this.formServicos.invalid) {
      this.toastr.danger('Preencha os campos obrigatórios para prosseguir')
      return;
    }

  }

}
