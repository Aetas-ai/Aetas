import { createFormEndpoint, readinessBriefForm } from '../../../lib/server/forms';

export const prerender = false;
export const POST = createFormEndpoint(readinessBriefForm);
