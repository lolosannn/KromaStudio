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

  /* ---------- 3. Animación de entrada del Hero (el edificio sube y sobresale del marco) ---------- */
  const heroBuilding = document.getElementById('heroBuilding');

  function playHeroIntro() {
    // requestAnimationFrame asegura que el navegador registre el estado inicial (alineado,
    // sin costura) antes de aplicar la clase que dispara la transición (solo transform: alto rendimiento).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (heroBuilding) heroBuilding.classList.add('is-loaded');
      });
    });
  }

  if (heroBuilding && heroBuilding.complete) {
    playHeroIntro();
  } else if (heroBuilding) {
    heroBuilding.addEventListener('load', playHeroIntro, { once: true });
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

  /* ---------- 5b. Modal de detalle de proyecto (contenido de ejemplo) ---------- */
  const PROJECTS = {
    'casa-horizonte': {
      tag: 'Residencial',
      title: 'Casa Horizonte',
      location: 'Nordelta, Buenos Aires',
      year: '2024',
      area: '520 m²',
      typology: 'Vivienda unifamiliar',
      description: [
        'Emplazada frente al espejo de agua de Nordelta, Casa Horizonte se organiza en dos volúmenes horizontales que se deslizan entre sí, enmarcando las vistas al lago y disolviendo el límite entre el interior y el paisaje.',
        'Los planos de hormigón visto conviven con grandes paños de vidrio de piso a techo y carpinterías de aluminio negro, logrando una arquitectura serena que prioriza la luz natural y la conexión constante con el exterior.',
      ],
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      ],
    },
    'torre-cobre': {
      tag: 'Comercial',
      title: 'Torre Cobre',
      location: 'Puerto Madero, Buenos Aires',
      year: '2023',
      area: '3.200 m²',
      typology: 'Edificio corporativo',
      description: [
        'Torre Cobre propone una nueva fachada para el corredor de Puerto Madero: paneles de aluminio anodizado en tono cobrizo que filtran la radiación solar directa mientras generan un juego cromático cambiante a lo largo del día.',
        'La planta libre y el núcleo de servicios perimetral permiten una flexibilidad total de layout, pensada para oficinas corporativas de alta gama con certificación de sustentabilidad en trámite.',
      ],
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=600&q=80',
      ],
    },
    'loft-nogal': {
      tag: 'Interiorismo',
      title: 'Loft Nogal',
      location: 'Palermo, Buenos Aires',
      year: '2025',
      area: '95 m²',
      typology: 'Reciclaje de loft industrial',
      description: [
        'Loft Nogal reconvierte un antiguo depósito de Palermo en una vivienda de un solo ambiente jerarquizado, conservando los ladrillos vistos y la estructura metálica original como testigos de su pasado industrial.',
        'La paleta combina madera de nogal, acero negro y textiles crudos, creando una atmósfera cálida que contrasta con la crudeza de los materiales existentes, resuelta con iluminación indirecta y mobiliario a medida.',
      ],
      images: [
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=600&q=80',
      ],
    },
    'residencia-basalto': {
      tag: 'Residencial',
      title: 'Residencia Basalto',
      location: 'Cariló, Costa Atlántica',
      year: '2022',
      area: '340 m²',
      typology: 'Casa de fin de semana',
      description: [
        'Entre los pinos de Cariló, Residencia Basalto se compone de volúmenes macizos revestidos en piedra basáltica que anclan la construcción al terreno, en diálogo directo con la vegetación nativa.',
        'Los ambientes sociales se abren hacia una galería perimetral de madera que actúa como filtro climático, mientras que los dormitorios se retranquean en busca de privacidad y silencio.',
      ],
      images: [
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80',
      ],
    },
    'pabellon-cedro': {
      tag: 'Comercial',
      title: 'Pabellón Cedro',
      location: 'Bariloche, Río Negro',
      year: '2024',
      area: '680 m²',
      typology: 'Pabellón gastronómico',
      description: [
        'Pabellón Cedro es una estructura de madera laminada que se despliega frente al lago Nahuel Huapi, combinando una lógica constructiva de bajo impacto con una escala monumental que dialoga con el paisaje patagónico.',
        'Los cerramientos de vidrio corredizo permiten integrar por completo la terraza exterior al salón principal en temporada estival, mientras que el volumen cerrado ofrece resguardo térmico durante el invierno.',
      ],
      images: [
        'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80',
      ],
    },
  };

  const projectModal = document.getElementById('projectModal');
  const projectModalBackdrop = document.getElementById('projectModalBackdrop');
  const projectModalClose = document.getElementById('projectModalClose');
  const projectModalImage = document.getElementById('projectModalImage');
  const projectModalThumbs = document.getElementById('projectModalThumbs');
  const projectModalTag = document.getElementById('projectModalTag');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalMeta = document.getElementById('projectModalMeta');
  const projectModalDescription1 = document.getElementById('projectModalDescription1');
  const projectModalDescription2 = document.getElementById('projectModalDescription2');
  const projectModalSpecs = document.getElementById('projectModalSpecs');

  let lastFocusedElement = null;

  function renderSpec(label, value) {
    return `<div class="project-modal__spec">
      <span class="project-modal__spec-label">${label}</span>
      <span class="project-modal__spec-value">${value}</span>
    </div>`;
  }

  function setMainImage(src, alt) {
    projectModalImage.src = src;
    projectModalImage.alt = alt;
  }

  function openProjectModal(id, triggerEl) {
    const data = PROJECTS[id];
    if (!data) return;

    lastFocusedElement = triggerEl || document.activeElement;

    projectModalTag.textContent = data.tag;
    projectModalTitle.textContent = data.title;
    projectModalMeta.textContent = `${data.location} · ${data.year} · ${data.area}`;
    projectModalDescription1.textContent = data.description[0];
    projectModalDescription2.textContent = data.description[1];

    projectModalSpecs.innerHTML =
      renderSpec('Ubicación', data.location) +
      renderSpec('Tipología', data.typology) +
      renderSpec('Superficie', data.area) +
      renderSpec('Año', data.year);

    setMainImage(data.images[0], `${data.title} — imagen principal`);

    projectModalThumbs.innerHTML = data.images
      .map(
        (src, i) =>
          `<button type="button" class="project-modal__thumb${i === 0 ? ' is-active' : ''}" data-index="${i}" aria-label="Ver imagen ${i + 1} de ${data.title}">
            <img src="${src}" alt="" loading="lazy">
          </button>`
      )
      .join('');

    projectModalThumbs.querySelectorAll('.project-modal__thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const index = Number(thumb.dataset.index);
        setMainImage(data.images[index], `${data.title} — imagen ${index + 1}`);
        projectModalThumbs
          .querySelectorAll('.project-modal__thumb')
          .forEach((t) => t.classList.toggle('is-active', t === thumb));
      });
    });

    projectModal.classList.add('is-open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    projectModalClose.focus();
  }

  function closeProjectModal() {
    projectModal.classList.remove('is-open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  document.querySelectorAll('.project-card[data-project]').forEach((card) => {
    card.addEventListener('click', () => openProjectModal(card.dataset.project, card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openProjectModal(card.dataset.project, card);
      }
    });
  });

  projectModalClose.addEventListener('click', closeProjectModal);
  projectModalBackdrop.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && projectModal.classList.contains('is-open')) closeProjectModal();
  });

  // El CTA dentro del modal cierra el modal y deja que el smooth scroll nativo lleve a #contacto
  document.getElementById('projectModalCta').addEventListener('click', closeProjectModal);

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
