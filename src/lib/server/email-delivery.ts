export interface EmailSubmissionData {
  formType: string;
  subject: string;
  labels: Record<string, string>;
  values: Record<string, string>;
  reference: string;
  receivedAt: string;
}

export interface ResendConfiguration {
  apiKey: string;
  senderEmail: string;
  recipientEmail: string;
}

export type DeliveryResult =
  | { ok: true }
  | { ok: false; reason: 'config' | 'timeout' | 'network' | 'http' | 'invalid-response'; status?: number };

// Match the wording visitors chose in each form's dropdown.
const choiceLabels: Record<string, Record<string, string>> = {
  intent: {
    security: 'Cybersecurity', 'managed-it': 'Managed IT', ai: 'AI & Automation', general: 'General inquiry',
  },
  interest: {
    ai: 'AI workflow automation', security: 'MXDR / Offensive Security',
    global: 'Managed IT / Business Processes / Help Desk', mixed: 'Multiple service areas',
  },
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] ?? character);
}

function displayValue(key: string, value: string): string {
  return choiceLabels[key]?.[value] ?? value;
}

function submissionRows(data: EmailSubmissionData): Array<[string, string]> {
  return [
    ['Reference', data.reference], ['Received at (UTC)', data.receivedAt], ['Form', data.formType],
    ...Object.entries(data.labels).map(([key, label]): [string, string] => (
      [label, displayValue(key, data.values[key] ?? '')]
    )),
  ];
}

export function buildEmailText(data: EmailSubmissionData): string {
  return `${data.subject}\n\n${submissionRows(data).map(([label, value]) => `${label}: ${value}`).join('\n')}\n\nSubmitted through aetas.ai. Reply to contact the visitor. The visitor's address has not been verified.`;
}

export function buildEmailHtml(data: EmailSubmissionData): string {
  const rows = submissionRows(data).map(([label, value]) => (
    `<tr><th scope="row" style="text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #ddd">${escapeHtml(label)}</th>`
    + `<td style="padding:10px;white-space:pre-wrap;border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`
  )).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(data.subject)}</title></head><body style="font-family:Arial,sans-serif;color:#18181b;background:#f4f4f5;padding:24px"><div style="max-width:640px;margin:auto;background:#fff;padding:24px"><h1 style="font-size:22px">Aetas Global Innovation</h1><h2 style="font-size:18px">${escapeHtml(data.subject)}</h2><table style="width:100%;border-collapse:collapse">${rows}</table><p>Submitted through aetas.ai. Reply to contact the visitor.</p><p style="font-size:12px;color:#555">The visitor's address has not been verified.</p></div></body></html>`;
}

export async function sendResendEmail(
  configuration: ResendConfiguration,
  data: EmailSubmissionData,
  fetcher: typeof fetch = fetch,
): Promise<DeliveryResult> {
  const { apiKey, senderEmail, recipientEmail } = configuration;
  const validEmail = (value: string) => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
  if (!/^re_[^\s]+$/.test(apiKey)
    || !validEmail(senderEmail) || !validEmail(recipientEmail) || !validEmail(data.values.email ?? '')) {
    return { ok: false, reason: 'config' };
  }
  const focusKey = data.values.intent ? 'intent' : data.values.interest ? 'interest' : '';
  const focus = focusKey ? displayValue(focusKey, data.values[focusKey]) : '';
  const subject = `${data.subject}${focus ? ` — ${focus}` : ''} [${data.reference}]`;
  const content = { ...data, subject };
  try {
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        accept: 'application/json', Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json',
        'Idempotency-Key': `aetas-form/${data.reference}`,
      },
      body: JSON.stringify({
        from: `AGI Website <${senderEmail}>`,
        to: [recipientEmail],
        reply_to: data.values.email,
        subject, html: buildEmailHtml(content), text: buildEmailText(content),
        tags: [{ name: 'source', value: 'aetas-website' }, { name: 'form', value: data.formType }],
      }),
      redirect: 'error',
      signal: AbortSignal.timeout(8_000),
    });
    // Acceptance is not inbox delivery. Do not retry/fail over after a timeout.
    // Only the status code is reported; provider bodies may echo submission data.
    if (response.status !== 200) return { ok: false, reason: 'http', status: response.status };
    let result: { id?: unknown };
    try {
      result = await response.json() as { id?: unknown };
    } catch {
      return { ok: false, reason: 'invalid-response', status: 200 };
    }
    return typeof result.id === 'string' && result.id.trim().length > 0
      ? { ok: true }
      : { ok: false, reason: 'invalid-response', status: 200 };
  } catch (error) {
    return { ok: false, reason: error instanceof DOMException && error.name === 'TimeoutError' ? 'timeout' : 'network' };
  }
}
