import './multi-step-form-component.css';

import { createElementFromHTML, insertAfter, validateEmail } from '$utils/index';

import { FieldErrorType } from './field-error-type.enum';

export class MultiStepFormComponent {
  private _stepClasses: string[] = [];
  private _nextButtonClasses: string[] = [];
  private _prevButtonClasses: string[] = [];
  private _currentRequiredInputs: HTMLInputElement[] = [];
  private _from: HTMLFormElement | null = null;
  public currentStep = 0;

  constructor(
    formId: string,
    stepClasses: string[],
    nextButtonClasses: string[],
    prevButtonClasses: string[]
  ) {
    this._stepClasses = stepClasses;
    this._nextButtonClasses = nextButtonClasses;
    this._prevButtonClasses = prevButtonClasses;
    this._from = document.querySelector<HTMLFormElement>(formId);
    if (!this._from) {
      return;
    }
    this._init();
  }

  private _init = (): void => {
    this.showStep();

    this._nextButtonClasses.forEach((button, index) => {
      const nextButtonEl: HTMLButtonElement | null =
        this._from!.querySelector<HTMLButtonElement>(button);
      if (!nextButtonEl) {
        return;
      }

      nextButtonEl.addEventListener('click', (event: MouseEvent) => {
        if (this.validateStep(this._stepClasses[index])) {
          if (index < this._stepClasses.length - 1) {
            this.currentStep++;
            this.showStep();
          }
        } else {
          event.preventDefault();
          event.stopPropagation();
          this._currentRequiredInputs.forEach((input) => {
            input.addEventListener('focus', () => {
              this.hideFieldError(input);
            });
          });
        }
      });
    });

    this._prevButtonClasses.forEach((button) => {
      const prevButtonEl: HTMLButtonElement | null =
        this._from!.querySelector<HTMLButtonElement>(button);
      if (!prevButtonEl) {
        return;
      }

      prevButtonEl.addEventListener('click', () => {
        this.currentStep--;
        this.showStep();
        this._currentRequiredInputs.forEach((input) => {
          this.hideFieldError(input);
          input.removeEventListener('focus', () => {
            this.hideFieldError(input);
          });
        });
      });
    });
  };

  private showStep(): void {
    this._stepClasses.forEach((step, index) => {
      const divEl: HTMLDivElement | null = this._from!.querySelector<HTMLDivElement>(step);
      if (!divEl) {
        return;
      }
      if (index !== this.currentStep) {
        divEl.style.display = 'none';
      } else {
        divEl.style.display = 'block';
      }
    });
  }

  private updateStepRequiredInputs(step: string): void {
    const divEl: HTMLDivElement | null = this._from!.querySelector<HTMLDivElement>(step);
    if (!divEl) {
      return;
    }
    this._currentRequiredInputs = [];
    divEl
      .querySelectorAll('input[required], textarea[required]')
      .forEach((value) => this._currentRequiredInputs.push(value as HTMLInputElement));
  }

  private hideFieldError(input: HTMLInputElement): void {
    const nextTooltip: HTMLDivElement | null = input.nextElementSibling?.classList.contains(
      'invalid-field-tooltip'
    )
      ? (input.nextElementSibling as HTMLDivElement)
      : null;

    if (nextTooltip) {
      nextTooltip.remove();
      input.style.border = '1px solid #f1f1f1';
    }
  }

  private showFieldError(
    input: HTMLInputElement,
    errorType: FieldErrorType = FieldErrorType.EMPTY
  ): void {
    const divTooltip: Node = createElementFromHTML(
      `<div class="invalid-field-tooltip">${
        errorType === FieldErrorType.NOT_EMAIL_FORMAT
          ? "Format d'email valide requis"
          : 'Ce champs est requis'
      }</div>`
    );
    insertAfter(input, divTooltip);
    input.style.border = '1px solid red';
  }

  private validateStep(step: string): boolean {
    this.updateStepRequiredInputs(step);
    let isFormStepValid = true;

    this._currentRequiredInputs.forEach((input: HTMLInputElement) => {
      const isEmail: string | null = input.getAttribute('is-email');
      const inputValue = input.value.trim();

      if (inputValue === '') {
        isFormStepValid = false;
        this.showFieldError(input, FieldErrorType.EMPTY);
      } else if (isEmail && !validateEmail(inputValue)) {
        isFormStepValid = false;
        this.showFieldError(input, FieldErrorType.NOT_EMAIL_FORMAT);
      } else {
        this.hideFieldError(input);
      }
    });

    return isFormStepValid;
  }
}
