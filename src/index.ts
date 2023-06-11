import { restartWebflow } from '@finsweet/ts-utils';

import { MultiStepFormComponent } from '$components/multi-step-form-component/multi-step-form-component';

window.Webflow ||= [];
window.Webflow.push(() => {
  const form = new MultiStepFormComponent(
    '#wf-form-Ticket-Form',
    ['.step_1', '.step_2'],
    ['.step_1 .button_next', '.step_2 .button_next'],
    ['.step_2 .button_previous']
  );

  restartWebflow();
});
