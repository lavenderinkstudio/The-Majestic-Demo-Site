/* The shortlist: residence ids saved in localStorage.
   Storage can be blocked (private windows, strict settings), so every access is
   guarded and the list still works in memory for the visit. */

const KEY = "majestic:shortlist";
const EVENT = "shortlist:change";
let cache = read();

function read() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(value) ? value.filter(id => typeof id === "string") : [];
  } catch (e) {
    return [];
  }
}

function write(list) {
  cache = list;
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* memory only */ }
  emit();
}

function emit() {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { ids: cache.slice() } }));
}

export function getShortlist() {
  return cache.slice();
}

export function isSaved(id) {
  return cache.includes(id);
}

// Returns the new saved state
export function toggleSaved(id) {
  const saved = isSaved(id);
  write(saved ? cache.filter(x => x !== id) : cache.concat(id));
  return !saved;
}

export function removeSaved(id) {
  if (isSaved(id)) write(cache.filter(x => x !== id));
}

export function onShortlistChange(fn) {
  window.addEventListener(EVENT, e => fn(e.detail.ids));
}

// Another tab changed the list (the guard lets Node tests import this module)
if (typeof window !== "undefined") {
  window.addEventListener("storage", e => {
    if (e.key !== KEY) return;
    cache = read();
    emit();
  });
}
