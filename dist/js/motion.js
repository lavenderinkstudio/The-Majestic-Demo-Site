/* GSAP choreography. Slow, cinematic and scroll-led, never scroll-jacked.
   Nothing here runs unless boot.js set js-motion (so never under reduced motion),
   and the static page is always complete without it.

   Hooks in the markup:
     [data-hero]            hero wordmark, tagline and parallax
     [data-reveal="lines"]  heading lines rise from masks
     [data-reveal="image"]  image unmasks upwards
     [data-reveal="fade"]   element rises and fades in
     [data-reveal="stagger"] each child rises in turn
     [data-count]           number counts up once
     [data-destinations]    pinned chapter with sliced image transitions (wide screens)
     [data-closing]         the FAQ holds while the closing chapter slides over it
   Both "pins" are CSS position: sticky; GSAP only scrubs the animation. */

const root = document.documentElement;
const WIDE = "(min-width: 900px)";
let gsap, ScrollTrigger, SplitText;

export function motionEnabled() {
  return root.classList.contains("motion-ready");
}

export function initMotion() {
  if (!root.classList.contains("js-motion")) return;
  ({ gsap, ScrollTrigger, SplitText } = window);
  if (!gsap || !ScrollTrigger || !SplitText) {
    root.classList.remove("js-motion");
    return;
  }
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: "expo.out" });

  // Line splits measure text, so wait (briefly) for the web fonts
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fonts, new Promise(r => setTimeout(r, 1200))]).then(() => {
    hero();
    reveals();
    counters();
    destinations();
    curtain();
    root.classList.add("motion-ready");
    ScrollTrigger.refresh();
  });
}

const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
const shown = el => gsap.set(el, { visibility: "visible" });

/* ---------- Hero ---------- */

function hero() {
  const el = document.querySelector("[data-hero]");
  if (!el) return;
  const img = el.querySelector(".hero__media img");
  const mark = el.querySelector(".hero__mark");
  const name = el.querySelector(".hero__name");
  const the = el.querySelector(".hero__the");
  const tagline = el.querySelector(".hero__tagline");
  const lede = el.querySelector(".hero__lede");
  const line = el.querySelector(".hero__line");
  const rest = $$(".hero__intro > *:not(.hero__tagline):not(.hero__lede):not(.hero__line)", el);
  const search = el.querySelector(".search");
  // The bar's inner row slides, not the bar itself, which has its own CSS transition
  const header = document.querySelector("[data-header] .header__inner");

  shown([name, the, tagline, lede, line, search, ...rest].filter(Boolean));
  const chars = SplitText.create(name, { type: "chars", mask: "chars", charsClass: "hero-char" });
  const words = tagline && SplitText.create(tagline, { type: "words", mask: "words" });
  const lines = lede && SplitText.create(lede, { type: "lines", mask: "lines", linesClass: "split-line" });

  const tl = gsap.timeline();
  if (img) tl.from(img, { scale: 1.16, duration: 2.8, ease: "power2.out" }, 0);
  tl.from(chars.chars, { yPercent: 108, duration: 1.6, stagger: 0.055 }, 0.25)
    .from(the, { autoAlpha: 0, letterSpacing: "1.4em", duration: 1.8, ease: "power3.out" }, 0.55);
  if (header) tl.from(header, { yPercent: -100, autoAlpha: 0, duration: 1.2, clearProps: "transform" }, 0.7);
  if (words) tl.from(words.words, { yPercent: 100, rotate: 7, transformOrigin: "0% 100%", duration: 1.2, stagger: 0.05 }, 0.85);
  if (lines) tl.from(lines.lines, { yPercent: 100, duration: 1.2, stagger: 0.08 }, 0.95);
  if (line) tl.from(line, { scaleX: 0, duration: 1.6, ease: "expo.inOut" }, 0.9);
  if (rest.length) tl.from(rest, { autoAlpha: 0, y: 16, duration: 1, stagger: 0.08 }, 1.1);
  if (search) tl.from(search.children, { autoAlpha: 0, y: 20, duration: 1.1, stagger: 0.07 }, 1.15);

  // Scrolling away: the photo drifts down and swells a little, the wordmark lifts and fades
  const scrub = { trigger: el, start: "top top", end: "bottom top", scrub: true };
  if (img) gsap.to(img, { yPercent: 12, scale: 1.08, ease: "none", scrollTrigger: scrub });
  gsap.to(mark, { yPercent: -28, autoAlpha: 0.15, ease: "none", scrollTrigger: { ...scrub, start: "top+=1 top", end: "bottom 35%" } });
}

