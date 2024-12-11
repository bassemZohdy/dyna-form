import { FormField } from '../models/FormField';
import { FormStructure } from '../models/FormStructure';
import { ValidationTypes } from '../models/ValidationTypes';

export class ValidationService {
  static validateField(field: FormField, value: any): boolean {
    if (!value && !field.required) {
      return true;
    }

    if (!Array.isArray(field.validators)) {
      return true;
    }

    for (const validator of field.validators) {
      switch (validator.type) {
        case ValidationTypes.REQUIRED:
          if (!value) return false;
          break;
        case ValidationTypes.MIN:
          if (typeof value === 'number' && value < validator.value) return false;
          break;
        case ValidationTypes.MAX:
          if (typeof value === 'number' && value > validator.value) return false;
          break;
        case ValidationTypes.MIN_LENGTH:
          if (typeof value === 'string' && value.length < validator.value) return false;
          break;
        case ValidationTypes.MAX_LENGTH:
          if (typeof value === 'string' && value.length > validator.value) return false;
          break;
        case ValidationTypes.PATTERN:
          if (typeof value === 'string' && !new RegExp(validator.value).test(value)) return false;
          break;
        case ValidationTypes.EMAIL:
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (typeof value === 'string' && !emailRegex.test(value)) return false;
          break;
        case ValidationTypes.URL:
          try {
            new URL(value);
          } catch {
            return false;
          }
          break;
        case ValidationTypes.PHONE:
          const phoneRegex = /^\+?[\d\s-]+$/;
          if (typeof value === 'string' && !phoneRegex.test(value)) return false;
          break;
      }
    }
    return true;
  }

  static getFieldValidationErrors(field: FormField, value: any): string[] {
    const errors: string[] = [];

    if (!value && !field.required) {
      return errors;
    }

    if (!Array.isArray(field.validators)) {
      return errors;
    }

    for (const validator of field.validators) {
      switch (validator.type) {
        case ValidationTypes.REQUIRED:
          if (!value) errors.push(validator.message);
          break;
        case ValidationTypes.MIN:
          if (typeof value === 'number' && value < validator.value) errors.push(validator.message);
          break;
        case ValidationTypes.MAX:
          if (typeof value === 'number' && value > validator.value) errors.push(validator.message);
          break;
        case ValidationTypes.MIN_LENGTH:
          if (typeof value === 'string' && value.length < validator.value) errors.push(validator.message);
          break;
        case ValidationTypes.MAX_LENGTH:
          if (typeof value === 'string' && value.length > validator.value) errors.push(validator.message);
          break;
        case ValidationTypes.PATTERN:
          if (typeof value === 'string' && !new RegExp(validator.value).test(value)) errors.push(validator.message);
          break;
        case ValidationTypes.EMAIL:
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (typeof value === 'string' && !emailRegex.test(value)) errors.push(validator.message);
          break;
        case ValidationTypes.URL:
          try {
            new URL(value);
          } catch {
            errors.push(validator.message);
          }
          break;
        case ValidationTypes.PHONE:
          const phoneRegex = /^\+?[\d\s-]+$/;
          if (typeof value === 'string' && !phoneRegex.test(value)) errors.push(validator.message);
          break;
      }
    }
    return errors;
  }

  static validateFormStructure(structure: FormStructure): boolean {
    return structure.fields.every((field) =>
      field.name && field.label && field.type
    );
  }

  static validateForm(structure: FormStructure, values: Record<string, any>): boolean {
    return structure.fields.every((field) =>
      this.validateField(field, values[field.name])
    );
  }

  static getFormValidationErrors(structure: FormStructure, values: Record<string, any>): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    structure.fields.forEach((field) => {
      const fieldErrors = this.getFieldValidationErrors(field, values[field.name]);
      if (fieldErrors.length > 0) {
        errors[field.name] = fieldErrors;
      }
    });

    return errors;
  }
}