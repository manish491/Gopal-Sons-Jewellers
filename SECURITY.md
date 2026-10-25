# Security review: Gopal Sons Jewellers

Reviewed 25 Oct 2026. The site is static HTML/CSS/JS: no backend, database, accounts, API routes or npm packages.

| Area | Result |
|---|---|
| Dependency audit | No package.json or node_modules. Runtime libraries load from jsDelivr, pinned: GSAP 3.12.5, Lenis 1.1.13, three.js 0.169.0. Not checked against a vulnerability database (offline test environment). Run `npm audit` / check the advisories for these versions, and update when convenient. |
| API security / auth / CSRF | Not applicable: no API routes, logins or state-changing server endpoints. |
| Secrets | None in the code. No keys, tokens or passwords. The GA4 ID (when you add it) is public by design. |
| Rate limiting | The booking form only opens WhatsApp, so it has no server to overload. In-browser cooldown (20 s), honeypot and speed check are included. Real rate limiting must be at the host: Vercel Firewall rate-limit rule, Cloudflare WAF rate limiting, or similar. Enable one for the whole site (e.g. 100 requests/min per IP). |
| Security headers | HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP in vercel.json, _headers and .htaccess. |
| XSS / injection | No user input is rendered as HTML. Form values are stripped of control characters and `<>`, validated, then URL-encoded into the WhatsApp link. The only innerHTML uses are fixed strings. No eval, document.write or inline event handlers. CSP still needs `unsafe-inline` for scripts because the page uses inline scripts. Moving them to files would allow a stricter CSP. |
| External links | All `target="_blank"` links use `rel="noopener"`. |
| Debug code | Removed the one console.error. No test endpoints, TODOs or credentials found. |
| Known gap | CDN scripts have no Subresource Integrity hashes (could not fetch them here). Self-hosting the three libraries in /assets is the cleanest fix. |
