/* HBF — interactions WOW (aucune dépendance) */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const still = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const body = document.body;

  // Préchargeur
  const ld = document.createElement("div");
  ld.id = "wx-load"; ld.innerHTML = '<img src="assets/images/hbf-logo.png" alt=""><i></i>';
  body.prepend(ld);
  const hide = () => setTimeout(() => ld.classList.add("off"), still ? 0 : 700);
  document.readyState === "complete" ? hide() : addEventListener("load", hide);
  setTimeout(() => ld.classList.add("off"), 3500);

  // Barre de progression, bouton haut de page, halo du curseur
  const bar = Object.assign(document.createElement("div"), { id: "wx-bar" });
  const top = Object.assign(document.createElement("button"), { id: "wx-top", type: "button", innerHTML: "↑", ariaLabel: "Haut de page" });
  top.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
  body.append(bar, top);
  let glow;
  if (fine && !still) {
    glow = Object.assign(document.createElement("div"), { id: "wx-glow" });
    body.append(glow);
    addEventListener("mousemove", e => { glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true });
  }
  const hero = $(".hero"), pheros = $$(".page-hero");
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? y / h * 100 : 0) + "%";
    top.classList.toggle("on", y > 700);
    if (!still) {
      if (hero) hero.style.setProperty("--py", y * 0.25 + "px");
      pheros.forEach(p => p.style.setProperty("--py", y * 0.2 + "px"));
    }
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Titres : apparition mot par mot
  $$(".hero h1,.page-hero h1").forEach(h => {
    if (h.children.length) return;
    const txt = h.textContent.trim();
    h.setAttribute("aria-label", txt);
    h.innerHTML = txt.split(/\s+/).map((w, i) =>
      `<span class="hw" aria-hidden="true"><b style="--i:${i}"${/excellence/i.test(w) ? ' class="hl"' : ""}>${w}</b></span>`).join(" ");
  });


  // Apparition au scroll (décalage progressif)
  const targets = $$(".section-copy>*,.section-head,.photo-frame,.card,.logo-row>*,.band-inner>*,.cta-inner>*,.activity-card,.portfolio-card,.team-card,.vision-points p,.contact-item,.form-card,.stat,.legal-wrap>*");
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("wx-in");
    setTimeout(() => e.target.classList.add("wx-done"), 1300);
    io.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  targets.forEach(el => {
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty("--d", (i % 4) * 110 + "ms");
    el.classList.add("wx"); io.observe(el);
  });

  // Compteurs animés
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.to, suf = el.dataset.suf || "", pre = el.dataset.prefix || "";
    co.unobserve(el);
    if (still) return;
    let t0; const f = t => {
      t0 ??= t; const p = Math.min((t - t0) / 2000, 1);
      el.textContent = pre + Math.round(to * (1 - Math.pow(2, -10 * p))) + suf;
      if (p < 1) requestAnimationFrame(f); else el.textContent = pre + to + suf;
    };
    requestAnimationFrame(f);
  }), { threshold: 0.6 });
  $$(".count").forEach(el => { el.textContent = (el.dataset.prefix || "") + "0" + (el.dataset.suf || ""); co.observe(el); });

  // Cartes : inclinaison 3D + projecteur lumineux ; boutons magnétiques
  if (fine && !still) {
    $$(".card,.portfolio-card,.team-card").forEach(c => {
      c.classList.add("tilt");
      c.addEventListener("mousemove", e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty("--ry", (x - .5) * 9 + "deg"); c.style.setProperty("--rx", (.5 - y) * 9 + "deg");
        c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%");
      });
      c.addEventListener("mouseleave", () => { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
    });
    $$(".activity-card").forEach(c => c.addEventListener("mousemove", e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (e.clientX - r.left) / r.width * 100 + "%"); c.style.setProperty("--my", (e.clientY - r.top) / r.height * 100 + "%");
    }));
    $$(".button").forEach(b => {
      b.addEventListener("mousemove", e => {
        const r = b.getBoundingClientRect();
        b.style.setProperty("--bx", (e.clientX - r.left - r.width / 2) * .22 + "px"); b.style.setProperty("--by", (e.clientY - r.top - r.height / 2) * .32 + "px");
      });
      b.addEventListener("mouseleave", () => { b.style.setProperty("--bx", "0px"); b.style.setProperty("--by", "0px"); });
    });
  }

  // Transition douce entre les pages
  $$('a[href$=".html"],a[href*=".html#"]').forEach(a => a.addEventListener("click", e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.pathname === location.pathname) return;
    e.preventDefault(); body.classList.add("wx-leave");
    setTimeout(() => (location.href = a.href), 280);
  }));
  addEventListener("pageshow", () => body.classList.remove("wx-leave"));
})();
