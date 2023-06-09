import './multi-step-form-component.css';

import { createElementFromHTML, insertAfter } from '$utils/index';

export class MultiStepFormComponent {
  private _stepClasses: string[] = [];
  private _nextButtonClasses: string[] = [];
  private _prevButtonClasses: string[] = [];
  private _currentRequiredInputs: HTMLInputElement[] = [];
  public currentStep = 0;

  constructor(stepClasses: string[], nextButtonClasses: string[], prevButtonClasses: string[]) {
    this._stepClasses = stepClasses;
    this._nextButtonClasses = nextButtonClasses;
    this._prevButtonClasses = prevButtonClasses;

    this._init();
  }

  private _init = (): void => {
    this.showStep();

    this._nextButtonClasses.forEach((button, index) => {
      const nextButtonEl: HTMLButtonElement | null =
        document.querySelector<HTMLButtonElement>(button);
      if (!nextButtonEl) {
        return;
      }

      nextButtonEl.addEventListener('click', () => {
        if (this.validateStep(this._stepClasses[index])) {
          this.currentStep++;
          this.showStep();
        } else {
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
        document.querySelector<HTMLButtonElement>(button);
      if (!prevButtonEl) {
        return;
      }

      prevButtonEl.addEventListener('click', () => {
        this.currentStep--;
        this.showStep();
        this._currentRequiredInputs.forEach((input) => {
          input.removeEventListener('focus', () => {
            this.hideFieldError(input);
          });
        });
      });
    });
  };

  private showStep(): void {
    this._stepClasses.forEach((step, index) => {
      const divEl: HTMLDivElement | null = document.querySelector<HTMLDivElement>(step);
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
    const divEl: HTMLDivElement | null = document.querySelector<HTMLDivElement>(step);
    if (!divEl) {
      return;
    }
    this._currentRequiredInputs = [];
    divEl
      .querySelectorAll('input[required]')
      .forEach((value) => this._currentRequiredInputs.push(value as HTMLInputElement));
  }

  private hideFieldError(input: HTMLInputElement): void {
    const nextTooltip: HTMLDivElement | null = input.nextElementSibling?.classList.contains(
      'tooltip'
    )
      ? (input.nextElementSibling as HTMLDivElement)
      : null;

    if (nextTooltip) {
      nextTooltip.style.display = 'none';
      input.style.border = '1px solid #f1f1f1';
    }
  }

  private showFieldError(input: HTMLInputElement): void {
    const isNextTooltip: boolean | undefined =
      input.nextElementSibling?.classList.contains('tooltip');
    if (!isNextTooltip) {
      const divTooltip: Node = createElementFromHTML(
        '<div class="tooltip">Ce champs est requis</div>'
      );
      insertAfter(input, divTooltip);
    } else {
      (input.nextElementSibling as HTMLDivElement).style.display = 'block';
    }
    input.style.border = '1px solid red';
  }

  private validateStep(step: string): boolean {
    this.updateStepRequiredInputs(step);
    let isFormStepValid = true;

    this._currentRequiredInputs.forEach((input: HTMLInputElement) => {
      if (input.value.trim() === '') {
        isFormStepValid = false;
        this.showFieldError(input);
      } else {
        this.hideFieldError(input);
      }
    });

    return isFormStepValid;
  }
}
