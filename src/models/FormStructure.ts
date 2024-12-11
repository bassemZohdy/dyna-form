import { FormField } from './FormField';
import { FormLayout } from './FormLayout';

/**
 * Class representing the structure of a form.
 */
export class FormStructure {
  fields: FormField[];
  metadata?: {
    title?: string;
    description?: string;
  };
  layout: FormLayout;

  constructor(options: Partial<FormStructure> = {}) {
    this.fields = (options.fields || []).map(field => new FormField(field));
    this.metadata = {
      title: options.metadata?.title || '',
      description: options.metadata?.description || '',
    };
    this.layout = new FormLayout(options.layout);
  }

  /**
   * Adds a field to the form structure.
   * @param field - The field to add.
   */
  addField(field: FormField): void {
    this.fields.push(field);
  }
}