import { Directive, inject } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { UtilService } from '@shared/services/util/util.service';

@Directive({
  selector: '[appCnpjValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: CnpjValidatorDirective,
    multi: true
  }]
})
export class CnpjValidatorDirective implements Validator {

  utils = inject(UtilService)

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value)
      return null;
    return this.utils.isCnpjValido(control.value) ? null : { 'cnpjInvalido': true };
  }

}
