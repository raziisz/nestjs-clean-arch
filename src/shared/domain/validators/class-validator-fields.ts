import { FieldsErrors, ValidatorFieldsInterface } from "./validator-fields.interface";
import { validateSync } from "class-validator";

export abstract class ClassValidatorFields<PropsValidated> implements ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsErrors = null;
  validatedData: PropsValidated = null;

  validate(data: any): boolean {
    const errors = validateSync(data)
    if (errors.length > 0) {
      this.errors = {}
      for (const error of errors) {
        const field = error.property
        this.errors[field] = Object.values(error.constraints)
      }

      return false
    }

    this.validatedData = data
    return true
  }

}
