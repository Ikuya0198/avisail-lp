/**
 * scroll-nav.js — Avisail LP 共通スクロールアニメーション
 *
 * 機能:
 *   1. スクロール進捗バー（上部グラデーションライン）
 *   2. サイドナビ 目次型（右端・常時表示・アクティブ強調）
 *   3. セクション入場フラッシュライン
 *
 * ラベル検出:
 *   - lang="ja" のページ: h2（日本語）を優先
 *   - lang="en" のページ: section-kicker / section-label を優先
 *   - data-nav-label 属性で個別上書き可能
 */
(function () {
  'use strict';

  // ── CSS injection ─────────────────────────────────────
  var css = `
    /* Progress bar */
    #av-bar{position:fixed;top:0;left:0;height:2px;width:0;background:linear-gradient(90deg,#6aa6ff,#7ef0d4);z-index:9999;transition:width .08s linear;pointer-events:none}

    /* Side nav — 枠なし・背景透明 */
    #av-nav{position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:400;display:flex;flex-direction:column;padding:10px 0;pointer-events:all}
    .av-item{display:flex;align-items:center;gap:10px;padding:7px 16px 7px 12px;cursor:pointer;border-left:2px solid transparent;text-decoration:none;color:inherit;transition:border-color .2s;background:none}
    .av-item.av-active{border-left-color:#7ef0d4}
    .av-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.25);flex-shrink:0;transition:background .2s,box-shadow .2s}
    .av-item.av-active .av-dot,.av-item.av-visited .av-dot{background:#7ef0d4;box-shadow:0 0 7px rgba(126,240,212,.6)}
    .av-lbl{font-size:.72rem;font-weight:600;color:rgba(180,195,210,.75);white-space:nowrap;transition:color .2s;font-family:'Inter','Noto Sans JP',-apple-system,sans-serif;letter-spacing:.02em;text-shadow:0 1px 6px rgba(0,0,0,.9),0 0 12px rgba(0,0,0,.7)}
    .av-item:hover .av-lbl{color:rgba(220,230,240,1)}
    .av-item.av-active .av-lbl{color:#7ef0d4;font-weight:700;text-shadow:0 0 10px rgba(126,240,212,.4),0 1px 6px rgba(0,0,0,.9)}

    /* Section flash */
    section{position:relative}
    section::after{content:'';position:absolute;top:0;left:-100%;right:-100%;height:1px;background:linear-gradient(90deg,transparent,rgba(106,166,255,.6) 30%,rgba(126,240,212,.85) 50%,rgba(106,166,255,.6) 70%,transparent);opacity:0;pointer-events:none;z-index:2}
    section.av-flash::after{animation:av-line .65s cubic-bezier(.4,0,.2,1) forwards}
    @keyframes av-line{0%{left:-100%;right:100%;opacity:0}40%{opacity:1}100%{left:100%;right:-100%;opacity:0}}

    /* Hide on narrow screens */
    @media(max-width:1200px){#av-nav{display:none}}
  `;
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Progress bar element ──────────────────────────────
  var bar = document.createElement('div');
  bar.id = 'av-bar';
  document.body.insertBefore(bar, document.body.firstChild);

  // ── Scroll progress handler ───────────────────────────
  function updateBar() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (h > 0) bar.style.width = Math.min(100, window.scrollY / h * 100) + '%';
  }
  window.addEventListener('scroll', updateBar, { passive: true });
  updateBar();

  // ── Language-aware label detection ───────────────────
  var isJa = (document.documentElement.lang || '').toLowerCase().startsWith('ja');

  function getLabel(sec) {
    // 1. explicit override always wins
    var dl = sec.getAttribute('data-nav-label');
    if (dl) return dl;

    var kicker = sec.querySelector('.section-kicker,.section-label');
    var h2 = sec.querySelector('h2');

    if (isJa) {
      // Japanese page: h2 first (Japanese text), kicker is usually English
      if (h2) return h2.textContent.trim().slice(0, 9);
      if (kicker) return kicker.textContent.trim().slice(0, 10);
    } else {
      // English page: kicker/label first (concise), then h2
      if (kicker) return kicker.textContent.trim().slice(0, 10);
      if (h2) return h2.textContent.trim().slice(0, 9);
    }

    var h1 = sec.querySelector('h1');
    if (h1) return h1.textContent.trim().slice(0, 9);

    return sec.id || '●';
  }

  // ── Hide legacy .scroll-nav if present ───────────────
  document.addEventListener('DOMContentLoaded', function () {
    var legacyNav = document.querySelector('.scroll-nav');
    if (legacyNav) legacyNav.style.display = 'none';
  });

  // ── Build nav + observers ─────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var sections = Array.from(document.querySelectorAll('section')).filter(function (s) {
      return s.offsetHeight > 80;
    });

    if (sections.length < 2) return;

    var nav = document.createElement('div');
    nav.id = 'av-nav';
    document.body.appendChild(nav);

    var items = [];

    sections.forEach(function (sec, i) {
      if (!sec.id) sec.id = 'av-sec-' + i;

      var a = document.createElement('a');
      a.className = 'av-item';
      a.href = '#' + sec.id;

      var label = getLabel(sec);
      a.innerHTML =
        '<span class="av-dot"></span>' +
        '<span class="av-lbl">' + label + '</span>';

      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      nav.appendChild(a);
      items.push({ el: a, sec: sec });
    });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var sec = e.target;

        sec.classList.remove('av-flash');
        void sec.offsetWidth;
        sec.classList.add('av-flash');

        items.forEach(function (it) {
          var match = it.sec === sec;
          it.el.classList.toggle('av-active', match);
          if (match) it.el.classList.add('av-visited');
        });
      });
    }, { threshold: 0.3 });

    sections.forEach(function (sec) { obs.observe(sec); });
  });

})();
