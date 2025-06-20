import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from "@angular/core";
import { ToastrService } from "@shared/components/toastr/toastr.service";
import { catchError, throwError } from "rxjs";

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {

  const toastr = inject(ToastrService)

  const exibirMessages = (errorMessages: string | string[]) => {
    if (!Array.isArray(errorMessages)) {
      toastr.danger(errorMessages)
      return
    }
    errorMessages.forEach(message => {
      toastr.danger(message)
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 400 && error.error?.message) {
        exibirMessages(error.error.message)
      } else if (error.status === 401 && error.error?.message) {
        exibirMessages(error.error.message)
      } else {
        toastr.danger('Ocorreu um erro inesperado. Tente novamente.', `Erro ${error.status}`)
      }
      return throwError(() => error);
    })
  );
};
