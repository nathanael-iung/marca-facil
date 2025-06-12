import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ToastrService } from "./toastr.service";
import { MessageService } from "primeng/api";
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.css'],
  imports: [Toast]
})
export class ToastrComponent implements OnInit, OnDestroy {

  toastrService = inject(ToastrService)
  messageService = inject(MessageService)

  width = ''

  sub$ = new Subject<void>()

  subToastrSuccess$ = this.toastrService.escutarSuccess()
  subToastrWarning$ = this.toastrService.escutarWarning()
  subToastrDanger$ = this.toastrService.escutarDanger()

  ngOnInit(): void {
   this.criarSubsParaExibirToastr()
  }

  criarSubsParaExibirToastr(): void {
    this.subToastrSuccess$.pipe(takeUntil(this.sub$)).subscribe(dados => {
      this.checkWidth()
      this.messageService.add({
        severity: 'success',
        summary: dados?.titulo ?? '',
        detail: dados?.mensagem ?? ''
      })
    })
    this.subToastrWarning$.pipe(takeUntil(this.sub$)).subscribe(dados => {
      this.checkWidth()
      this.messageService.add({
        severity: 'warn',
        summary: dados?.titulo ?? '',
        detail: dados?.mensagem ?? ''
      })
    })
    this.subToastrDanger$.pipe(takeUntil(this.sub$)).subscribe(dados => {
      this.checkWidth()
      this.messageService.add({
        severity: 'error',
        summary: dados?.titulo ?? '',
        detail: dados?.mensagem ?? ''
      })
    })
  }

  checkWidth(): void {
    if(window.innerWidth > 991){
      this.width = '35vw'
    } else {
      this.width = '80vw'
    }
  }

  ngOnDestroy(): void {
    this.sub$.next()
    this.sub$.complete()
  }

}
