const requirements = [
  {
    name: 'FORM_CSRF_SECRET',
    valid: (value) => typeof value === 'string' && value.length >= 32,
  },
  {
    name: 'FORM_DELIVERY_URL',
    valid: (value) => {
      if (typeof value !== 'string') return false;

      try {
        const url = new URL(value);
        return url.protocol === 'https:' && !url.username && !url.password;
      } catch {
        return false;
      }
    },
  },
  {
    name: 'FORM_DELIVERY_BEARER_TOKEN',
    valid: (value) => typeof value === 'string' && value.length >= 20,
  },
];

const invalidVariables = requirements
  .filter(({ name, valid }) => !valid(process.env[name]))
  .map(({ name }) => name);

if (invalidVariables.length > 0) {
  console.error(
    `[startup] Missing or invalid required server environment variables: ${invalidVariables.join(', ')}`,
  );
  process.exit(1);
}

await import('../dist/server/entry.mjs');
