import { aiConsultationForm, createFormEndpoint } from '../../../lib/server/forms';

export const prerender = false;
export const POST = createFormEndpoint(aiConsultationForm);
