import { randomUUID } from 'node:crypto';
import type { APIContext, APIRoute } from 'astro';
import { FORM_DELIVERY_BEARER_TOKEN, FORM_DELIVERY_URL } from 'astro:env/server';
import { z } from 'zod';
import {
  csrfCookieName,
  isSameOriginRequest,
  rateLimitHeaders,
  takeRateLimit,
  verifyCsrfToken,
} from './form-security';

const MAX_BODY_BYTES = 16 * 1024;
const SUBMISSION_LIMIT = 8;
const SUBMISSION_WINDOW_MS = 10 * 60 * 1_000;

type FieldErrors = Record<string, string>;
type FormValues = Record<string, string>;

type FormDefinition = {
  endpoint: string;
  formType: string;
  subject: string;
  successUrl: string;
  schema: z.ZodType<FormValues>;
  labels: Record<string, string>;
};

const controlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g;
const nameCharacters = /^[\p{L}\p{M}][\p{L}\p{M}\p{N} .,'’\-]*$/u;

function normalizeSingleLine(value: unknown) {
  if (typeof value !== 'string') return value;
  return value.normalize('NFKC').replace(controlCharacters, '').replace(/\s+/g, ' ').trim();
}

function normalizeMultiline(value: unknown) {
  if (typeof value !== 'string') return value;
  return value
    .normalize('NFKC')
    .replace(/\r\n?/g, '\n')
    .replace(controlCharacters, '')
    .replace(/[\t ]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function nameField(label: string) {
  return z.preprocess(
    normalizeSingleLine,
    z.string()
      .min(1, `${label} is required.`)
      .max(80, `${label} must be 80 characters or fewer.`)
      .regex(nameCharacters, `${label} contains unsupported characters.`),
  );
}

function textField(label: string, maximum: number) {
  return z.preprocess(
    normalizeSingleLine,
    z.string()
      .min(1, `${label} is required.`)
      .max(maximum, `${label} must be ${maximum} characters or fewer.`),
  );
}

function messageField(label: string) {
  return z.preprocess(
    normalizeMultiline,
    z.string()
      .min(20, `${label} must be at least 20 characters.`)
      .max(3_000, `${label} must be 3,000 characters or fewer.`),
  );
}

const emailField = z.preprocess(
  (value) => {
    const normalized = normalizeSingleLine(value);
    return typeof normalized === 'string' ? normalized.toLowerCase() : normalized;
  },
  z.string()
    .min(1, 'Work email is required.')
    .max(254, 'Work email must be 254 characters or fewer.')
    .email('Enter a valid work email address.'),
);

export const contactForm: FormDefinition = {
  endpoint: 'contact',
  formType: 'contact',
  subject: 'New AGI contact request',
  successUrl: '/contact/thanks',
  labels: {
    'first-name': 'First name',
    'last-name': 'Last name',
    email: 'Work email',
    company: 'Company',
    intent: 'Operational focus area',
    message: 'Requirements',
  },
  schema: z.strictObject({
    'first-name': nameField('First name'),
    'last-name': nameField('Last name'),
    email: emailField,
    company: textField('Company', 120),
    intent: z.enum(['security', 'managed-it', 'ai', 'general'], {
      error: 'Choose a valid operational focus area.',
    }),
    message: messageField('Requirements'),
  }),
};

export const aiConsultationForm: FormDefinition = {
  endpoint: 'ai-consultation',
  formType: 'ai-consultation',
  subject: 'New AGI AI services request',
  successUrl: '/contact/thanks',
  labels: {
    'first-name': 'First name',
    'last-name': 'Last name',
    email: 'Work email',
    'workflow-bottleneck': 'Workflow to improve',
  },
  schema: z.strictObject({
    'first-name': nameField('First name'),
    'last-name': nameField('Last name'),
    email: emailField,
    'workflow-bottleneck': messageField('Workflow to improve'),
  }),
};

export const readinessBriefForm: FormDefinition = {
  endpoint: 'readiness-brief',
  formType: 'readiness-brief',
  subject: 'New AGI Operations Readiness Brief request',
  successUrl: '/operations-readiness-brief/thanks',
  labels: {
    'first-name': 'First name',
    'last-name': 'Last name',
    email: 'Work email',
    company: 'Company',
    interest: 'Primary interest',
  },
  schema: z.strictObject({
    'first-name': nameField('First name'),
    'last-name': nameField('Last name'),
    email: emailField,
    company: textField('Company', 120),
    interest: z.enum(['ai', 'security', 'global', 'mixed'], {
      error: 'Choose a valid primary interest.',
    }),
  }),
};

function jsonResponse(body: object, status: number, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    },
  });
}

async function readPayload(request: Request) {
  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/x-www-form-urlencoded') {
    return { error: 'unsupported-media-type' as const };
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return { error: 'too-large' as const };
  }

  const body = await request.text();
  if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) return { error: 'too-large' as const };

  const params = new URLSearchParams(body);
  const values: Record<string, string> = {};
  for (const [key, value] of params) {
    if (Object.hasOwn(values, key)) return { error: 'duplicate-field' as const };
    values[key] = value;
  }

  return { values };
}

function fieldErrorsFromZod(error: z.ZodError, labels: Record<string, string>) {
  const errors: FieldErrors = {};

  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? '');
    if (field && labels[field] && !errors[field]) errors[field] = issue.message;
  }

  return errors;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] ?? character);
}

