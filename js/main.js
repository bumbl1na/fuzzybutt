/* =========================================================
   FuzzyButts Rescue — main.js
   Handles: nav scroll, mobile menu, reveal animations,
            stat counter, smooth scroll, footer year
   ========================================================= */

(function () {
  'use strict';

  // ----- DOM ready helper -----
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    initNav();
    initMobileMenu();
    initReveal();
    initCounters();
    initSmoothScroll();
    initFooterYear();
    initUnderlineAccents();
  });

  // =========================================================
  // NAV — adds 'scrolled' class after scrolling 40px
  // =========================================================
  function initNav() {
    var header = document.getElementById('site-header');
    if (!header) return;

    function updateNav() {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    updateNav(); // run on load
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  // =========================================================
  // MOBILE MENU — toggle .open on nav links
  // =========================================================
  function initMobileMenu() {
    var toggle  = document.getElementById('nav-toggle');
    var links   = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    links.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // =========================================================
  // SCROLL REVEAL — IntersectionObserver for .reveal,
  //                 .reveal-left, .stagger elements
  // =========================================================
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: make everything visible immediately
      document.querySelectorAll('.reveal, .reveal-left, .stagger').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    document.querySelectorAll('.reveal, .reveal-left, .stagger').forEach(function (el) {
      observer.observe(el);
    });

    // Also trigger underline accent visibility
    document.querySelectorAll('.section-heading').forEach(function (el) {
      observer.observe(el);
    });
  }

  // =========================================================
  // STAT COUNTERS — animates [data-target] numbers on reveal
  // =========================================================
  function initCounters() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.stat-item__number[data-target]').forEach(function (el) {
        el.textContent = el.dataset.target;
      });
      return;
    }

    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('.stat-item__number[data-target]').forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var duration = 1800; // ms
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      el.textContent = Math.round(ease * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  // =========================================================
  // SMOOTH SCROLL — polyfill for anchor links
  // (CSS scroll-behavior handles modern browsers;
  //  this ensures consistent easing cross-browser)
  // =========================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        var navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72',
          10
        );
        var offsetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      });
    });
  }

  // =========================================================
  // FOOTER YEAR — keep copyright year current
  // =========================================================
  function initFooterYear() {
    var yearEl = document.getElementById('footer-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // =========================================================
  // UNDERLINE ACCENTS — trigger CSS animation when heading
  //                     is visible
  // =========================================================
  function initUnderlineAccents() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.underline-accent').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var accentObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.underline-accent').forEach(function (a) {
              a.classList.add('visible');
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.section-heading').forEach(function (el) {
      accentObserver.observe(el);
    });
  }

})();
