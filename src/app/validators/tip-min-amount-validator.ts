import { ValidationErrors, ValidatorFn, AbstractControl } from "@angular/forms";

export function MinimumTipAmount(minimumTipAmount: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = Number(control.value) >= Number(minimumTipAmount);
    return valid ? null : { minimumTipAmount: { value: control.value } };
  };
}
