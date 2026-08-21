/* =========================================================
   KROMA STUDIO — Interacciones (JS vanilla)
   ========================================================= */
(() => {
  'use strict';

  /* ---------- 1. Header: sombra/fondo al hacer scroll + link activo ---------- */
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);

    let currentId = '';
    const scrollPos = window.scrollY + window.innerHeight * 0.3;
    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) currentId = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${currentId}`);
    });
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Menú móvil ---------- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------- 3. Animación de entrada del Hero (foto deslizándose y "saliendo" del frame) ---------- */
  const heroImage = document.getElementById('heroImage');
  const heroPhoto = document.getElementById('heroPhoto');
  const heroBadge = document.getElementById('heroBadge');

  function playHeroIntro() {
    // requestAnimationFrame asegura que el navegador registre el estado inicial
    // antes de aplicar la clase que dispara la transición (transform/opacity: alto rendimiento).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (heroPhoto) heroPhoto.classList.add('is-loaded');
        if (heroBadge) heroBadge.classList.add('is-loaded');
      });
    });
  }

  if (heroImage.complete) {
    playHeroIntro();
  } else {
    heroImage.addEventListener('load', playHeroIntro, { once: true });
    // Fallback por si la imagen tarda o falla en cargar
    setTimeout(playHeroIntro, 1200);
  }

  /* ---------- 4. Scroll reveal con IntersectionObserver ---------- */
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealElements.forEach((el, index) => {
    // Pequeño escalonado (stagger) dentro de un mismo grupo visible
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 0.08}s`;
    revealObserver.observe(el);
  });

  /* ---------- 5. Contadores animados de métricas ---------- */
  const counters = document.querySelectorAll('.metric__number');

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  /* ---------- 6. Formulario de contacto (validación + feedback) ---------- */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  function validateField(field) {
    const group = field.closest('.form-group');
    const isValid = field.checkValidity();
    group.classList.toggle('has-error', !isValid);
    return isValid;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    formSuccess.classList.remove('is-visible');

    const requiredFields = form.querySelectorAll('[required]');
    let isFormValid = true;
    requiredFields.forEach((field) => {
      if (!validateField(field)) isFormValid = false;
    });

    if (!isFormValid) {
      const firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // Simulación de envío (sustituir por integración real: backend, Formspree, EmailJS, etc.)
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn__label').textContent = 'Enviando...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn__label').textContent = 'Enviar Solicitud';
      formSuccess.classList.add('is-visible');
      form.reset();
    }, 900);
  });

  // Limpia el estado de error en cuanto el usuario corrige un campo
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.closest('.form-group').classList.contains('has-error')) {
        validateField(field);
      }
    });
  });

  /* ---------- 7. Año dinámico en el footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
