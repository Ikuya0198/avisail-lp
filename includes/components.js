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
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    const dir = path.substring(0, path.lastIndexOf('/') + 1);

    let enPage, jaPage;

    // Handle different naming patterns
    if (filename.includes('.ja.html')) {
      // index.ja.html -> index.html
      jaPage = path;
      enPage = path.replace('.ja.html', '.html');
    } else if (filename.includes('vessel-trading-en.html')) {
      // vessel-trading-en.html -> vessel-trading.html
      enPage = path;
      jaPage = path.replace('-en.html', '.html');
    } else if (filename.includes('vessel-trading.html')) {
      // vessel-trading.html -> vessel-trading-en.html
      jaPage = path;
      enPage = path.replace('.html', '-en.html');
    } else if (filename.includes('-en.html')) {
      // /en/about.html -> /ja/about.html
      enPage = path;
      jaPage = path.replace('/en/', '/ja/');
    } else if (dir.includes('/ja/')) {
      // /ja/about.html -> /en/about.html
      jaPage = path;
      enPage = path.replace('/ja/', '/en/');
    } else {
      // Default: assume English, add .ja for Japanese
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

  // Initialize mobile menu
  function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    const body = document.body;

    if (!mobileMenuBtn || !navMenu) return;

    mobileMenuBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = this.classList.contains('active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    function openMobileMenu() {
      mobileMenuBtn.classList.add('active');
      navMenu.classList.add('mobile-menu-open');
      body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      mobileMenuBtn.classList.remove('active');
      navMenu.classList.remove('mobile-menu-open');
      body.style.overflow = '';
      document.querySelectorAll('.menu-item.menu-open, .lang-selector.menu-open').forEach(item => {
        item.classList.remove('menu-open');
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (window.innerWidth <= 980) {
        const isClickInsideMenu = navMenu.contains(e.target);
        const isClickOnMenuBtn = mobileMenuBtn.contains(e.target);
        if (!isClickInsideMenu && !isClickOnMenuBtn && navMenu.classList.contains('mobile-menu-open')) {
          closeMobileMenu();
        }
      }
    });

    // Close menu when clicking nav links
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function () {
        const parentMenuItem = this.closest('.menu-item');
        const isDropdownToggle = parentMenuItem && parentMenuItem.querySelector('.dropdown');
        if (!isDropdownToggle || !this.closest('.menu-item > a')) {
          closeMobileMenu();
        }
      });
    });

    // Toggle dropdowns on mobile
    document.querySelectorAll('.menu-item').forEach(item => {
      const link = item.querySelector(':scope > a');
      if (link && item.querySelector('.dropdown')) {
        link.addEventListener('click', function (e) {
          if (window.innerWidth <= 980) {
            e.preventDefault();
            e.stopPropagation();
            document.querySelectorAll('.menu-item').forEach(otherItem => {
              if (otherItem !== item) otherItem.classList.remove('menu-open');
            });
            item.classList.toggle('menu-open');
          }
        });
      }
    });

    // Toggle language dropdown (Desktop & Mobile)
    const langSelector = document.querySelector('.lang-selector');
    if (langSelector) {
      langSelector.addEventListener('click', function (e) {
        // Prevent default only if clicking the selector itself to toggle
        // If clicking a link inside, let it navigate
        if (!e.target.closest('a')) {
          e.preventDefault();
          e.stopPropagation();
          this.classList.toggle('menu-open');
        }
      });

      // Close on mouse leave for desktop (improves hover feel)
      langSelector.addEventListener('mouseleave', function () {
        if (window.innerWidth > 980) {
          this.classList.remove('menu-open');
        }
      });
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth > 980) {
          closeMobileMenu();
        }
      }, 250);
    });
  }

  // Load shared CSS
  function loadSharedStyles() {
    const basePath = getBasePath();
    const cssUrl = `${basePath}includes/shared-styles.css`;

    // Check if already loaded
    if (document.querySelector(`link[href="${cssUrl}"]`)) return;

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

    // Initialize mobile menu after header is loaded
    initMobileMenu();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
