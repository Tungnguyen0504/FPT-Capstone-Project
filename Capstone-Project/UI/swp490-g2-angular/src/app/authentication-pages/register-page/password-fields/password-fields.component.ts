import { AfterViewInit, Component, Input } from "@angular/core";
import {
  AbstractControl,
  ControlContainer,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { CustomValidators } from "src/app/utils";

@Component({
  selector: "app-password-fields",
  templateUrl: "./password-fields.component.html",
  styleUrls: ["./password-fields.component.scss"],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm,
    },
  ],
})
export class PasswordFieldsComponent implements AfterViewInit {
  @Input() isChangingPassword = false;

  constructor(public form: NgForm) {}

  private initConfirmPasswordValidator(): void {
    /**
    Template for validator
      const validator = (): ValidatorFn => {
      return (control: AbstractControl<any, any>): ValidationErrors | null => {

        }
      }

     */

    const validator = (): ValidatorFn => {
      return (control: AbstractControl<any, any>): ValidationErrors | null => {
        const password = this.form.controls["password"].value;
        if (password !== control.value) {
          return {
            message:
              "Confirm password must be the same as the entered password",
          };
        }

        return null;
      };
    };

    this.form.controls["confirmPassword"].addValidators([
      Validators.required,
      validator(),
    ]);
    this.form.controls["confirmPassword"].updateValueAndValidity();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.form.controls["password"].addValidators([
        Validators.required,
        // 2. check whether the entered password has a number
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        // 3. check whether the entered password has upper case letter
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        // 4. check whether the entered password has a lower-case letter
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        // 5. check whether the entered password has a special character
        CustomValidators.patternValidator(
          /[ !"#$%&'()*+,-./:;<=>?@\[\\\]^_`{|}~]/,
          { hasSpecialCharacters: true }
        ),
        // 6. Has a minimum length of 8 characters
        Validators.minLength(8),
        // 7. Has a maximum length of 25 characters
        Validators.maxLength(25),
      ]);
      this.form.controls["password"].updateValueAndValidity();

      this.initConfirmPasswordValidator();
    });
  }

  validatePasswordStyle(field: string): boolean {
    if (!this.form || !this.form.controls["password"]) return true;

    return (
      this.form.controls["password"].errors &&
      (this.form.controls["password"].errors["required"] ||
        this.form.controls["password"].errors[field])
    );
  }
}
