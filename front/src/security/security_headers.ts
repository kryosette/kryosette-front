export const SecurityHeaders = {
    'Content-Security-Policy': `
    default-src 'none';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data:;
    connect-src 'self';
    font-src 'self';
    object-src 'none';
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
  `.replace(/\s+/g, ' ').trim(),

    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': `
    geolocation=(),
    camera=(),
    microphone=(),
    payment=(),
    interest-cohort=()
  `.replace(/\s+/g, ' ').trim()
};