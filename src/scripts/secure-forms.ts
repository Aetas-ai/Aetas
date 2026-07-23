type SubmissionResponse = {
  ok?: boolean;
  message?: string;
  redirect?: string;
  refreshCsrf?: boolean;
  fieldErrors?: Record<string, string>;
};

const csrfEndpoint = '/api/forms/csrf';

async function requestCsrfToken() {
  const response = await fetch(csrfEndpoint, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });
  const body = await response.json() as { ok?: boolean; token?: string };
  if (!response.ok || !body.ok || !body.token) throw new Error('csrf-unavailable');
  return body.token;
}

function setStatus(form: HTMLFormElement, message: string, kind: 'error' | 'info', focus = false) {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  if (!status) return;

  status.textContent = message;
  status.hidden = false;
  status.dataset.kind = kind;
  status.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  if (focus) status.focus({ preventScroll: false });
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
    status.hidden = true;
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

  try {
    csrfInput.value = await requestCsrfToken();
  } catch {
    setStatus(
      form,
      'The secure form could not be initialized. Refresh the page or email info@aetasglobal.com.',
      'error',
    );
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitButton.disabled) return;

    clearErrors(form);
    if (!csrfInput.value) {
      try {
        csrfInput.value = await requestCsrfToken();
      } catch {
        setStatus(
          form,
          'The secure form could not be initialized. Refresh the page or email info@aetasglobal.com.',
          'error',
          true,
        );
        return;
      }
    }

    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    form.setAttribute('aria-busy', 'true');
    setStatus(form, 'Sending your request…', 'info');

    try {
      const body = new URLSearchParams();
      new FormData(form).forEach((value, key) => {
        if (typeof value === 'string') body.append(key, value);
      });

      const response = await fetch(form.action, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body,
      });

      let result: SubmissionResponse = {};
      try {
        result = await response.json() as SubmissionResponse;
      } catch {
        // A generic message below avoids exposing an unexpected server response.
      }

      if (response.ok && result.ok && result.redirect) {
        window.location.assign(result.redirect);
        return;
      }

      if (result.fieldErrors) showFieldErrors(form, result.fieldErrors);
      setStatus(
        form,
        result.message || 'We could not send your request. Please try again later or email info@aetasglobal.com.',
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
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
      form.removeAttribute('aria-busy');
    }
  });
}

function initializeSecureForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-secure-form]').forEach((form) => {
    void initializeSecureForm(form);
  });
}

document.addEventListener('astro:page-load', initializeSecureForms);
initializeSecureForms();
