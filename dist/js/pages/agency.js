/* The Agency: the general enquiry form. */

import { initForm } from "../lib/forms.js";
import { $$ } from "../lib/ui.js";

$$('[data-form="general"]').forEach(form => initForm(form));
