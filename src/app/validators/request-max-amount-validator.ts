import { ValidationErrors, ValidatorFn, AbstractControl } from "@angular/forms";

export function MaximumRequestAmount(
  maximumRequestAmount: string
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid =
      Number(control.value) <= Number(maximumRequestAmount) ||
      control.value === "" ||
      control.value === "0";

    return valid ? null : { maximumRequestAmount: { value: control.value } };
  };
}
