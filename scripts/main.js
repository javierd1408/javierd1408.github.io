   /* =========================
   Utilidades generales
========================= */

// Año automático en el footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================
   Menú móvil (único y ordenado)
========================= */
const menuToggle = document.getElementById('menuToggle');
const mobileNav  = document.getElementById('mobileNav');

function openMobileNav(){
  if (!mobileNav) return;
  mobileNav.classList.add('open');
  mobileNav.setAttribute('aria-hidden','false');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  menuToggle?.setAttribute('aria-expanded','true');
}

function closeMobileNav(){
  if (!mobileNav) return;
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden','true');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  menuToggle?.setAttribute('aria-expanded','false');
}

function toggleMobileNav(){
  if (!mobileNav) return;
  mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
}

// Botón hamburguesa
if (menuToggle){
  menuToggle.addEventListener('click', toggleMobileNav);
  menuToggle.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMobileNav(); }
  });
}

// Cerrar si haces click fuera del panel
document.addEventListener('click', (e)=>{
  if (!mobileNav?.classList.contains('open')) return;
  if (e.target.closest('#mobileNav') || e.target.closest('#menuToggle')) return;
  closeMobileNav();
});

// Cerrar con Escape
document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeMobileNav(); });

// Cerrar al pasar a desktop
window.addEventListener('resize', ()=>{ if (window.innerWidth >= 861) closeMobileNav(); });

// Si navegas a una sección desde el menú móvil, cierra el panel.
// (Tu handler global de anclas ya hace el scroll con offset)
document.addEventListener('click', (e)=>{
  const link = e.target.closest('#mobileNav a[href^="#"]');
  if (link) closeMobileNav();
});

/* =========================
   Efecto "reveal" al hacer scroll
========================= */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if (en.isIntersecting) en.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ==== Carrusel de Proyectos (unificado: desktop y móvil) ==== */
(() => {
  // Soporta ids/clases viejas y nuevas para que no falle según tu HTML
  let root =
    document.getElementById('projectsCarousel') ||
    document.getElementById('projCarousel') ||
    document.getElementById('proyectos'); // último recurso

  // Si no hay wrapper, intenta detectar por el track directamente
  let track =
    root?.querySelector('.projects-track') ||
    root?.querySelector('.proj-track') ||
    document.getElementById('projectsTrack') ||
    document.getElementById('carouselTrack');
  if (!track) return;

  // Flechas (soporta nombres nuevos y antiguos)
  let prev =
    root?.querySelector('.proj-arrow.left') ||
    root?.querySelector('.arrow.left') ||
    document.getElementById('arrowLeft');
  let next =
    root?.querySelector('.proj-arrow.right') ||
    root?.querySelector('.arrow.right') ||
    document.getElementById('arrowRight');

  // ¿El layout actual es horizontal tipo carrusel?
  const isHorizontal = () => track.scrollWidth - track.clientWidth > 1;

  const getGap = () => parseInt(getComputedStyle(track).gap || '0', 10) || 0;
  const getStep = () => {
    const card =
      track.querySelector('.project-card') ||
      track.querySelector('.proj') ||
      track.firstElementChild;
    if (!card) return track.clientWidth * 0.9;
    const w = card.getBoundingClientRect().width;
    return Math.max(220, Math.round(w + getGap()));
  };

  const go = (dir) => {
    if (!isHorizontal()) return;
    track.scrollBy({ left: dir * getStep(), behavior: 'smooth' });
  };

  // Estado de flechas (se ocultan en móvil/vertical)
  const updateArrows = () => {
    const horiz = isHorizontal();
    const max = track.scrollWidth - track.clientWidth - 1;

    if (prev && next) {
      if (!horiz) {
        prev.setAttribute('hidden', '');
        next.setAttribute('hidden', '');
      } else {
        prev.removeAttribute('hidden');
        next.removeAttribute('hidden');
        prev.disabled = track.scrollLeft <= 0;
        next.disabled = track.scrollLeft >= max;
      }
    }
  };

  // Click / teclado en flechas
  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));
  [prev, next].forEach((btn) =>
    btn?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    })
  );

  // Drag / swipe (funciona en desktop y móvil cuando es horizontal)
  let dragging = false,
    startX = 0,
    startScroll = 0;

  const onDown = (e) => {
    if (!isHorizontal()) return;
    dragging = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    startScroll = track.scrollLeft;
    track.classList.add('grabbing'); // opcional para cursor
  };
  const onMove = (e) => {
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    track.scrollLeft = startScroll - (x - startX);
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('grabbing');
  };

  track.addEventListener('mousedown', onDown);
  track.addEventListener('touchstart', onDown, { passive: true });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);

  // Mantener flechas en sync
  track.addEventListener('scroll', updateArrows);
  window.addEventListener('resize', updateArrows);
  // primer render
  updateArrows();
})();


