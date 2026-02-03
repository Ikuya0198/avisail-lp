// Cookie Consent Banner for GDPR Compliance
(function() {
  'use strict';

  const CONSENT_KEY = 'avisail_cookie_consent';
  const CONSENT_DATE_KEY = 'avisail_cookie_consent_date';
  const CONSENT_EXPIRES_DAYS = 365;

  // Check if consent is already given and still valid
  function hasValidConsent() {
    const consent = localStorage.getItem(CONSENT_KEY);
    const consentDate = localStorage.getItem(CONSENT_DATE_KEY);

    if (!consent || !consentDate) return false;

    const daysElapsed = (Date.now() - parseInt(consentDate)) / (1000 * 60 * 60 * 24);
    return daysElapsed < CONSENT_EXPIRES_DAYS;
  }

  // Save consent
  function saveConsent(accepted) {
    localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'declined');
    localStorage.setItem(CONSENT_DATE_KEY, Date.now().toString());

    if (accepted) {
      enableAnalytics();
    }
  }

  // Enable Google Analytics
  function enableAnalytics() {
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }

  // Get text content based on page language
  function getContent() {
    const isJapanese = document.documentElement.lang === 'ja';

    if (isJapanese) {
      return {
        title: '🍪 Cookieについて',
        text: '当サイトではCookieを使用して、サイトの利用状況を分析し、ユーザー体験を向上させています。「同意する」をクリックすることで、Cookieの使用に同意したものとみなされます。',
        privacyLink: '/legal/privacy-ja.html',
        privacyText: 'プライバシーポリシー',
        acceptBtn: '同意する',
        declineBtn: '拒否する'
      };
    } else {
      return {
        title: '🍪 Cookie Notice',
        text: 'We use cookies to improve your experience and analyze site usage. By clicking "Accept", you consent to our use of cookies.',
        privacyLink: '/legal/privacy-en.html',
        privacyText: 'Privacy Policy',
        acceptBtn: 'Accept',
        declineBtn: 'Decline'
      };
    }
  }

  // Create and show banner
  function showBanner() {
    // Check if banner already exists
    if (document.getElementById('cookie-consent-banner')) return;

    const content = getContent();
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML = `
      <div class="cookie-consent-container">
        <div class="cookie-consent-content">
          <p class="cookie-consent-text">
            <strong>${content.title}</strong><br>
            ${content.text}
            <a href="${content.privacyLink}" target="_blank" rel="noopener noreferrer">${content.privacyText}</a>
          </p>
          <div class="cookie-consent-buttons">
            <button id="cookie-accept" class="cookie-btn cookie-btn-accept">${content.acceptBtn}</button>
            <button id="cookie-decline" class="cookie-btn cookie-btn-decline">${content.declineBtn}</button>
          </div>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #cookie-consent-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(13, 20, 36, 0.98);
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(126, 240, 212, 0.2);
        z-index: 9999;
        animation: slideUp 0.3s ease-out;
      }

      @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }

      .cookie-consent-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .cookie-consent-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        flex-wrap: wrap;
      }

      .cookie-consent-text {
        flex: 1;
        min-width: 300px;
        margin: 0;
        color: #e9f0ff;
        font-size: 0.9rem;
        line-height: 1.6;
      }

      .cookie-consent-text strong {
        font-size: 1rem;
        color: #fff;
      }

      .cookie-consent-text a {
        color: #7ef0d4;
        text-decoration: underline;
        transition: color 0.3s;
      }

      .cookie-consent-text a:hover {
        color: #6aa6ff;
      }

      .cookie-consent-buttons {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .cookie-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s;
        font-family: inherit;
      }

      .cookie-btn-accept {
        background: linear-gradient(135deg, #6aa6ff, #7ef0d4);
        color: #0a0f1a;
      }

      .cookie-btn-accept:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(126, 240, 212, 0.3);
      }

      .cookie-btn-decline {
        background: transparent;
        color: #9fb0cc;
        border: 1px solid rgba(159, 176, 204, 0.3);
      }

      .cookie-btn-decline:hover {
        background: rgba(159, 176, 204, 0.1);
        color: #cfe2ff;
      }

      @media (max-width: 768px) {
        .cookie-consent-content {
          flex-direction: column;
          align-items: stretch;
        }

        .cookie-consent-buttons {
          flex-direction: column;
        }

        .cookie-btn {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    // Add event listeners
    document.getElementById('cookie-accept').addEventListener('click', function() {
      saveConsent(true);
      removeBanner();
    });

    document.getElementById('cookie-decline').addEventListener('click', function() {
      saveConsent(false);
      removeBanner();
    });
  }

  // Remove banner
  function removeBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.style.animation = 'slideDown 0.3s ease-out';
      setTimeout(() => banner.remove(), 300);
    }
  }

  // Add slideDown animation
  const slideDownStyle = document.createElement('style');
  slideDownStyle.textContent = `
    @keyframes slideDown {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(slideDownStyle);

  // Initialize
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    if (!hasValidConsent()) {
      // Show banner after a short delay for better UX
      setTimeout(showBanner, 1000);
    } else if (localStorage.getItem(CONSENT_KEY) === 'accepted') {
      // User previously accepted, enable analytics
      enableAnalytics();
    }
  }

  init();
})();
