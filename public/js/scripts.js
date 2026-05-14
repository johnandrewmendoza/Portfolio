(function () {
  'use strict';

  /* ── Element references ─────────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const navToggle   = document.getElementById('navToggle');
  const navLinks    = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const html        = document.documentElement;

  /* ── 1. THEME (Light / Dark) ────────────────────────────── */
  var savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  function toggleTheme() {
    var current = html.getAttribute('data-theme');
    var next    = current === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  /* ── 2. NAVBAR SCROLL STATE ─────────────────────────────── */
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 3. MOBILE MENU TOGGLE ──────────────────────────────── */
  function openMenu() {
    navLinks.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  function toggleMenu() {
    var isOpen = navLinks.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
  }

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });

  /* ── 4. SCROLL REVEAL ───────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {

    var revealObserver = new IntersectionObserver(
      function (entries) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });

  } else {

    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });

  }

  /* ── 5. CONTACT FORM ────────────────────────────────────── */
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {

    var formStatus = document.getElementById('formStatus');

    function setStatus(msg, type) {
      if (!formStatus) return;

      formStatus.textContent = msg;
      formStatus.className = 'form-status ' + (type || '');
    }

    contactForm.addEventListener('submit', function (e) {

      e.preventDefault();

      setStatus('');

      var formData = new FormData(contactForm);

      fetch('/contact', {
        method: 'POST',
        body: new URLSearchParams(formData),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      .then(function (res) {

        if (!res.ok) {
          throw new Error('Server error ' + res.status);
        }

        return res.text();

      })

      .then(function (msg) {

        setStatus(
          msg || "Message sent! I'll be in touch soon.",
          'success'
        );

        contactForm.reset();

      })

      .catch(function (err) {

        console.error('Contact form error:', err);

        setStatus(
          'Something went wrong. Please try again or reach out directly.',
          'error'
        );

      });

    });

  }

})();