/* =========================
   Teléfono internacional (intl-tel-input)
   (El CSS/JS del plugin ya está enlazado por CDN en index.html)
========================= */
const phoneInput = document.querySelector('#telefono');
if (phoneInput && window.intlTelInput) {
  const iti = window.intlTelInput(phoneInput, {
    preferredCountries: ['ve','ar','co','cl','us','es'],
    separateDialCode: true,
    utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
  });

  // Si necesitaras el número completo en otro punto:
  // const fullNumber = iti.getNumber();
}

/* =========================
   "Formulario" sin <form> (handler por click)
========================= */
const submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
  submitBtn.addEventListener('click', (e)=>{
    e.preventDefault();

    const name  = (document.getElementById('name')   ?.value || '').trim() || 'Sin nombre';
    const email = (document.getElementById('email')  ?.value || '').trim() || 'No especificado';
    const telEl = document.getElementById('telefono');

    // Si está activo intl-tel-input, intenta tomar el número formateado
    let tel = '';
    try {
      if (window.intlTelInputGlobals && telEl) {
        const inst = window.intlTelInputGlobals.getInstance(telEl);
        tel = inst ? inst.getNumber() : (telEl.value || '');
      } else {
        tel = telEl ? telEl.value : '';
      }
    } catch {
      tel = telEl ? telEl.value : '';
    }

    alert(`Mensaje demo recibido.\n\nNombre: ${name}\nEmail: ${email}\nTel: ${tel}\n\n(Esto es una demo; integraré el envío real cuando lo decidas.)`);
  });
}

/* =========================
   Menú móvil (centralizado)
========================= */

function toggleMobileNav(){
  if (!mobileNav) return;
  const open = mobileNav.classList.toggle('open');
  mobileNav.setAttribute('aria-hidden', String(!open));
  document.documentElement.style.overflow = open ? 'hidden' : '';
  document.body.style.overflow = open ? 'hidden' : '';
  if (menuToggle) menuToggle.setAttribute('aria-expanded', String(open));
}

// Cerrar de forma centralizada (libera scroll)
function closeMobileNav () {
  if (!mobileNav) return;
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
}
// Conectar el botón hamburguesa (click + teclado)
if (typeof menuToggle !== 'undefined' && menuToggle) {
  menuToggle.addEventListener('click', toggleMobileNav);
  menuToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMobileNav(); }
  });
}

// 2) Clic fuera del panel: cerrar
document.addEventListener('click', (e) => {
  if (!mobileNav?.classList.contains('open')) return;
  const clickedToggle = e.target.closest('#menuToggle');
  const insidePanel  = e.target.closest('#mobileNav');
  if (!clickedToggle && !insidePanel) closeMobileNav();
});

// 3) Escape: cerrar
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileNav();
});

// 4) Al pasar a escritorio: cerrar y liberar scroll
window.addEventListener('resize', () => {
  if (window.innerWidth >= 861) closeMobileNav();
});

/* =========================
   Anclas con header fijo (1 solo handler)
========================= */
function headerOffset(){
  const h = document.querySelector('header.nav');
  return (h?.offsetHeight || 0) + 12;
}
function scrollToEl(el){
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset();
  window.scrollTo({ top, behavior: 'smooth' });
}
function handleHash(){
  const id = location.hash.slice(1);
  if (!id) return;
  const el = document.getElementById(id);
  if (el) scrollToEl(el);
}
window.addEventListener('hashchange', handleHash);
window.addEventListener('load', () => setTimeout(handleHash, 0));

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;

  const href = a.getAttribute('href');
  const id = href.slice(1);
  const el = document.getElementById(id);
  if (!el) return;

  e.preventDefault();
  scrollToEl(el);
  history.pushState(null, '', href);

  // Si el click vino del menú móvil, ciérralo
  if (mobileNav?.classList.contains('open') && a.closest('#mobileNav')) {
    closeMobileNav();
  }
});

