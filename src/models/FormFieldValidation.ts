import { ValidationTypes } from './ValidationTypes';

export class FormFieldValidation {
  type: ValidationTypes;
  message: string;
  value?: any;

  constructor(type: ValidationTypes, message: string, value?: any) {
    this.type = type;
    this.message = message;
    this.value = value;
  }

  static fromJSON(json: any): FormFieldValidation {
    return new FormFieldValidation(
      json.type as ValidationTypes,
      json.message,
      json.value
    );
  }
}
