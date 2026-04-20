/**
 * home.js — Avisail LP ホームページ固有スクリプト
 * index.html / index.ja.html 共通
 *
 * 機能:
 *   1. スクロールアニメーション (.animate-on-scroll)
 *   2. グローバル背景パーティクルアニメーション (canvas#global-bg)
 */
'use strict';

document.addEventListener('DOMContentLoaded', function () {

  // ── Scroll Animation Observer ──────────────────────────
  const scrollObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, index) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, index * 50);
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
    scrollObserver.observe(el);
  });

  // ── Global Background Animation ────────────────────────
  (function () {
    const canvas = document.getElementById('global-bg');
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      document.body.style.background = 'linear-gradient(135deg, #0a0f1a 0%, #05080f 100%)';
      return;
    }

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let zOff = 0;
    let animationId;
    let isVisible = true;

    document.addEventListener('visibilitychange', function () {
      isVisible = !document.hidden;
      if (isVisible && !animationId) {
        animationId = requestAnimationFrame(loop);
      }
    });

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    }

    let resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    });

    function initParticles() {
      particles = [];
      const count = Math.min(Math.floor(width * height / 4000), 300);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0, vy: 0,
          maxSpeed: Math.random() * 0.6 + 0.2,
          size: Math.random() > 0.9 ? 1.5 : 0.8,
          color: Math.random() > 0.5 ? '#2E64BA' : '#4DB899'
        });
      }
    }

    function update() {
      zOff += 0.0005;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle = (Math.cos(p.x * 0.002 + zOff) + Math.sin(p.y * 0.002 + zOff)) * Math.PI;
        p.vx += Math.cos(angle) * 0.02;
        p.vy += Math.sin(angle) * 0.02;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > p.maxSpeed) {
          p.vx = (p.vx / speed) * p.maxSpeed;
          p.vy = (p.vy / speed) * p.maxSpeed;
        }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) { p.x = width; p.vx = 0; p.vy = 0; }
        if (p.x > width) { p.x = 0; p.vx = 0; p.vy = 0; }
        if (p.y < 0) { p.y = height; p.vx = 0; p.vy = 0; }
        if (p.y > height) { p.y = 0; p.vx = 0; p.vy = 0; }
      }
    }

    function draw() {
      ctx.fillStyle = 'rgba(5, 8, 15, 0.2)';
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      if (!isVisible) { animationId = null; return; }
      update(); draw();
      animationId = requestAnimationFrame(loop);
    }

    resize();
    animationId = requestAnimationFrame(loop);
  })();

});
