/* ==========================================================================
   Muwahid — Portfolio Script
   Handles: page loader, navbar scroll state, mobile nav, smooth anchor
   scrolling, scroll-reveal animations, and footer year.
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- Page Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    // Small delay so the loader doesn't just flash on fast connections
    setTimeout(() => {
      loader.classList.add('is-hidden');
    }, 350);
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  const closeMobileNav = () => {
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile nav after selecting a link
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  // Stagger items that share a parent grid/list for a more polished entrance
  const groups = new Map();
  revealEls.forEach((el) => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach((els) => {
    els.forEach((el, i) => {
      if (els.length > 1) {
        el.style.setProperty('--delay', `${Math.min(i * 0.08, 0.4)}s`);
      }
    });
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ---------- Smooth anchor scrolling with navbar offset ---------- */
  const navHeight = () =>
    parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight() + 1;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

      // Keep focus management accessible
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();
