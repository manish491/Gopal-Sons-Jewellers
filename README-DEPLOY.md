# Gopal Sons Jewellers: deploy notes

1. **Set your domain (required once).** Canonical links, social tags, sitemap and robots.txt use the placeholder `YOUR-DOMAIN.COM`.
   Run `./set-domain.sh www.yourdomain.com` (or find-and-replace `YOUR-DOMAIN.COM` in index.html, privacy.html, terms.html, sitemap.xml, robots.txt).
2. **HTTPS + security headers.** Use the file for your host and ignore the others:
   - Vercel: `vercel.json` (HTTPS is automatic; this adds HSTS, CSP and the other headers)
   - Netlify / Cloudflare Pages: `_headers` (and turn on "Force HTTPS" in the dashboard)
   - Apache / Hostinger / cPanel: `.htaccess` (includes the 301 redirect to HTTPS)
   A small in-page script also redirects http to https as a fallback.
3. **Secrets.** There are none in the front end: the site is static, has no API keys, tokens or backend.
   Never add keys to index.html. If you add a form service, email API or analytics later, keep private keys on a server or serverless function.
4. **Cookie banner.** assets/consent.js remembers the choice in the browser. The Google Maps embed loads only after "Accept all".
   If you add analytics later, load it only when `GSJConsent.get().thirdParty` is true.
5. After going live, submit `https://yourdomain/sitemap.xml` in Google Search Console and test the share image in WhatsApp.
6. **Analytics.** Open `assets/analytics.js` and paste your GA4 Measurement ID (G-XXXXXXXXXX) into `GA_ID`. It loads only after "Accept all", anonymises IPs, and records taps on WhatsApp, call and directions buttons plus booking-form submissions.
7. **404 page.** `404.html` is served automatically on Vercel and Netlify; `.htaccess` sets it for Apache.
8. **Form protection.** The form only opens WhatsApp, so there is no server to spam. It has a honeypot field, a too-fast check and a 20-second cooldown. If you later add a server-side form, add reCAPTCHA or Cloudflare Turnstile.
9. **Google Search Console.** Add your domain at search.google.com/search-console, choose "HTML tag" verification, and paste the `<meta name="google-site-verification" ...>` tag into the `<head>` of index.html. Then submit `/sitemap.xml`. Create a free Google Business Profile with the same name, address and phone as in the site's footer.
10. **Caching.** Images are cached for 30 days (file names are not versioned, so a year would be risky). To go longer, rename an image whenever you replace it.
11. **Preview links** (vercel.app, netlify.app, pages.dev, localhost) tell search engines not to index them automatically.
