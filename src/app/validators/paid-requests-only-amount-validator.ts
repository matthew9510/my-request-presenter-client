import { ValidationErrors, ValidatorFn, AbstractControl } from "@angular/forms";

export function PaidRequestsOnlyMinimumRequestAmount(
  minimumRequestAmount: string
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = Number(control.value) >= Number(minimumRequestAmount);
    return valid ? null : { minimumRequestAmount: { value: control.value } };
  };
}
