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

  // Initialize mobile menu
  function initMobileMenu() {
    console.log('[MobileMenu] Initializing...');
    console.log('[MobileMenu] Window width:', window.innerWidth);

    const mobileMenuBtn = document.querySelector('header .mobile-menu-btn');
    const navMenu = document.querySelector('header nav ul');
    const body = document.body;

    console.log('[MobileMenu] Elements found:', {
      mobileMenuBtn: !!mobileMenuBtn,
      navMenu: !!navMenu,
      mobileMenuBtnElement: mobileMenuBtn,
      navMenuElement: navMenu
    });

    if (!mobileMenuBtn || !navMenu) {
      console.error('[MobileMenu] ERROR: Mobile menu elements not found!');
      return;
    }

    console.log('[MobileMenu] Initialized successfully!');

    mobileMenuBtn.addEventListener('click', function (e) {
      console.log('[MobileMenu] Button clicked!');
      e.preventDefault();
      e.stopPropagation();

      const isOpen = this.classList.contains('active');
      console.log('[MobileMenu] Menu is currently:', isOpen ? 'open' : 'closed');

      if (isOpen) {
        console.log('[MobileMenu] Closing menu...');
        closeMobileMenu();
      } else {
        console.log('[MobileMenu] Opening menu...');
        openMobileMenu();
      }
    });

    function openMobileMenu() {
      console.log('[MobileMenu] Adding classes to open menu');
      mobileMenuBtn.classList.add('active');
      navMenu.classList.add('mobile-menu-open');
      body.style.overflow = 'hidden';
      console.log('[MobileMenu] Menu opened. Classes:', {
        btnClasses: mobileMenuBtn.className,
        navClasses: navMenu.className
      });
    }

    function closeMobileMenu() {
      console.log('[MobileMenu] Removing classes to close menu');
      mobileMenuBtn.classList.remove('active');
      navMenu.classList.remove('mobile-menu-open');
      body.style.overflow = '';
      document.querySelectorAll('header .menu-item.menu-open, header .lang-selector.menu-open').forEach(item => {
        item.classList.remove('menu-open');
      });
      console.log('[MobileMenu] Menu closed');
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
    document.querySelectorAll('header .menu-item').forEach(item => {
      const link = item.querySelector(':scope > a');
      if (link && item.querySelector('.dropdown')) {
        link.addEventListener('click', function (e) {
          if (window.innerWidth <= 980) {
            e.preventDefault();
            e.stopPropagation();
            document.querySelectorAll('header .menu-item').forEach(otherItem => {
              if (otherItem !== item) otherItem.classList.remove('menu-open');
            });
            item.classList.toggle('menu-open');
          }
        });
      }
    });

    // Toggle language dropdown (Desktop & Mobile)
    const langSelector = document.querySelector('header .lang-selector');
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

    // Initialize mobile menu after header is loaded and DOM is updated
    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      initMobileMenu();
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
