import { MultiStepFormComponent } from '$components/multi-step-form-component/multi-step-form-component';

window.Webflow ||= [];
window.Webflow.push(() => {
  const form = new MultiStepFormComponent(
    ['.step_1', '.step_2', '.step_3'],
    ['.step_1 .button_next', '.step_2 .button_next'],
    ['.step_2 .button_previous', '.step_3 .button_previous']
  );
});
