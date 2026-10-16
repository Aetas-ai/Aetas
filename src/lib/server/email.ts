import {
  FORM_DELIVERY_ENABLED,
  RESEND_API_KEY,
  FORM_SENDER_EMAIL,
  CONTACT_RECIPIENT_EMAIL,
  FORM_CSRF_SECRET,
  FORM_DELIVERY_URL,
  FORM_DELIVERY_BEARER_TOKEN,
  BREVO_API_KEY,
  BREVO_SENDER_EMAIL,
} from 'astro:env/server';
import { formDeliveryEnabled, invalidEnvironmentVariables } from '../../../scripts/server-runtime.mjs';
import { sendResendEmail, type DeliveryResult, type EmailSubmissionData } from './email-delivery';

export function formDeliveryChannel(): 'resend' | 'webhook' | null {
  if (!formDeliveryEnabled(FORM_DELIVERY_ENABLED)) return null;
  // Astro dev/preview bypass npm start, so validate here as well.
  if (invalidEnvironmentVariables({
    BREVO_API_KEY,
    BREVO_SENDER_EMAIL,
    FORM_CSRF_SECRET,
    FORM_DELIVERY_ENABLED,
    RESEND_API_KEY,
    FORM_SENDER_EMAIL,
    CONTACT_RECIPIENT_EMAIL,
    FORM_DELIVERY_URL,
    FORM_DELIVERY_BEARER_TOKEN,
  }).length > 0) return null;

  if (RESEND_API_KEY?.trim()) return 'resend';
  return FORM_DELIVERY_URL && FORM_DELIVERY_BEARER_TOKEN ? 'webhook' : null;
}

export async function sendFormEmail(data: EmailSubmissionData): Promise<DeliveryResult> {
  if (formDeliveryChannel() !== 'resend') return { ok: false, reason: 'config' };

  return sendResendEmail({
    apiKey: RESEND_API_KEY ?? '',
    senderEmail: FORM_SENDER_EMAIL ?? '',
    recipientEmail: CONTACT_RECIPIENT_EMAIL ?? '',
  }, data);
}
