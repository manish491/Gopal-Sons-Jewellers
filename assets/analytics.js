/* Consent-gated Google Analytics 4 — Gopal Sons Jewellers
   To switch on: put your GA4 Measurement ID below (looks like G-ABC123XYZ9).
   Nothing loads until the visitor presses "Accept all" in the cookie banner. */
(function () {
  var GA_ID = ''; // <-- paste your GA4 Measurement ID here
  var loaded = false;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function start() {
    if (loaded || !/^G-[A-Z0-9]{6,}$/.test(GA_ID)) return;
    loaded = true;
    window['ga-disable-' + GA_ID] = false;
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
  }
  function onConsent(st) {
    if (st && st.thirdParty) start();
    else if (GA_ID) window['ga-disable-' + GA_ID] = true;
  }
  if (window.GSJConsent) { GSJConsent.onChange(onConsent); }

  // Track the one thing that matters: people contacting the shop
  document.addEventListener('click', function (e) {
    if (!loaded) return;
    var a = e.target.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href') || '', type = '';
    if (h.indexOf('wa.me') > -1) type = 'whatsapp';
    else if (h.indexOf('tel:') === 0) type = 'call';
    else if (h.indexOf('maps.app.goo.gl') > -1) type = 'directions';
    if (type) gtag('event', 'cta_click', { cta_type: type, cta_id: a.getAttribute('data-cta') || '' });
  });
  document.addEventListener('gsj:lead', function (e) {
    if (loaded) gtag('event', 'generate_lead', { interest: (e.detail && e.detail.interest) || '' });
  });
})();
