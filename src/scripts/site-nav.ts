/**
 * Header navigation behaviour: the Services disclosure menu (desktop) and the
 * mobile sheet. The header is swapped on every ClientRouter navigation, so
 * listeners are bound per page and released through one AbortController.
 */

let controller: AbortController | undefined;
const closers = new Set<() => void>();

const HOVER_OPEN_DELAY = 90;
const HOVER_CLOSE_DELAY = 220;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function initDropdown(root: HTMLElement, signal: AbortSignal) {
  const trigger = root.querySelector<HTMLButtonElement>('[data-nav-trigger]');
  const panel = root.querySelector<HTMLElement>('[data-nav-panel]');
  if (!trigger || !panel) return;

  let openTimer: number | undefined;
  let closeTimer: number | undefined;
  let hoverOpenedAt = 0;

  const isOpen = () => trigger.getAttribute('aria-expanded') === 'true';
  const clearTimers = () => {
    window.clearTimeout(openTimer);
    window.clearTimeout(closeTimer);
  };
  const setOpen = (open: boolean) => {
    clearTimers();
    trigger.setAttribute('aria-expanded', String(open));
    panel.toggleAttribute('data-open', open);
  };
  const columns = () =>
    Array.from(panel.querySelectorAll<HTMLElement>('[data-nav-column]')).map((column) =>
      Array.from(column.querySelectorAll<HTMLAnchorElement>('a[href]')),
    );

  closers.add(() => setOpen(false));

  trigger.addEventListener(
    'click',
    () => {
      // A click right after hover-intent opened the panel should not close it.
      if (isOpen() && performance.now() - hoverOpenedAt < 450) return;
      setOpen(!isOpen());
    },
    { signal },
  );

  trigger.addEventListener(
    'keydown',
    (event) => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      setOpen(true);
      columns()[0]?.[0]?.focus();
    },
    { signal },
  );

  root.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && isOpen()) {
        event.preventDefault();
        setOpen(false);
        trigger.focus();
        return;
      }

      const target = event.target as HTMLElement;
      if (!panel.contains(target)) return;

      const groups = columns();
      const flat = groups.flat();
      const index = flat.indexOf(target as HTMLAnchorElement);
      if (index < 0) return;
      const columnIndex = groups.findIndex((group) => group.includes(target as HTMLAnchorElement));
      const rowIndex = groups[columnIndex].indexOf(target as HTMLAnchorElement);

      let next: HTMLAnchorElement | undefined;
      switch (event.key) {
        case 'ArrowDown':
          next = flat[Math.min(index + 1, flat.length - 1)];
          break;
        case 'ArrowUp':
          if (index === 0) {
            event.preventDefault();
            trigger.focus();
            return;
          }
          next = flat[index - 1];
          break;
        case 'ArrowRight':
        case 'ArrowLeft': {
          const step = event.key === 'ArrowRight' ? 1 : -1;
          const column = groups[(columnIndex + step + groups.length) % groups.length];
          next = column[Math.min(rowIndex, column.length - 1)];
          break;
        }
        case 'Home':
          next = flat[0];
          break;
        case 'End':
          next = flat[flat.length - 1];
          break;
        default:
          return;
      }
      event.preventDefault();
      next?.focus();
    },
    { signal },
  );

  root.addEventListener(
    'focusout',
    (event) => {
      const next = event.relatedTarget as Node | null;
      if (isOpen() && next && !root.contains(next)) setOpen(false);
    },
    { signal },
  );

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (isOpen() && !root.contains(event.target as Node)) setOpen(false);
    },
    { signal },
  );

  root.addEventListener(
    'pointerenter',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      window.clearTimeout(closeTimer);
      if (isOpen()) return;
      openTimer = window.setTimeout(() => {
        setOpen(true);
        hoverOpenedAt = performance.now();
      }, HOVER_OPEN_DELAY);
    },
    { signal },
  );

  root.addEventListener(
    'pointerleave',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      window.clearTimeout(openTimer);
      // Keep the panel open while keyboard focus is inside it.
      if (root.contains(document.activeElement) && document.activeElement !== trigger) return;
      closeTimer = window.setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY);
    },
    { signal },
  );

  panel.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => setOpen(false), { signal });
  });
}

function initMobileNav(signal: AbortSignal) {
  const button = document.getElementById('mobile-menu-btn');
  const sheet = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');
  const closeButton = document.getElementById('mobile-menu-close');
  if (!button || !sheet || !overlay) return;

  const isOpen = () => sheet.hasAttribute('data-open');
  const setOpen = (open: boolean, restoreFocus = true) => {
    if (open === isOpen()) return;
    sheet.toggleAttribute('data-open', open);
    overlay.toggleAttribute('data-open', open);
    button.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('overflow-hidden', open);
    if (open) {
      window.setTimeout(() => closeButton?.focus(), 30);
    } else if (restoreFocus) {
      button.focus();
    }
  };

  closers.add(() => setOpen(false, false));

  button.addEventListener('click', () => setOpen(true), { signal });
  closeButton?.addEventListener('click', () => setOpen(false), { signal });
  overlay.addEventListener('click', () => setOpen(false), { signal });
  sheet.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', () => setOpen(false, false), { signal });
  });

  sheet.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null,
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    { signal },
  );

  sheet.querySelectorAll<HTMLButtonElement>('[data-mobile-accordion]').forEach((toggle) => {
    const region = document.getElementById(toggle.getAttribute('aria-controls') ?? '');
    toggle.addEventListener(
      'click',
      () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        if (region) region.hidden = expanded;
      },
      { signal },
    );
  });

  // Close the sheet if the viewport grows into the desktop layout.
  window.matchMedia('(min-width: 1024px)').addEventListener(
    'change',
    (event) => {
      if (event.matches) setOpen(false, false);
    },
    { signal },
  );
}

export function initSiteNav() {
  controller?.abort();
  closers.clear();
  controller = new AbortController();
  const { signal } = controller;

  document.querySelectorAll<HTMLElement>('[data-nav-dropdown]').forEach((root) => initDropdown(root, signal));
  initMobileNav(signal);
}

export function closeSiteNav() {
  closers.forEach((close) => close());
}
