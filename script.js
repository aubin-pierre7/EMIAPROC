/* ============================================================
   EMIAPROC Club – Script principal (version professionnelle)
   ------------------------------------------------------------
   ✅ Fonctions incluses :
   - Menu mobile responsive (toggle)
   - Effet d’ombre du header au scroll
   - Scroll fluide vers les ancres
   - Gestion de formulaires via Formspree (envoi réel)
   - Surbrillance automatique du lien actif
   - Animation de révélation fluide et stable
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const mainNav = document.getElementById("mainNav");
  const navToggleButtons = document.querySelectorAll(".nav-toggle");
  const yearEls = document.querySelectorAll('[id^="year"]');

  /* === Année automatique dans le footer === */
  yearEls.forEach(el => {
    el.textContent = new Date().getFullYear().toString();
  });

  /* === Effet d’ombre du header au scroll === */
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  });

  /* === Menu mobile === */
  navToggleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      const newState = !isExpanded;
      btn.setAttribute("aria-expanded", newState.toString());
      mainNav.classList.toggle("nav-mobile", newState);
      document.body.classList.toggle("menu-open", newState);
    });
  });

  /* === Fermer le menu mobile quand on clique sur un lien === */
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      if (mainNav.classList.contains("nav-mobile")) {
        mainNav.classList.remove("nav-mobile");
        document.body.classList.remove("menu-open");
        navToggleButtons.forEach(b => b.setAttribute("aria-expanded", "false"));
      }
    });
  });

  /* === Surbrillance du lien actif === */
  (() => {
    const currentPage = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(link => {
      const target = link.getAttribute("href");
      link.classList.toggle("active",
        target === currentPage ||
        (target === "index.html" && currentPage === "")
      );
    });
  })();

  /* === Scroll fluide pour les ancres internes === */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = header.offsetHeight + 8;
      const scrollPos = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({ top: scrollPos, behavior: "smooth" });
    });
  });

  /* === Animation de révélation fluide === */
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".section, .card, .project-card, .team-card").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    } else {
      revealObserver.observe(el);
    }
  });

  /* === Envoi réel via Formspree (sans backend) === */
  async function handleFormSubmit(formEl, successEl, formspreeUrl) {
    if (!formEl) return;

    formEl.addEventListener("submit", async e => {
      e.preventDefault();

      // Validation basique
      const inputs = [...formEl.querySelectorAll("input[required], textarea[required]")];
      const invalid = inputs.find(i => !i.value.trim());
      if (invalid) {
        invalid.focus();
        invalid.classList.add("input-error");
        setTimeout(() => invalid.classList.remove("input-error"), 1200);
        return;
      }

      const submitBtn = formEl.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Envoi...";

      try {
        const formData = new FormData(formEl);
        const res = await fetch(formspreeUrl, {
          method: "POST",
          body: formData,
          headers: { "Accept": "application/json" }
        });

        if (res.ok) {
          if (successEl) {
            successEl.hidden = false;
            setTimeout(() => (successEl.hidden = true), 4000);
          } else {
            alert("Message envoyé avec succès !");
          }
          formEl.reset();
        } else {
          alert("Une erreur est survenue. Réessayez plus tard.");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur réseau. Vérifiez votre connexion.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

  /* === Attacher les formulaires à leurs URLs Formspree === */
  // Remplace les URLs ci-dessous par les tiennes (Formspree)
  handleFormSubmit(
    document.getElementById("joinForm"),
    document.getElementById("joinSuccess"),
    "https://formspree.io/f/xxxxxxxx" // <- ton URL Formspree "Rejoignez-nous"
  );

  handleFormSubmit(
    document.getElementById("contactForm"),
    document.getElementById("contactSuccess"),
    "https://formspree.io/f/yyyyyyyy" // <- ton URL Formspree "Contact"
  );
});
