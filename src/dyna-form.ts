import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { FieldType } from './models/FieldType';
import { FormField } from './models/FormField';
import { FormStructure } from './models/FormStructure';
import { ValidationService } from './services/ValidationService';
import { FieldLayout, ButtonAlignment, FormVariant, FormDensity, FormRoundness } from './models/FormLayoutTypes';

class DynaForm extends LitElement {
  @property({ type: Object }) structure: FormStructure = new FormStructure({
    layout: {
      columns: 1,
      gap: '20px',
      buttonAlignment: ButtonAlignment.CENTER,
      fieldLayout: FieldLayout.STANDARD,
      variant: FormVariant.LIGHT,
      density: FormDensity.STANDARD,
      roundness: FormRoundness.MEDIUM
    }
  });
  @property({ type: Object }) value: Record<string, any> = {};
  @property({ type: Object }) errors: Record<string, string[]> = {};

  static styles = css`
    :host {
      display: block;
      padding: 24px;
      font-family: Arial, sans-serif;
      max-width: 1200px;
      margin: auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    form {
      display: grid;
      gap: var(--form-gap, 20px);
    }

    .form-fields {
      display: grid;
      gap: var(--form-gap, 20px);
      grid-template-columns: repeat(var(--form-columns, 1), 1fr);
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    label {
      font-weight: 500;
      color: #333;
    }

    input, select, textarea {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      transition: all 0.2s ease;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }

    .error {
      color: #dc3545;
      font-size: 14px;
      margin-top: 4px;
    }

    .button-group {
      display: flex;
      gap: 12px;
      justify-content: var(--button-alignment, center);
      margin-top: 24px;
    }

    button {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    button[type="submit"] {
      background-color: #007bff;
      color: white;
    }

    button[type="submit"]:hover {
      background-color: #0056b3;
    }

    button[type="button"] {
      background-color: #6c757d;
      color: white;
    }

    button[type="button"]:hover {
      background-color: #5a6268;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .form-title {
      font-size: 24px;
      color: #333;
      margin: 0 0 8px 0;
    }

    .form-description {
      color: #666;
      margin: 0 0 24px 0;
    }

    /* Field Layout Styles */
    .field-outlined input,
    .field-outlined select,
    .field-outlined textarea {
      border: 2px solid #ccc;
      background: transparent;
    }

    .field-filled input,
    .field-filled select,
    .field-filled textarea {
      border: none;
      border-bottom: 2px solid #ccc;
      background: #f5f5f5;
    }

    .field-underlined input,
    .field-underlined select,
    .field-underlined textarea {
      border: none;
      border-bottom: 2px solid #ccc;
      border-radius: 0;
      padding: 12px 0;
    }

    /* Density Styles */
    .density-comfortable input,
    .density-comfortable select,
    .density-comfortable textarea {
      padding: 16px;
    }

    .density-compact input,
    .density-compact select,
    .density-compact textarea {
      padding: 8px;
    }

    /* Variant Styles */
    .variant-dark {
      background: #333;
      color: white;
    }

    .variant-dark input,
    .variant-dark select,
    .variant-dark textarea {
      background: #444;
      color: white;
      border-color: #666;
    }

    .variant-dark label {
      color: #fff;
    }
  `;

  render() {
    const layout = this.structure?.layout || {
      columns: 1,
      gap: '20px',
      buttonAlignment: ButtonAlignment.CENTER,
      fieldLayout: FieldLayout.STANDARD,
      variant: FormVariant.LIGHT,
      density: FormDensity.STANDARD,
      roundness: FormRoundness.MEDIUM
    };

    return html`
      <form 
        @submit="${this.handleSubmit}"
        style="--form-columns: ${layout.columns}; --form-gap: ${layout.gap};"
        class="
          variant-${layout.variant.toLowerCase()}
          density-${layout.density.toLowerCase()}
        "
      >
        ${this.renderMetadata()}
        <div class="form-fields">
          ${this.structure?.fields?.map(field => this.renderFormField(field)) || ''}
        </div>
        ${this.renderButtons()}
      </form>
    `;
  }

  renderMetadata() {
    return html`
      ${this.structure.metadata?.title ? 
        html`<h2 class="form-title">${this.structure.metadata.title}</h2>` : ''}
      ${this.structure.metadata?.description ? 
        html`<p class="form-description">${this.structure.metadata.description}</p>` : ''}
    `;
  }

