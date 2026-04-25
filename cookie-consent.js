/**
 * Jardin Passion — Bandeau de consentement cookies (RGPD)
 * Gère le consentement Google AdSense conformément au RGPD
 */
(function () {
  'use strict';

  const CONSENT_KEY = 'jp_cookie_consent';
  const CONSENT_DATE_KEY = 'jp_cookie_consent_date';
  const CONSENT_EXPIRY_DAYS = 180; // 6 mois

  /* ─── Injection du CSS ─────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    #cookie-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 99999;
      background: #fff;
      border-top: 3px solid #7cb342;
      box-shadow: 0 -4px 24px rgba(0,0,0,.14);
      animation: slideUp .35s cubic-bezier(.4,0,.2,1) forwards;
    }
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes slideDown {
      from { transform: translateY(0);    opacity: 1; }
      to   { transform: translateY(100%); opacity: 0; }
    }
    .cookie-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }
    .cookie-icon { font-size: 2rem; flex-shrink: 0; }
    .cookie-text { flex: 1; min-width: 200px; }
    .cookie-text strong {
      display: block;
      color: #1a5e1a;
      font-size: 1rem;
      margin-bottom: 4px;
      font-family: 'Playfair Display', serif;
    }
    .cookie-text p {
      color: #555;
      font-size: .875rem;
      line-height: 1.5;
      margin: 0;
    }
    .cookie-text a {
      color: #7cb342;
      text-decoration: underline;
      font-size: .875rem;
    }
    .cookie-actions {
      display: flex;
      gap: 12px;
      flex-shrink: 0;
      align-items: center;
    }
    .cookie-btn {
      padding: 10px 22px;
      border-radius: 8px;
      border: 2px solid transparent;
      font-size: .875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all .2s;
      font-family: 'Inter', sans-serif;
      white-space: nowrap;
    }
    .cookie-btn-refuse {
      background: #fff;
      border-color: #ccc;
      color: #555;
    }
    .cookie-btn-refuse:hover { border-color: #999; color: #333; }
    .cookie-btn-accept {
      background: linear-gradient(135deg, #1a5e1a, #2d7a2d);
      color: #fff;
    }
    .cookie-btn-accept:hover {
      background: linear-gradient(135deg, #2d7a2d, #3d8a3d);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(26,94,26,.25);
    }
    .cookie-btn-customize {
      background: none;
      border: none;
      color: #777;
      font-size: .8rem;
      cursor: pointer;
      text-decoration: underline;
      padding: 4px 0;
      font-family: 'Inter', sans-serif;
    }
    @media (max-width: 600px) {
      .cookie-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
      .cookie-actions { width: 100%; justify-content: space-between; }
    }
  `;
  document.head.appendChild(style);

  /* ─── Utilitaires ──────────────────────────────────────────── */
  function getConsent() {
    try {
      const val = localStorage.getItem(CONSENT_KEY);
      const date = localStorage.getItem(CONSENT_DATE_KEY);
      if (!val || !date) return null;
      // Vérifier l'expiration
      const ageMs = Date.now() - parseInt(date, 10);
      if (ageMs > CONSENT_EXPIRY_DAYS * 24 * 3600 * 1000) {
        localStorage.removeItem(CONSENT_KEY);
        localStorage.removeItem(CONSENT_DATE_KEY);
        return null;
      }
      return val;
    } catch (e) { return null; }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
      localStorage.setItem(CONSENT_DATE_KEY, Date.now().toString());
    } catch (e) { /* silencieux si localStorage indisponible */ }
  }

  /* ─── Gestion AdSense ──────────────────────────────────────── */
  function applyNonPersonalizedAds() {
    // Signaler à AdSense de ne pas utiliser de publicités personnalisées
    window['adsbygoogle'] = window['adsbygoogle'] || [];
    // eslint-disable-next-line no-undef
    (window['adsbygoogle']).requestNonPersonalizedAds = 1;
  }

  /* ─── Affichage du bandeau ─────────────────────────────────── */
  function showBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consentement aux cookies');
    banner.innerHTML = `
      <div class="cookie-inner">
        <div class="cookie-icon">🍪</div>
        <div class="cookie-text">
          <strong>Ce site utilise des cookies</strong>
          <p>
            Nous utilisons des cookies et des technologies similaires pour afficher des publicités
            (Google AdSense), analyser le trafic et améliorer votre expérience. Vous pouvez
            accepter tous les cookies ou choisir les cookies non essentiels.
            <a href="mentions-legales.html#cookies">En savoir plus</a>
          </p>
        </div>
        <div class="cookie-actions">
          <button class="cookie-btn cookie-btn-refuse" id="cookieBtnRefuse">Refuser</button>
          <button class="cookie-btn cookie-btn-accept" id="cookieBtnAccept">Tout accepter</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('cookieBtnAccept').addEventListener('click', function () {
      saveConsent('accepted');
      hideBanner();
    });

    document.getElementById('cookieBtnRefuse').addEventListener('click', function () {
      saveConsent('refused');
      applyNonPersonalizedAds();
      hideBanner();
    });
  }

  function hideBanner() {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.style.animation = 'slideDown .3s cubic-bezier(.4,0,.2,1) forwards';
    setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 320);
  }

  /* ─── Initialisation ───────────────────────────────────────── */
  const consent = getConsent();

  // Appliquer le mode non-personnalisé si refus précédent
  if (consent === 'refused') {
    applyNonPersonalizedAds();
  }

  // Afficher le bandeau si aucun choix enregistré
  if (!consent) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      // DOMContentLoaded déjà passé
      setTimeout(showBanner, 200);
    }
  }

})();
