import { contactForm, createFormEndpoint } from '../../../lib/server/forms';

export const prerender = false;
export const POST = createFormEndpoint(contactForm);
