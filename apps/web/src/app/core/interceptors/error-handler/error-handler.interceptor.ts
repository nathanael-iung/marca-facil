import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from "@angular/core";
import { ToastrService } from "@shared/components/toastr/toastr.service";
import { catchError, throwError } from "rxjs";

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {

  const toastr = inject(ToastrService)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 400 && error.error?.message && Array.isArray(error.error.message)) {
        const errorMessages: string[] = error.error.message;
        errorMessages.forEach(message => {
          toastr.danger(message)
        });
      } else {
        toastr.danger('Ocorreu um erro inesperado. Tente novamente.', `Erro ${error.status}`)
      }
      return throwError(() => error);
    })
  );
};
