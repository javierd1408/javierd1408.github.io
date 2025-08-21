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