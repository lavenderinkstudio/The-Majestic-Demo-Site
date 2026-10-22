/* A small scroll-snap slider. Swiping is the browser's own horizontal scroll;
   buttons, thumbnails and arrow keys move it, and the current slide is read back
   from the scroll position.

   Markup: [data-slider] > .slider__track > .slider__slide…
   Optional: [data-slider-prev], [data-slider-next], [data-slider-thumb]…, [data-slider-count] */

import { $, $$, reducedMotion } from "./ui.js";

export function createSlider(root, { onChange } = {}) {
  const track = $(".slider__track", root);
  const slides = $$(".slider__slide", track);
  const thumbs = $$("[data-slider-thumb]", root);
  const count = $("[data-slider-count]", root);
  const prev = $("[data-slider-prev]", root);
  const next = $("[data-slider-next]", root);
  let index = 0;

  slides.forEach((slide, i) => {
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${i + 1} of ${slides.length}`);
  });

  function update(i) {
    if (i === index && root.dataset.ready) return;
    index = i;
    root.dataset.ready = "true";
    thumbs.forEach((t, n) => t.setAttribute("aria-current", n === i ? "true" : "false"));
    if (count) count.textContent = `${String(i + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === slides.length - 1;
    const thumb = thumbs[i];
    if (thumb && thumb.parentElement) {
      const strip = thumb.parentElement;
      const left = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2;
      strip.scrollTo({ left, behavior: reducedMotion() ? "auto" : "smooth" });
    }
    if (onChange) onChange(i);
  }

  function goTo(i) {
    const n = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: slides[n].offsetLeft - track.offsetLeft, behavior: reducedMotion() ? "auto" : "smooth" });
    update(n);
  }

  let frame = 0;
  track.addEventListener("scroll", () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => update(Math.round(track.scrollLeft / track.clientWidth)));
  }, { passive: true });

  if (prev) prev.addEventListener("click", () => goTo(index - 1));
  if (next) next.addEventListener("click", () => goTo(index + 1));
  thumbs.forEach((t, i) => t.addEventListener("click", () => goTo(i)));

  track.tabIndex = 0;
  track.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1); }
    if (e.key === "Home") { e.preventDefault(); goTo(0); }
    if (e.key === "End") { e.preventDefault(); goTo(slides.length - 1); }
  });

  update(0);
  return { goTo, get index() { return index; }, slides };
}