/* ---------- Section entrances ---------- */

function onEnter(el, start = "top 86%") {
  return { trigger: el, start, once: true };
}

function reveals() {
  $$('[data-reveal="lines"]').forEach(el => {
    shown(el);
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "split-line",
      autoSplit: true,
      onSplit: self => gsap.from(self.lines, { yPercent: 105, duration: 1.3, stagger: 0.09, scrollTrigger: onEnter(el) })
    });
  });

  $$('[data-reveal="image"]').forEach(el => {
    shown(el);
    const img = el.querySelector("img");
    const tl = gsap.timeline({ scrollTrigger: onEnter(el, "top 90%") });
    tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" }, 0);
    if (img) tl.from(img, { scale: 1.22, duration: 2, ease: "expo.out" }, 0.15);
  });

  $$('[data-reveal="fade"]').forEach(el => {
    gsap.fromTo(el, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.2, scrollTrigger: onEnter(el) });
  });

  $$('[data-reveal="stagger"]').forEach(el => {
    shown(el);
    gsap.from(el.children, { autoAlpha: 0, y: 28, duration: 1.1, stagger: 0.09, scrollTrigger: onEnter(el) });
  });
}

function counters() {
  const fmt = new Intl.NumberFormat("en-IN");
  $$("[data-count]").forEach(el => {
    const end = parseFloat(el.dataset.count);
    const pre = el.dataset.prefix || "";
    const post = el.dataset.suffix || "";
    const n = { v: 0 };
    gsap.to(n, {
      v: end,
      duration: 2.2,
      ease: "power2.out",
      scrollTrigger: onEnter(el, "top 92%"),
      onStart: () => { el.textContent = pre + "0" + post; },
      onUpdate: () => { el.textContent = pre + fmt.format(Math.round(n.v)) + post; }
    });
  });
}

/* ---------- Destinations: the pinned chapter ---------- */