  renderFormField(field: FormField) {
    const layout = this.structure?.layout || {
      columns: 1,
      gap: '20px',
      buttonAlignment: ButtonAlignment.CENTER,
      fieldLayout: FieldLayout.STANDARD,
      variant: FormVariant.LIGHT,
      density: FormDensity.STANDARD,
      roundness: FormRoundness.MEDIUM
    };

    const layoutClass = `field-${layout.fieldLayout.toLowerCase()}`;
    return html`
      <div class="form-field ${layoutClass}">
        <label for="${field.name}">${field.label}</label>
        ${this.renderField(field)}
        ${this.errors[field.name]?.map(
          error => html`<div class="error">${error}</div>`
        )}
      </div>
    `;
  }

  renderButtons() {
    const layout = this.structure?.layout || {
      columns: 1,
      gap: '20px',
      buttonAlignment: ButtonAlignment.CENTER,
      fieldLayout: FieldLayout.STANDARD,
      variant: FormVariant.LIGHT,
      density: FormDensity.STANDARD,
      roundness: FormRoundness.MEDIUM
    };

    return html`
      <div 
        class="button-group"
        style="--button-alignment: ${layout.buttonAlignment};"
      >
        <button type="submit" ?disabled="${!this.isValid()}">Submit</button>
        <button type="button" @click="${this.handleReset}">Reset</button>
      </div>
    `;
  }

  renderField(field: FormField) {
    switch (field.type) {
      case FieldType.TEXT:
      case FieldType.EMAIL:
      case FieldType.PASSWORD:
      case FieldType.NUMBER:
        return html`
          <input
            id="${field.name}"
            name="${field.name}"
            type="${field.type}"
            .value="${this.value[field.name] || field.defaultValue || ''}"
            ?required="${field.required}"
            placeholder="${field.placeholder || ''}"
            @input="${(e: Event) => this.handleInput(e, field.name)}"
          />
        `;
      case FieldType.TEXTAREA:
        return html`
          <textarea
            id="${field.name}"
            name="${field.name}"
            .value="${this.value[field.name] || field.defaultValue || ''}"
            ?required="${field.required}"
            placeholder="${field.placeholder || ''}"
            @input="${(e: Event) => this.handleInput(e, field.name)}"
          ></textarea>
        `;
      case FieldType.SELECT:
        return html`
          <select
            id="${field.name}"
            name="${field.name}"
            .value="${this.value[field.name] || field.defaultValue || ''}"
            ?required="${field.required}"
            @change="${(e: Event) => this.handleInput(e, field.name)}"
          >
            ${field.options?.map(
              option => html`
                <option 
                  value="${option.value}"
                  ?selected="${this.value[field.name] === option.value}"
                >
                  ${option.label}
                </option>
              `
            )}
          </select>
        `;
      case FieldType.RADIO:
        return html`
          <div class="radio-group">
            ${field.options?.map(
              option => html`
                <label class="radio-option">
                  <input
                    type="radio"
                    name="${field.name}"
                    value="${option.value}"
                    .checked="${this.value[field.name] === option.value}"
                    @change="${(e: Event) => this.handleInput(e, field.name)}"
                  />
                  ${option.label}
                </label>
              `
            )}
          </div>
        `;
      case FieldType.CHECKBOX:
        return html`
          <input
            type="checkbox"
            id="${field.name}"
            name="${field.name}"
            .checked="${this.value[field.name] || false}"
            @change="${(e: Event) => this.handleCheckboxInput(e, field.name)}"
          />
        `;
      default:
        return html``;
    }
  }

  handleInput(e: Event, name: string) {
    const target = e.target as HTMLInputElement;
    if (this.value[name] !== target.value) {
      this.value = { ...this.value, [name]: target.value };
      this.validateField(name);
    }
  }

  handleCheckboxInput(e: Event, name: string) {
    const target = e.target as HTMLInputElement;
    this.value = { ...this.value, [name]: target.checked };
    this.validateField(name);
  }

  validateField(fieldName: string) {
    const field = this.structure.fields.find(f => f.name === fieldName);
    if (field) {
      const fieldErrors = ValidationService.getFieldValidationErrors(field, this.value[fieldName]);
      this.errors = {
        ...this.errors,
        [fieldName]: fieldErrors
      };
      this.requestUpdate();
    }
  }

  validateForm() {
    this.errors = ValidationService.getFormValidationErrors(this.structure, this.value);
    this.requestUpdate();
  }

  isValid(): boolean {
    return ValidationService.validateForm(this.structure, this.value);
  }

  handleSubmit(e: Event) {
    e.preventDefault();
    this.validateForm();
    if (this.isValid() && this.onSubmit) {
      this.onSubmit(this.value);
    }
  }

  handleReset() {
    this.value = {};
    this.errors = {};
    this.requestUpdate();
    if (this.onReset) {
      this.onReset();
    }
  }

  onSubmit?: (values: Record<string, any>) => void;
  onReset?: () => void;
}

customElements.define('dyna-form', DynaForm);