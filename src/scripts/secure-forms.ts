type SubmissionResponse = {
  ok?: boolean;
  message?: string;
  redirect?: string;
  refreshCsrf?: boolean;
  fieldErrors?: Record<string, string>;
  reference?: string;
};

const csrfEndpoint = '/api/forms/csrf';
const MAX_AUTOMATIC_WAIT_SECONDS = 5;
const unavailableMessage = 'The online form is temporarily unavailable. Please email info@aetas.ai and we will respond directly.';

async function requestCsrfToken() {
  const response = await fetch(csrfEndpoint, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(15_000),
  });
  const body = await response.json() as { ok?: boolean; token?: string };
  if (!response.ok || !body.ok || !body.token) throw new Error('csrf-unavailable');
  return body.token;
}

function setStatus(form: HTMLFormElement, message: string, kind: 'error' | 'info', focus = false) {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  if (!status) return;

  // The element is a persistent polite live region in the markup. Its role is
  // never toggled; errors that need attention move focus to it instead.
  status.textContent = message;
  status.dataset.kind = kind;
  if (focus) status.focus({ preventScroll: false });
}

function retryAfterSeconds(response: Response) {
  const seconds = Number(response.headers.get('retry-after'));
  return Number.isFinite(seconds) && seconds > 0 && seconds <= MAX_AUTOMATIC_WAIT_SECONDS ? seconds : null;
}

function clearErrors(form: HTMLFormElement) {
  form.querySelectorAll<HTMLElement>('[data-field-error]').forEach((error) => {
    error.textContent = '';
    error.hidden = true;
  });

  form.querySelectorAll<HTMLElement>('[aria-invalid="true"]').forEach((field) => {
    field.removeAttribute('aria-invalid');
  });

  const status = form.querySelector<HTMLElement>('[data-form-status]');
  if (status) {
    status.textContent = '';
    delete status.dataset.kind;
  }
}

function showFieldErrors(form: HTMLFormElement, errors: Record<string, string>) {
  let firstInvalidField: HTMLElement | null = null;

  for (const [name, message] of Object.entries(errors)) {
    const field = form.elements.namedItem(name);
    if (!(field instanceof HTMLElement)) continue;

    field.setAttribute('aria-invalid', 'true');
    const error = form.querySelector<HTMLElement>(`[data-field-error="${CSS.escape(name)}"]`);
    if (error) {
      error.textContent = message;
      error.hidden = false;
    }
    firstInvalidField ??= field;
  }

  firstInvalidField?.focus({ preventScroll: false });
}

async function initializeSecureForm(form: HTMLFormElement) {
  if (form.dataset.secureFormReady === 'true') return;
  form.dataset.secureFormReady = 'true';

  const csrfInput = form.elements.namedItem('csrf-token');
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!(csrfInput instanceof HTMLInputElement) || !submitButton) return;

  const submitLabel = submitButton.querySelector<HTMLElement>('[data-submit-label]');
  const submitPending = submitButton.querySelector<HTMLElement>('[data-submit-pending]');
  const setSubmitting = (pending: boolean) => {
    submitButton.disabled = pending;
    if (submitLabel) submitLabel.hidden = pending;
    if (submitPending) submitPending.hidden = !pending;
    if (pending) {
      submitButton.setAttribute('aria-busy', 'true');
      form.setAttribute('aria-busy', 'true');
    } else {
      submitButton.removeAttribute('aria-busy');
      form.removeAttribute('aria-busy');
    }
  };

  let tokenRequest: Promise<string> | null = null;
  async function initializeToken() {
    tokenRequest ??= requestCsrfToken();
    try {
      csrfInput.value = await tokenRequest;
    } finally {
      tokenRequest = null;
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton.disabled) return;

    clearErrors(form);
    setSubmitting(true);
    setStatus(form, 'Sending your request…', 'info');

    let navigating = false;
    try {
      if (!csrfInput.value) {
        try {
          await initializeToken();
        } catch {
          setStatus(form, unavailableMessage, 'error', true);
          return;
        }
      }

      const body = new URLSearchParams();
      new FormData(form).forEach((value, key) => {
        if (typeof value === 'string') body.append(key, value);
      });

      const send = () => fetch(form.action, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body,
        signal: AbortSignal.timeout(15_000),
      });

      let response = await send();
      // A very quick submit is asked to wait briefly; do that once automatically
      // instead of making the visitor press the button again.
      const wait = response.status === 400 ? retryAfterSeconds(response) : null;
      if (wait) {
        await new Promise((resolve) => setTimeout(resolve, wait * 1_000));
        response = await send();
      }

      let result: SubmissionResponse = {};
      try {
        result = await response.json() as SubmissionResponse;
      } catch {
        // A generic message below avoids exposing an unexpected server response.
      }

      if (response.ok && result.ok && result.redirect) {
        window.location.assign(result.redirect);
        navigating = true;
        return;
      }

      if (result.fieldErrors) showFieldErrors(form, result.fieldErrors);
      const message = result.message || 'We could not send your request. Please try again later or email info@aetas.ai.';
      setStatus(
        form,
        result.reference ? `${message} Reference: ${result.reference}.` : message,
        'error',
        !result.fieldErrors || Object.keys(result.fieldErrors).length === 0,
      );

      if (result.refreshCsrf) {
        csrfInput.value = '';
        try {
          csrfInput.value = await requestCsrfToken();
        } catch {
          // The next submission retries token initialization.
        }
      }
    } catch {
      setStatus(
        form,
        'We could not send your request. Check your connection and try again.',
        'error',
        true,
      );
    } finally {
      if (!navigating) setSubmitting(false);
    }
  });

  // Attach the handler before fetching a session so a quick submit never falls
  // through to a native POST, and share the token request with that submission.
  try {
    await initializeToken();
  } catch {
    // Delivery is disabled or the backend is not deployed. Explain calmly
    // without an alert; a submit attempt retries once and then says the same.
    setStatus(form, unavailableMessage, 'info');
  }
}

function initializeSecureForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-secure-form]').forEach((form) => {
    void initializeSecureForm(form);
  });
}

window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  document.querySelectorAll<HTMLFormElement>('form[data-secure-form]').forEach((form) => {
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (button) {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      const label = button.querySelector<HTMLElement>('[data-submit-label]');
      const pending = button.querySelector<HTMLElement>('[data-submit-pending]');
      if (label) label.hidden = false;
      if (pending) pending.hidden = true;
    }
    form.removeAttribute('aria-busy');
    clearErrors(form);
  });
});

document.addEventListener('astro:page-load', initializeSecureForms);
initializeSecureForms();
