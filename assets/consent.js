/* Cookie / third-party content consent — Gopal Sons Jewellers
   - Essential: always on (the choice itself is remembered in this browser only, via localStorage).
   - Third-party content (Google Maps embed, analytics): loads only after "Accept all".
   - Hooks for later: GSJConsent.get().thirdParty, GSJConsent.onChange(fn), GSJConsent.open()
   If you add analytics later, load it only when GSJConsent.get().thirdParty is true. */
(function () {
  var KEY = 'gsj-consent-v1', state = null, listeners = [], banner = null, memory = null;

  function read() {
    try { var raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) {}
    return memory;
  }
  function write(v) {
    memory = v;
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
  }
  function set(thirdParty) {
    state = { thirdParty: !!thirdParty, ts: Date.now() };
    write(state);
    hide();
    listeners.forEach(function (fn) { try { fn(state); } catch (e) {} });
  }
  function get() { return state || { thirdParty: false, ts: 0 }; }

  function build() {
    if (banner) return banner;
    banner = document.createElement('div');
    banner.className = 'gsj-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'gsj-consent-h');
    banner.setAttribute('aria-describedby', 'gsj-consent-p');
    banner.innerHTML =
      '<h2 id="gsj-consent-h">Your privacy</h2>' +
      '<p id="gsj-consent-p">We use only what this site needs to work and to remember this choice. ' +
      'With your permission we also load Google Maps and anonymous visitor statistics, which may set their own cookies. ' +
      'We do not use advertising cookies. Read our <a href="privacy.html">Privacy Policy</a>.</p>' +
      '<div class="row"><button type="button" data-a="essential">Essential only</button>' +
      '<button type="button" data-a="all">Accept all</button></div>';
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-a]'); if (!b) return;
      set(b.getAttribute('data-a') === 'all');
    });
    document.body.appendChild(banner);
    return banner;
  }
  function show() {
    build();
    requestAnimationFrame(function () { banner.classList.add('show'); });
  }
  function hide() {
    if (!banner) return;
    banner.classList.remove('show');
    var b = banner; setTimeout(function () { if (b && !b.classList.contains('show') && b.parentNode) { b.parentNode.removeChild(b); if (banner === b) banner = null; } }, 600);
  }

  window.GSJConsent = {
    get: get,
    set: set,
    open: show,
    onChange: function (fn) { listeners.push(fn); }
  };

  function init() {
    state = read();
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-cookie-settings]');
      if (t) { e.preventDefault(); show(); }
    });
    if (!state) {
      // wait for the intro loader on the home page so the banner is not hidden behind it
      var delay = document.getElementById('loader') ? 3500 : 600;
      setTimeout(function () { if (!state) show(); }, delay);
    } else {
      listeners.forEach(function (fn) { try { fn(state); } catch (e) {} });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
