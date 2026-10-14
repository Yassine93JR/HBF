/* HBF — diaporama d'accueil : fondu + zoom lent, compteur 01/03, progression, swipe, flèches, bouton « découvrir la suite » */
(() => {
  const hero = document.querySelector(".hero");
  const slides = [...document.querySelectorAll(".hs")];
  if (!hero || slides.length < 2) return;
  const $ = s => hero.querySelector(s), $$ = s => [...hero.querySelectorAll(s)];
  const segs = $$(".hero-seg button"), caps = $$(".hc-cap span"), roll = $(".hc-roll");
  const still = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const DUR = 4000;
  let idx = 0;
  // minuterie pilotée en JS : fonctionne même si les animations CSS sont désactivées
  let elapsed = 0, last = null, paused = false;
  const fill = (n, p) => { segs[n].firstElementChild.style.transform = `scaleX(${p})`; };
  const show = i => {
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("is-active", n === idx));
    caps.forEach((c, n) => c.classList.toggle("on", n === idx));
    segs.forEach((b, n) => { b.classList.toggle("on", n === idx); b.classList.toggle("done", n < idx); b.setAttribute("aria-current", n === idx); fill(n, n < idx ? 1 : 0); });
    roll && roll.style.setProperty("--n", idx);
    elapsed = 0;
  };
  const tick = t => {
    if (!paused && last !== null) elapsed += Math.min(t - last, 100);   // ignore les gros sauts (onglet en veille)
    last = t;
    const p = Math.min(elapsed / DUR, 1);
    fill(idx, p);
    if (p >= 1) show(idx + 1);
    requestAnimationFrame(tick);
  };
  segs.forEach((b, i) => b.addEventListener("click", () => show(i)));
  $(".hero-slide-prev")?.addEventListener("click", () => show(idx - 1));
  $(".hero-slide-next")?.addEventListener("click", () => show(idx + 1));

  // pause UNIQUEMENT si l'onglet est masqué ou si le hero n'est plus à l'écran — jamais au survol de la souris
  let vis = true;
  const sync = () => { paused = !vis || document.hidden; };
  document.addEventListener("visibilitychange", sync);
  new IntersectionObserver(([e]) => { vis = e.intersectionRatio > .15; sync(); }, { threshold: [0, .15, .5] }).observe(hero);

  // swipe tactile + clavier
  let x0 = null;
  hero.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", e => {
    if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
  }, { passive: true });
  addEventListener("keydown", e => {
    if (!vis || /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === "ArrowRight") show(idx + 1); if (e.key === "ArrowLeft") show(idx - 1);
  });

  // bouton « découvrir la suite » : la page glisse vers la section suivante
  let raf;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const glide = (to, ms = 1150) => {
    if (still) return scrollTo(0, to);
    const root = document.documentElement, from = scrollY, d = to - from, prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto"; let t0;
    const end = () => { cancelAnimationFrame(raf); root.style.scrollBehavior = prev; removeEventListener("wheel", end); removeEventListener("touchstart", end); };
    addEventListener("wheel", end, { passive: true }); addEventListener("touchstart", end, { passive: true });
    const f = t => { t0 ??= t; const p = Math.min((t - t0) / ms, 1); scrollTo(0, from + d * ease(p)); p < 1 ? (raf = requestAnimationFrame(f)) : end(); };
    raf = requestAnimationFrame(f);
  };
  $(".hero-down").addEventListener("click", () => {
    const next = document.querySelector(".stats-band + .section") || document.querySelector(".stats-band");
    const h = document.querySelector(".site-header").offsetHeight;
    glide(next.getBoundingClientRect().top + scrollY - h + 1);
  });

  show(0);
  requestAnimationFrame(tick);
})();
