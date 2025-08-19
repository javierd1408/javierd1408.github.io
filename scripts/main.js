   /* =========================
   Utilidades generales
========================= */

// Año automático en el footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================
   Menú móvil accesible
========================= */
const menuToggle = document.getElementById('menuToggle');
const mobileNav  = document.getElementById('mobileNav');

function toggleMobileNav () {
  if (!mobileNav) return;
  const open = mobileNav.classList.toggle('open');
  mobileNav.setAttribute('aria-hidden', String(!open));
}

if (menuToggle) {
  menuToggle.addEventListener('click', toggleMobileNav);
  menuToggle.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMobileNav();
    }
  });
}

// Cerrar el menú móvil al hacer click en un enlace interno
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior:'smooth', block:'start' });
    }
    if (mobileNav && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
    }
  });
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

/* =========================
   Carrusel de proyectos
========================= */
const track = document.getElementById('carouselTrack');
const left  = document.getElementById('arrowLeft');
const right = document.getElementById('arrowRight');

function getCardWidth () {
  if (!track || !track.children.length) return 320;
  const style = getComputedStyle(track);
  const gap = parseInt(style.gap || style.getPropertyValue('gap')) || 16;
  const first = track.children[0].getBoundingClientRect().width;
  return Math.round(first + gap);
}

function scrollByCard (direction = 1) {
  if (!track) return;
  const w = getCardWidth();
  track.scrollBy({ left: w * direction, behavior: 'smooth' });
}

if (track && left && right) {
  left.addEventListener('click',  ()=> scrollByCard(-1));
  right.addEventListener('click', ()=> scrollByCard(1));

  // Autoscroll cada 5s (pausa al hover)
  let auto = setInterval(()=> scrollByCard(1), 5000);
  track.addEventListener('mouseenter', ()=> clearInterval(auto));
  track.addEventListener('mouseleave', ()=> {
    auto = setInterval(()=> scrollByCard(1), 5000);
  });

  // Teclas de flecha
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowLeft')  left.click();
    if (e.key === 'ArrowRight') right.click();
  });

  // Recalcula en resize (usa valores frescos en getCardWidth)
  window.addEventListener('resize', ()=> {});
}

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

function toggleMobileNav(){
  const open = mobileNav.classList.toggle('open');
  mobileNav.setAttribute('aria-hidden', String(!open));
  document.documentElement.style.overflow = open ? 'hidden' : '';
  document.body.style.overflow = open ? 'hidden' : '';
}

/* Fix anclas con header fijo (drop-in, idempotente) */
(() => {
  // evita cargas duplicadas si lo pegas más de una vez
  if (window.__jdAnchorFixLoaded) return;
  window.__jdAnchorFixLoaded = true;

  const HEADER_SEL = 'header.nav';
  const prefersReduce = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const getOffset = () => {
    const h = document.querySelector(HEADER_SEL);
    return (h?.offsetHeight || 0) + 12; // 12px de aire
  };

  const scrollToTarget = (el) => {
    const y = el.getBoundingClientRect().top + window.scrollY - getOffset();
    window.scrollTo({
      top: y,
      behavior: prefersReduce() ? 'auto' : 'smooth',
    });
  };

  // Delegación: un solo listener para todos los enlaces internos
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute('href');
    const id = href.slice(1);
    if (!id) return;

    const el = document.getElementById(id);
    if (!el) return;

    e.preventDefault();
    scrollToTarget(el);
    history.pushState(null, '', href);
  });

  // Ajusta también si llegas con hash o usas atrás/adelante
  const handleHash = () => {
    const id = location.hash.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el) scrollToTarget(el);
  };

  window.addEventListener('hashchange', handleHash);
  window.addEventListener('load', () => setTimeout(handleHash, 0));
})();
