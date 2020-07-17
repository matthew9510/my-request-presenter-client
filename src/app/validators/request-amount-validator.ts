import { ValidationErrors, ValidatorFn, AbstractControl } from "@angular/forms";

export function MinimumRequestAmount(
  minimumRequestAmount: string
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid =
      Number(control.value) >= Number(minimumRequestAmount) ||
      control.value === "" ||
      control.value === "0";
    return valid ? null : { invalidAmount: { value: control.value } };
  };
}
