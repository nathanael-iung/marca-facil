import { Directive, inject } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
import { UtilService } from "@shared/services/util/util.service";

@Directive({
  selector: '[appCpfValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: CpfValidatorDirective,
    multi: true
  }]
})
export class CpfValidatorDirective implements Validator {

  utils = inject(UtilService)

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value)
      return null;
    return this.utils.isCpfValido(control.value) ? null : { 'cpfInvalido': true };
  }
}
