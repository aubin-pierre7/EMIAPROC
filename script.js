/* ============================================================
   EMIAPROC Club – Script principal (version finale)
   ------------------------------------------------------------
   Fonctions incluses :
   - Menu mobile (toggle)
   - Effet d’ombre du header au scroll
   - Scroll fluide vers les ancres
   - Gestion des formulaires (simulation front)
   - Surbrillance du lien actif
   - Animation de révélation fluide sans disparition initiale
   ============================================================ */

const header = document.getElementById('header');
const navToggleButtons = document.querySelectorAll('.nav-toggle');
const mainNav = document.getElementById('mainNav');
const yearEls = document.querySelectorAll('[id^="year"]');

/* === Année automatique dans le footer === */
yearEls.forEach(el => el.textContent = new Date().getFullYear().toString());

/* === Effet d’ombre du header au scroll === */
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

/* === Menu mobile === */
navToggleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('nav-mobile');
  });
});

/* Fermer le menu mobile quand on clique sur un lien */
document.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', () => {
    if (mainNav.classList.contains('nav-mobile')) {
      mainNav.classList.remove('nav-mobile');
      navToggleButtons.forEach(b => b.setAttribute('aria-expanded', 'false'));
    }
  });
});

/* === Surbrillance du lien actif === */
(function setActiveNavByPath() {
  const path = location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (href === 'index.html' && (path === '' || path === '/'))) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();

/* === Scroll fluide pour les ancres internes === */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    const headerOffset = header.offsetHeight;
    const pos = target.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
    window.scrollTo({ top: pos, behavior: 'smooth' });
  });
});

/* === Animation de révélation fluide === */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

/* Appliquer l'effet de révélation aux sections et cartes */
document.querySelectorAll('.section, .card, .project-card, .team-card').forEach(el => {
  // invisible au départ
  el.style.opacity = 0;
  el.style.transform = 'translateY(15px)';
  el.style.transition = 'opacity .6s ease-out, transform .6s ease-out';

  // si visible dès le chargement (comme le hero), afficher immédiatement
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85) {
    el.style.opacity = 1;
    el.style.transform = 'translateY(0)';
  } else {
    revealObserver.observe(el);
  }
});

/* === Simulation simple de formulaire (sans backend) === */
function simulateForm(formEl, successEl) {
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    // validation basique
    const inputs = Array.from(formEl.querySelectorAll('input[required], textarea[required]'));
    const missing = inputs.find(i => !i.value.trim());
    if (missing) {
      missing.focus();
      missing.classList.add('input-error');
      setTimeout(() => missing.classList.remove('input-error'), 1200);
      return;
    }

    // désactivation temporaire
    const submit = formEl.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Envoi...';

    setTimeout(() => {
      submit.disabled = false;
      submit.textContent = submit.getAttribute('data-label') || 'Envoyer';
      if (successEl) {
        successEl.hidden = false;
        setTimeout(() => successEl.hidden = true, 4800);
      } else {
        alert('Message envoyé (simulation).');
      }
      formEl.reset();
    }, 900);
  });
}

/* === Attacher la simulation aux formulaires connus === */
document.addEventListener('DOMContentLoaded', () => {
  const joinForm = document.getElementById('joinForm');
  const joinSuccess = document.getElementById('joinSuccess');
  if (joinForm) simulateForm(joinForm, joinSuccess);

  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  if (contactForm) simulateForm(contactForm, contactSuccess);
});