/* =========================
   Tilt en tarjetas de servicio (solo desktop)
========================= */
(() => {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;
  const coarse = window.matchMedia?.('(pointer:coarse)').matches;
  if (coarse) return;

  cards.forEach(card => {
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const ry = ((x / r.width) - 0.5) * 10;
      const rx = ((y / r.height) - 0.5) * -10;
      card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
      card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      card.style.setProperty('--mx', (x / r.width) * 100 + '%');
      card.style.setProperty('--my', (y / r.height) * 100 + '%');
    };
    const reset = () => {
      card.style.setProperty('--rx','0deg');
      card.style.setProperty('--ry','0deg');
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', reset);
  });
})();

/* =========================
   Carrusel de Servicios
========================= */
(() => {
  const car = document.getElementById('svcCarousel');
  if (!car) return;
  const track = car.querySelector('.services-track');
  const prev  = car.querySelector('.svc-arrow.left');
  const next  = car.querySelector('.svc-arrow.right');

  const step = () => Math.min(track.clientWidth * 0.85, 480);
  const go   = (dir) => track.scrollBy({ left: dir * step(), behavior: 'smooth' });

  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));

  [prev, next].forEach(btn => btn?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
  }));
})();

/* =========================
   CTA Servicios -> mensaje + scroll a #contacto
========================= */
(() => {
  const templates = {
    "Hardening para PYMES":
      "Hola Javier, me interesa el servicio de Hardening para PYMES. Contexto: equipos Windows/Linux, firewall/SSH, backups y monitoreo. ¿Podemos agendar una llamada? Puedo compartir nº de equipos/servidores, SO y prioridades.",
    "Desarrollo Web Seguro":
      "Hola Javier, quiero una propuesta de Desarrollo Web Seguro. Puedo detallar tipo de app (landing/ecommerce/dashboard), auth, integraciones y hosting. ¿Coordinamos una llamada para alcance/tiempos?",
    "Consultoría y Asesoría":
      "Hola Javier, busco Consultoría/Asesoría. Objetivo: evaluación rápida y plan de remediación/formación. Te paso objetivos, stack y plazos para estimación. ¿Agendamos una llamada breve?",
    "Pentesting básico":
      "Hola Javier, me interesa un Pentesting básico / evaluación de seguridad. Tengo definido el alcance y el entorno de pruebas. ¿Podemos coordinar fechas, ventanas de prueba y entregables?"
  };

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.cta-propuesta');
    if (!btn) return;

    e.preventDefault();

    const key   = btn.dataset.service?.trim();
    const area  = document.getElementById('message');
    const name  = document.getElementById('name');
    const msg   = templates[key] ||
      `Hola Javier, me interesa el servicio de ${key || 'un servicio'}. ¿Podemos agendar una llamada breve para evaluar alcance y tiempos?`;

    if (area) {
      area.value = msg;
      area.dispatchEvent(new Event('input', { bubbles: true }));
      name?.focus({ preventScroll: true });
    }

    const destino = document.getElementById('contacto');
    if (destino) {
      const top = destino.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      location.hash = '#contacto';
    }
  });
})();
/* === Certificaciones: lightbox accesible === */
(() => {
  const grid = document.querySelector('.cert-grid');
  if (!grid) return;

  // Overlay único
  const overlay = document.createElement('div');
  overlay.className = 'cert-lightbox';
  overlay.innerHTML = `
    <button class="clb-close" aria-label="Cerrar">×</button>
    <img alt="">
    <a class="clb-download" target="_blank" rel="noopener">Abrir original</a>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.clb-close');
  const dl = overlay.querySelector('.clb-download');

  const open = (src, alt) => {
    imgEl.src = src;
    imgEl.alt = alt || '';
    dl.href = src;
    overlay.classList.add('open');
    document.body.classList.add('no-scroll');
  };
  const close = () => {
    overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
    imgEl.src = '';
  };

  grid.addEventListener('mousemove', (e)=>{
    const card = e.target.closest('.cert-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * 100;
    card.style.setProperty('--mx', `${x}%`);
  });

  grid.addEventListener('click', (e)=>{
    const thumb = e.target.closest('.cert-thumb');
    if (!thumb) return;
    const full = thumb.getAttribute('data-full') || thumb.src;
    open(full, thumb.alt);
  });

  overlay.addEventListener('click', (e)=>{
    if (e.target === overlay || e.target === closeBtn) close();
  });
  document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') close(); });
})();
/* ===== Certificaciones: plegado móvil "Ver más / Ver menos" ===== */
(() => {
  const wrap = document.getElementById('certWrap');
  const btn  = document.getElementById('certMore');
  if (!wrap || !btn) return;

  const mq = window.matchMedia('(max-width: 880px)');
  const apply = () => {
    const isMobile = mq.matches;
    // Mostrar botón sólo en móvil
    btn.hidden = !isMobile;
    wrap.classList.toggle('collapsed', isMobile && !btn.dataset.expanded);
    btn.setAttribute('aria-expanded', btn.dataset.expanded ? 'true' : 'false');
    btn.textContent = btn.dataset.expanded ? 'Ver menos' : 'Ver más';
  };
  apply();
  mq.addEventListener?.('change', apply);
  window.addEventListener('resize', apply);

  btn.addEventListener('click', () => {
    const expanded = btn.dataset.expanded === 'true';
    btn.dataset.expanded = String(!expanded);
    apply();
  });
})();

/* ===== Certificaciones: Ver más / Ver menos (solo móvil) ===== */
(() => {
  const grid   = document.getElementById('certsGrid');
  const toggle = document.getElementById('certsToggle');
  if (!grid || !toggle) return;

  const setOpen = (isOpen) => {
    grid.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.textContent = isOpen ? 'Ver menos' : 'Ver más';
  };

  toggle.addEventListener('click', () => {
    const open = grid.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  // Por si cambias de tamaño de pantalla
  window.addEventListener('resize', () => {
    if (window.innerWidth > 880) setOpen(true);   // en desktop, siempre abierto
    else setOpen(false);                          // en móvil, inicia colapsado
  });

  // Estado inicial adecuado
  if (window.innerWidth > 880) setOpen(true);
  else setOpen(false);
})();

/* ===== Modales legales (Privacidad / Términos) — cooperan con menú móvil ===== */
(() => {
  const openBtns = document.querySelectorAll('[data-modal]');
  const modals = {
    privacy: document.getElementById('modal-privacy'),
    terms: document.getElementById('modal-terms')
  };

  // Para no pelear con el menú móvil, llevamos un contador de locks
  let modalLockCount = 0;
  let lastFocus = null;

  const html = document.documentElement;
  const body = document.body;

  const isMobileNavOpen = () => {
    const nav = document.getElementById('mobileNav');
    return !!nav && nav.classList.contains('open');
  };

  function lockScroll(lock){
    if (lock){
      modalLockCount++;
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    } else {
      modalLockCount = Math.max(0, modalLockCount - 1);
      // Solo libera si ningún modal mantiene lock y el menú NO está abierto
      if (modalLockCount === 0 && !isMobileNavOpen()){
        html.style.overflow = '';
        body.style.overflow = '';
      }
    }
  }

  function getFocusable(container){
    return container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
  }

  function trapFocus(e, dialog){
    if (e.key !== 'Tab') return;
    const focusables = getFocusable(dialog);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first){
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last){
      e.preventDefault(); first.focus();
    }
  }

  function openModal(key){
    const modal = modals[key];
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add('open');
    lockScroll(true);
    const dialog = modal.querySelector('.modal-dialog');
    dialog?.focus();

    // focus-trap
    modal.__trap = (ev) => trapFocus(ev, dialog);
    modal.addEventListener('keydown', modal.__trap);
  }

  function closeModal(modal){
    if (!modal) return;
    modal.classList.remove('open');
    // libera scroll solo si corresponde
    lockScroll(false);

    // quita focus-trap
    if (modal.__trap) modal.removeEventListener('keydown', modal.__trap);
    lastFocus?.focus();
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.modal));
  });

  // Cerrar con backdrop o botón [data-close]
  Object.values(modals).forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target.matches('[data-close], .modal-backdrop')) {
        closeModal(modal);
      }
    });
  });

  // ESC global cierra el modal superior
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
      const open = document.querySelector('.modal.open');
      if (open) closeModal(open);
    }
  });
})();

// Botones legales (IDs de compatibilidad)
(function(){
  const open = (type) => {
    // Si ya tienes una función existente, llama a esa.
    // Si no, simulamos click a los antiguos IDs (ajusta si cambian):
    const legacy = (type === 'privacy' ? document.getElementById('btnPriv') : document.getElementById('btnTerms'));
    if (legacy) { legacy.click(); return; }
    // Si no hay legacy, pero tienes una función openLegal(type), úsala:
    if (typeof window.openLegal === 'function') { window.openLegal(type); }
  };

  document.getElementById('openPrivacy')?.addEventListener('click', (e)=>{ e.preventDefault(); open('privacy'); });
  document.getElementById('openTerms')  ?.addEventListener('click', (e)=>{ e.preventDefault(); open('terms');   });
})();


