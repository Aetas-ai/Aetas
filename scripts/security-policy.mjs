export const CANONICAL_ORIGIN = 'https://aetas.ai';

export const PERMISSIONS_POLICY = [
  'accelerometer=()',
  'autoplay=(self)',
  'camera=()',
  'display-capture=()',
  'encrypted-media=()',
  'fullscreen=(self)',
  'geolocation=()',
  'gyroscope=()',
  'magnetometer=()',
  'microphone=()',
  'midi=()',
  'payment=()',
  'picture-in-picture=(self)',
  'publickey-credentials-get=()',
  'screen-wake-lock=()',
  'usb=()',
  'web-share=(self)',
  'xr-spatial-tracking=()',
].join(', ');

export function createContentSecurityPolicy(scriptHashes, styleHashes) {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src 'self' ${scriptHashes.join(' ')}`.trim(),
    "script-src-attr 'none'",
    `style-src 'self' https://fonts.googleapis.com ${styleHashes.join(' ')}`.trim(),
    "style-src-attr 'unsafe-inline'",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "worker-src 'self'",
    "media-src 'self'",
    "frame-src 'none'",
    "manifest-src 'self'",
    'upgrade-insecure-requests',
  ];

  return directives.join('; ');
}

export function createSecurityHeaders(contentSecurityPolicy) {
  return {
    'Content-Security-Policy': contentSecurityPolicy,
    'Strict-Transport-Security': 'max-age=31536000',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': PERMISSIONS_POLICY,
    'X-Frame-Options': 'DENY',
  };
}