function buildDeliveryMessage(definition: FormDefinition, values: FormValues) {
  const lines = Object.entries(definition.labels).map(([key, label]) => `${label}: ${values[key]}`);
  const htmlRows = Object.entries(definition.labels).map(([key, label]) => (
    `<tr><th scope="row" style="text-align:left;vertical-align:top;padding:6px 12px 6px 0">${escapeHtml(label)}</th>`
    + `<td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(values[key])}</td></tr>`
  ));

  return {
    event: 'aetas.form-submission',
    version: 1,
    submission: {
      type: definition.formType,
      receivedAt: new Date().toISOString(),
      subject: definition.subject,
      replyTo: values.email,
      text: lines.join('\n'),
      html: `<table>${htmlRows.join('')}</table>`,
    },
  };
}

async function deliverSubmission(definition: FormDefinition, values: FormValues) {
  if (!FORM_DELIVERY_URL || !FORM_DELIVERY_BEARER_TOKEN) return false;

  let deliveryUrl: URL;
  try {
    deliveryUrl = new URL(FORM_DELIVERY_URL);
  } catch {
    return false;
  }

  if (deliveryUrl.protocol !== 'https:' || deliveryUrl.username || deliveryUrl.password) return false;

  const response = await fetch(deliveryUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${FORM_DELIVERY_BEARER_TOKEN}`,
      'Content-Type': 'application/json; charset=utf-8',
      'User-Agent': 'Aetas-Website-Forms/1.0',
    },
    body: JSON.stringify(buildDeliveryMessage(definition, values)),
    redirect: 'error',
    signal: AbortSignal.timeout(8_000),
  });

  return response.ok;
}

function getClientIdentifier(context: APIContext) {
  try {
    return context.clientAddress || 'unknown-client';
  } catch {
    return 'unknown-client';
  }
}

export function createFormEndpoint(definition: FormDefinition): APIRoute {
  return async (context) => {
    const { request, cookies } = context;
    const rateLimit = takeRateLimit({
      endpoint: definition.endpoint,
      identifier: getClientIdentifier(context),
      limit: SUBMISSION_LIMIT,
      windowMs: SUBMISSION_WINDOW_MS,
    });
    const limitHeaders = rateLimitHeaders(rateLimit);

    if (!rateLimit.allowed) {
      return jsonResponse({
        ok: false,
        message: 'Too many requests were sent. Please wait a few minutes and try again.',
      }, 429, limitHeaders);
    }

    if (!isSameOriginRequest(request)) {
      return jsonResponse({
        ok: false,
        message: 'Your secure form session could not be verified. Refresh the page and try again.',
      }, 403, limitHeaders);
    }

    let payload: Awaited<ReturnType<typeof readPayload>>;
    try {
      payload = await readPayload(request);
    } catch {
      return jsonResponse({
        ok: false,
        message: 'The request could not be processed. Check the form and try again.',
      }, 400, limitHeaders);
    }

    if ('error' in payload) {
      const status = payload.error === 'too-large' ? 413 : payload.error === 'unsupported-media-type' ? 415 : 400;
      return jsonResponse({
        ok: false,
        message: status === 413
          ? 'The request is too large. Shorten the form entries and try again.'
          : 'The request could not be processed. Check the form and try again.',
      }, status, limitHeaders);
    }

    const csrfToken = payload.values['csrf-token'] ?? '';
    const csrfResult = verifyCsrfToken(csrfToken, cookies.get(csrfCookieName())?.value);
    if (!csrfResult.valid) {
      if (csrfResult.reason === 'too-fast') {
        return jsonResponse({
          ok: false,
          message: 'Please wait a moment, then submit the form again.',
        }, 400, { ...limitHeaders, 'Retry-After': String(csrfResult.retryAfterSeconds) });
      }

      return jsonResponse({
        ok: false,
        message: 'Your secure form session expired. Refresh the page and try again.',
        refreshCsrf: true,
      }, 403, limitHeaders);
    }

    if ((payload.values.website ?? '').trim()) {
      return jsonResponse({ ok: true, redirect: definition.successUrl }, 200, limitHeaders);
    }

    const formValues = { ...payload.values };
    delete formValues['csrf-token'];
    delete formValues.website;

    const parsed = definition.schema.safeParse(formValues);
    if (!parsed.success) {
      const fieldErrors = fieldErrorsFromZod(parsed.error, definition.labels);
      return jsonResponse({
        ok: false,
        message: Object.keys(fieldErrors).length > 0
          ? 'Check the highlighted fields and try again.'
          : 'The request could not be processed. Check the form and try again.',
        fieldErrors,
      }, 400, limitHeaders);
    }

    const requestId = randomUUID();
    try {
      const delivered = await deliverSubmission(definition, parsed.data);
      if (!delivered) {
        console.error(`[forms] delivery_unavailable request=${requestId}`);
        return jsonResponse({
          ok: false,
          message: 'We could not send your request right now. Please try again later or email info@aetasglobal.com.',
        }, 503, limitHeaders);
      }
    } catch {
      console.error(`[forms] delivery_failed request=${requestId}`);
      return jsonResponse({
        ok: false,
        message: 'We could not send your request right now. Please try again later or email info@aetasglobal.com.',
      }, 503, limitHeaders);
    }

    return jsonResponse({ ok: true, redirect: definition.successUrl }, 200, limitHeaders);
  };
}
