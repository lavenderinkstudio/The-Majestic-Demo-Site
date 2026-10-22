/* Runs in <head>, before first paint.
   js-motion turns on the hidden starting states in the CSS. It's never set for visitors
   who prefer reduced motion, and it's removed again if the motion engine (GSAP from
   cdnjs) hasn't set up within a few seconds, so nothing can stay hidden. */
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  root.classList.add("js-motion");
  setTimeout(function () {
    if (!root.classList.contains("motion-ready")) root.classList.remove("js-motion");
  }, 4000);
})();
