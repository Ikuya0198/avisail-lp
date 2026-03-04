/**
 * Avisail Shared Components Loader
 * Loads header and footer dynamically based on page language
 */

(function () {
  'use strict';

  // Detect language from HTML lang attribute or filename
  function detectLanguage() {
    const htmlLang = document.documentElement.lang;
    if (htmlLang === 'ja') return 'ja';
    if (htmlLang === 'en') return 'en';

    // Fallback: check filename
    const path = window.location.pathname;
    if (path.includes('.ja.html') || path.includes('/ja/')) return 'ja';
    return 'en';
  }

  // Calculate base path based on current page depth
  function getBasePath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;

    // Handle root level
    if (depth <= 0 || path.endsWith('/') || path.split('/').filter(p => p && !p.includes('.')).length === 0) {
      return './';
    }

    // Count directory depth
    const parts = path.split('/').filter(p => p);
    const dirDepth = parts.length - 1; // Subtract filename

    if (dirDepth <= 0) return './';
    if (dirDepth === 1) return '../';
    if (dirDepth === 2) return '../../';
    if (dirDepth === 3) return '../../../';

    return '../'.repeat(dirDepth);
  }

  // Get language switcher URLs
  function getLanguageUrls() {
    let path = window.location.pathname;

    // Handle root path or directory without filename
    if (path === '/' || path.endsWith('/')) {
      path = path + 'index.html';
    }

    const filename = path.split('/').pop();
    const dir = path.substring(0, path.lastIndexOf('/') + 1);

    let enPage, jaPage;

    // Handle different naming patterns
    if (filename.includes('.ja.html')) {
      // index.ja.html -> index.html
      jaPage = path;
      enPage = path.replace('.ja.html', '.html');
    } else if (filename.includes('-ja.html')) {
      // security-ja.html -> security-en.html
      jaPage = path;
      enPage = path.replace('-ja.html', '-en.html');
    } else if (filename.includes('vessel-trading-en.html')) {
      // vessel-trading-en.html -> vessel-trading.html
      enPage = path;
      jaPage = path.replace('-en.html', '.html');
    } else if (filename.includes('vessel-trading.html')) {
      // vessel-trading.html -> vessel-trading-en.html
      jaPage = path;
      enPage = path.replace('.html', '-en.html');
    } else if (filename.includes('-en.html')) {
      // security-en.html -> security-ja.html
      enPage = path;
      jaPage = path.replace('-en.html', '-ja.html');
    } else if (dir.includes('/ja/')) {
      // /ja/about.html -> /en/about.html
      jaPage = path;
      enPage = path.replace('/ja/', '/en/');
    } else if (dir.includes('/en/')) {
      // /en/about.html -> /ja/about.html
      enPage = path;
      jaPage = path.replace('/en/', '/ja/');
    } else if (!filename.includes('-en') && !filename.includes('-ja') && !filename.includes('.ja') && filename !== 'index.html') {
      // Generic default pages like adcs.html, nexus.html -> adcs-en.html, adcs-ja.html
      // But exclude index.html which uses .ja.html pattern
      enPage = path.replace('.html', '-en.html');
      jaPage = path.replace('.html', '-ja.html');
    } else {
      // Default: index.html and similar -> index.html, index.ja.html
      enPage = path;
      jaPage = path.replace('.html', '.ja.html');
    }

    return { enPage, jaPage };
  }

  // Load component HTML
  async function loadComponent(type, lang) {
    const basePath = getBasePath();
    const url = `${basePath}includes/${type}-${lang}.html`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load ${url}`);
      let html = await response.text();

      // Replace placeholders
      const { enPage, jaPage } = getLanguageUrls();
      html = html.replace(/\{BASE\}/g, basePath);
      html = html.replace(/\{EN_PAGE\}/g, enPage);
      html = html.replace(/\{JA_PAGE\}/g, jaPage);

      return html;
    } catch (error) {
      console.error(`Error loading ${type}:`, error);
      return '';
    }
  }

  // Mobile menu — event delegation (works regardless of when header is injected)
  function initMobileMenu() {
    const body = document.body;

    function openMobileMenu() {
      const btn = document.querySelector('header .mobile-menu-btn');
      const navMenu = document.querySelector('header nav ul');
      if (!btn || !navMenu) return;
      btn.classList.add('active');
      btn.setAttribute('aria-expanded', 'true');
      navMenu.classList.add('mobile-menu-open');
      const scrollY = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.dataset.scrollY = scrollY;
    }

    function closeMobileMenu() {
      const btn = document.querySelector('header .mobile-menu-btn');
      const navMenu = document.querySelector('header nav ul');
      if (btn) { btn.classList.remove('active'); btn.setAttribute('aria-expanded', 'false'); }
      if (navMenu) navMenu.classList.remove('mobile-menu-open');
      const scrollY = parseInt(body.dataset.scrollY || '0');
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      body.style.overflow = '';
      delete body.dataset.scrollY;
      window.scrollTo(0, scrollY);
      document.querySelectorAll('header .menu-item.menu-open, header .lang-selector.menu-open')
        .forEach(el => el.classList.remove('menu-open'));
    }

    // Single delegated listener — handles all header interactions
    document.addEventListener('click', function (e) {
      // 1. Hamburger button
      if (e.target.closest('header .mobile-menu-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const btn = document.querySelector('header .mobile-menu-btn');
        btn && btn.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
        return;
      }

      // 2. Mobile: dropdown toggle
      if (window.innerWidth <= 980) {
        const topLink = e.target.closest('header .menu-item > a');
        if (topLink) {
          const item = topLink.closest('.menu-item');
          if (item && item.querySelector('.dropdown')) {
            e.preventDefault();
            e.stopPropagation();
            document.querySelectorAll('header .menu-item')
              .forEach(i => { if (i !== item) i.classList.remove('menu-open'); });
            item.classList.toggle('menu-open');
            return;
          }
        }
      }

      // 3. Mobile: close menu when tapping a nav link
      if (window.innerWidth <= 980) {
        const navLink = e.target.closest('header nav ul a');
        if (navLink) {
          const item = navLink.closest('.menu-item');
          if (!(item && item.querySelector('.dropdown') && navLink.matches('.menu-item > a'))) {
            closeMobileMenu();
          }
          return;
        }
      }

      // 4. Language selector toggle
      if (e.target.closest('header .lang-selector') && !e.target.closest('header .lang-selector a')) {
        e.preventDefault();
        e.stopPropagation();
        const lang = document.querySelector('header .lang-selector');
        if (lang) lang.classList.toggle('menu-open');
        return;
      }

      // 5. Close menu when tapping outside header (mobile)
      if (window.innerWidth <= 980) {
        const navMenu = document.querySelector('header nav ul');
        if (navMenu && navMenu.classList.contains('mobile-menu-open') && !e.target.closest('header')) {
          closeMobileMenu();
        }
      }
    });

    // Desktop: close lang dropdown on mouse leave
    document.addEventListener('mouseover', function (e) {
      if (window.innerWidth > 980) {
        const lang = document.querySelector('header .lang-selector');
        if (lang && lang.classList.contains('menu-open') && !lang.contains(e.target)) {
          lang.classList.remove('menu-open');
        }
      }
    });

    // Window resize
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth > 980) closeMobileMenu();
      }, 250);
    });
  }

  // Load shared CSS
  function loadSharedStyles() {
    const basePath = getBasePath();
    const cssUrl = `${basePath}includes/shared-styles.css?v=20260304c`;

    // Check if already loaded
    if (document.querySelector('link[href*="shared-styles.css"]')) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    document.head.appendChild(link);
  }

  // Main initialization
  async function init() {
    // Load shared CSS first
    loadSharedStyles();

    const lang = detectLanguage();

    // Load header
    const headerContainer = document.getElementById('site-header');
    if (headerContainer) {
      const headerHtml = await loadComponent('header', lang);
      headerContainer.innerHTML = headerHtml;
    }

    // Load footer
    const footerContainer = document.getElementById('site-footer');
    if (footerContainer) {
      const footerHtml = await loadComponent('footer', lang);
      footerContainer.innerHTML = footerHtml;
    }

    // Initialize interactions (delegation-based, timing-independent)
    initMobileMenu();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
