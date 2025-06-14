import { Directive, inject } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors } from "@angular/forms";
import { UtilService } from "@shared/services/util/util.service";

@Directive({
  selector: '[appDateValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: DateValidatorDirective,
    multi: true
  }]
})
export class DateValidatorDirective {
  utils = inject(UtilService)

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value)
      return null;
    return this.utils.isDataValida(control.value) ? null : { 'dataNascInvalida': true };
  }
}
