declare namespace App {
  interface Locals {
    /** Set by src/middleware.ts for /api requests; matches the X-Request-ID header. */
    requestId?: string;
  }
}