function destinations() {
  const sec = document.querySelector("[data-destinations]");
  if (!sec) return;
  const mm = gsap.matchMedia();

  mm.add(WIDE, () => {
    const stage = sec.querySelector(".dest__stage");
    const panels = $$(".dest-panel", sec);
    const texts = panels.map(p => p.querySelector(".dest-panel__text"));
    const index = $$(".dest__index a", sec);
    const bar = sec.querySelector(".dest__progress span");
    const count = window.innerWidth >= 1200 ? 16 : 10;
    const last = panels.length - 1;
    sec.style.setProperty("--run", String(last * 1.1));
    sec.classList.add("is-pinned");

    // Each later panel's photo is rebuilt as vertical slices that rise in turn
    const layers = panels.slice(1).map(panel => {
      const media = panel.querySelector(".dest-panel__media");
      const source = media.querySelector("picture, img");
      const wrap = document.createElement("div");
      wrap.className = "dest__slices";
      wrap.setAttribute("aria-hidden", "true");
      for (let i = 0; i < count; i++) {
        const slice = document.createElement("div");
        const inner = document.createElement("div");
        const copy = source.cloneNode(true);
        const copyImg = copy.tagName === "IMG" ? copy : copy.querySelector("img");
        copyImg.alt = "";
        copyImg.loading = "eager";
        copyImg.style.setProperty("--i", i);
        copyImg.style.setProperty("--n", count);
        slice.className = "dest__slice";
        inner.className = "dest__slice-inner";
        inner.appendChild(copy);
        slice.appendChild(inner);
        wrap.appendChild(slice);
      }
      media.appendChild(wrap);
      return wrap;
    });
    // Later photos stack above earlier ones; the text sits above them all (see styles.css)
    const media = panels.map(p => p.querySelector(".dest-panel__media"));
    media.forEach((m, i) => { m.style.zIndex = String(i + 1); });

    const slicesOf = wrap => wrap.querySelectorAll(".dest__slice-inner");
    layers.forEach(w => gsap.set(slicesOf(w), { yPercent: 100 }));
    gsap.set(texts.slice(1), { autoAlpha: 0, y: 48 });

    const tl = gsap.timeline({ defaults: { ease: "none" } });
    tl.addLabel("s0").to({}, { duration: 0.3 });
    layers.forEach((wrap, k) => {
      const i = k + 1;
      const at = "t" + i;
      tl.addLabel(at)
        .to(texts[i - 1], { autoAlpha: 0, y: -48, duration: 0.3, ease: "power1.in" }, at)
        .to(slicesOf(wrap), { yPercent: 0, duration: 0.7, ease: "power3.inOut", stagger: { each: 0.03, from: k % 2 ? "end" : "start" } }, at)
        .to(texts[i], { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, at + "+=0.6")
        .addLabel("s" + i)
        .to({}, { duration: 0.3 });
    });

    let active = -1;
    const setActive = i => {
      if (i === active) return;
      active = i;
      index.forEach((a, n) => a.classList.toggle("is-active", n === i));
    };
    setActive(0);

    const st = ScrollTrigger.create({
      trigger: sec,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      animation: tl,
      snap: { snapTo: "labelsDirectional", duration: { min: 0.25, max: 0.7 }, delay: 0.08, ease: "power1.inOut" },
      onUpdate: self => {
        if (bar) bar.style.transform = `scaleX(${self.progress})`;
        const t = tl.time();
        let i = 0;
        for (let n = 1; n <= last; n++) if (t >= tl.labels["t" + n] + 0.4) i = n;
        setActive(i);
      },
      onToggle: self => root.classList.toggle("header-hidden", self.isActive)
    });

    // The index links jump to their chapter instead of leaving the page
    const jump = e => {
      const i = index.indexOf(e.currentTarget);
      if (i < 0) return;
      e.preventDefault();
      const label = tl.labels["s" + i];
      const y = st.start + (st.end - st.start) * (label / tl.duration());
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    index.forEach(a => a.addEventListener("click", jump));

    return () => {
      index.forEach(a => a.removeEventListener("click", jump));
      layers.forEach(w => w.remove());
      media.forEach(m => { m.style.zIndex = ""; });
      sec.classList.remove("is-pinned");
      sec.style.removeProperty("--run");
      root.classList.remove("header-hidden");
    };
  });
}

/* ---------- FAQ holds, the closing chapter curtains over it ---------- */

function curtain() {
  const wrap = document.querySelector("[data-closing]");
  if (!wrap) return;
  const faq = wrap.querySelector("[data-faq]");
  const cta = wrap.querySelector("[data-curtain]");
  const mm = gsap.matchMedia();
  mm.add(WIDE, () => {
    // A FAQ taller than the screen sticks by its bottom edge, so every question is seen
    const place = () => wrap.style.setProperty("--faq-top", Math.min(0, window.innerHeight - faq.offsetHeight) + "px");
    place();
    wrap.classList.add("is-curtained");
    gsap.to(faq.querySelector(".wrap"), {
      autoAlpha: 0.25,
      scale: 0.96,
      ease: "none",
      scrollTrigger: { trigger: cta, start: "top bottom", end: "top top", scrub: true }
    });
    const onToggle = () => { place(); ScrollTrigger.refresh(); };
    faq.addEventListener("toggle", onToggle, true);
    window.addEventListener("resize", place);
    return () => {
      faq.removeEventListener("toggle", onToggle, true);
      window.removeEventListener("resize", place);
      wrap.classList.remove("is-curtained");
      wrap.style.removeProperty("--faq-top");
    };
  });
}
