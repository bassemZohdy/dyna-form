import { FieldType } from './FieldType';
import { FormFieldValidation } from './FormFieldValidation';
import { ValidationTypes } from './ValidationTypes';

export class FormField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  defaultValue?: string | number | boolean;
  multiple?: boolean;
  validators: FormFieldValidation[];

  constructor(options: Partial<FormField> = {}) {
    this.name = options.name || '';
    this.label = options.label || '';
    this.type = options.type || FieldType.TEXT;
    this.required = options.required || false;
    this.placeholder = options.placeholder;
    this.options = Array.isArray(options.options) ? options.options : [];
    this.defaultValue = options.defaultValue;
    this.multiple = options.multiple || false;
    // Ensure validators is always an array
    this.validators = Array.isArray(options.validators) ?
      options.validators.map(v => new FormFieldValidation(v.type, v.message, v.value)) :
      [];

    // Add required validator if field is required
    if (this.required) {
      this.validators.push(new FormFieldValidation(
        ValidationTypes.REQUIRED,
        `${this.label} is required`
      ));
    }
  }
}