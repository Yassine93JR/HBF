(() => {
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const header = document.querySelector(".site-header");
  const onScroll = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const opened = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(opened));
    });
    links.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => links.classList.remove("open"))
    );
  }
  const slides = [...document.querySelectorAll(".hero-image")];
  const dots = [...document.querySelectorAll(".hero-slide-dots button")];
  if (slides.length) {
    let index = 0;
    let timer;
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((slide, n) => slide.classList.toggle("is-active", n === index));
      dots.forEach((dot, n) => {
        dot.classList.toggle("is-active", n === index);
        dot.setAttribute("aria-pressed", String(n === index));
      });
    };
    const start = () => {
      window.clearInterval(timer);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        timer = window.setInterval(() => show(index + 1), 6500);
      }
    };
    document.querySelector(".hero-slide-prev")?.addEventListener("click", () => {
      show(index - 1);
      start();
    });
    document.querySelector(".hero-slide-next")?.addEventListener("click", () => {
      show(index + 1);
      start();
    });
    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => {
        show(i);
        start();
      })
    );
    document.querySelector(".hero")?.addEventListener("mouseenter", () => window.clearInterval(timer));
    document.querySelector(".hero")?.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = encodeURIComponent("Demande de contact — HBF");
      const body = encodeURIComponent(
        `Bonjour HBF,\n\n${data.get("message")}\n\nNom : ${data.get("nom")}\nPrénoms : ${data.get("prenoms")}\nEmail : ${data.get("email")}`
      );
      const note = document.querySelector("#form-note");
      if (note) note.textContent = "Votre logiciel de messagerie va s’ouvrir. Vérifiez le message puis envoyez-le.";
      window.location.href = `mailto:hbf@hbf.bj?subject=${subject}&body=${body}`;
    });
  }

  const items = document.querySelectorAll(".card, .activity-card, .portfolio-card, .team-card, .reveal-me");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => observer.observe(el));
  }
})();
