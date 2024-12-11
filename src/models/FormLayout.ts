import { FieldLayout, ButtonAlignment, FormVariant, FormDensity, FormRoundness } from './FormLayoutTypes';

export class FormLayout {
  columns: number;
  gap: string;
  buttonAlignment: ButtonAlignment;
  fieldLayout: FieldLayout;
  variant: FormVariant;
  density: FormDensity;
  roundness: FormRoundness;

  constructor(options: Partial<FormLayout> = {}) {
    this.columns = options.columns || 1;
    this.gap = options.gap || '20px';
    this.buttonAlignment = options.buttonAlignment || ButtonAlignment.CENTER;
    this.fieldLayout = options.fieldLayout || FieldLayout.STANDARD;
    this.variant = options.variant || FormVariant.LIGHT;
    this.density = options.density || FormDensity.STANDARD;
    this.roundness = options.roundness || FormRoundness.MEDIUM;
  }
}
