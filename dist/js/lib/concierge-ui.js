/* The concierge panel.
   Each question goes to /api/concierge first (Claude, when the site has a key).
   If that isn't available, or fails, or takes more than 8 seconds, the local matcher
   answers instead. A small label says which one replied.
   The conversation lasts for the browser tab (sessionStorage). */

import { PROPERTIES, getProperty } from "../data/properties.js";
import { recommend } from "./concierge-engine.js";
import { getShortlist } from "./favourites.js";
import { picture } from "./images.js";
import { formatPrice } from "./format.js";
import { $, $$, esc, ICONS, heartButton, reducedMotion } from "./ui.js";

const STORE = "majestic:concierge";
const API_OFF = "majestic:concierge-local";
const API_URL = "/api/concierge";
const TIMEOUT = 8000;
const QUICK = ["Sea-facing weekend home", "Heritage with character", "Under ₹20 Cr", "For a family of five", "Based on my shortlist"];
const MODE_LABEL = { ai: "Concierge · AI", local: "Concierge · smart match" };

let dialog, log, input, modeEl;
let messages = [];
let busy = false;
let opener = null;

function load() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE));
    if (Array.isArray(saved)) messages = saved.filter(m => m && typeof m.text === "string").slice(-30);
  } catch (e) { /* start fresh */ }
}

function save() {
  try { sessionStorage.setItem(STORE, JSON.stringify(messages.slice(-30))); } catch (e) { /* tab memory only */ }
}

function apiOff() {
  try { return sessionStorage.getItem(API_OFF) === "1"; } catch (e) { return false; }
}

function markApiOff() {
  try { sessionStorage.setItem(API_OFF, "1"); } catch (e) { /* ask again next time */ }
}

function greeting() {
  const h = new Date().getHours();
  const part = h < 5 ? "Good evening" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${part}. Tell me what you're hoping for: a place, a feeling, a budget. I'll suggest residences from the collection, and say why each one might suit you.`;
}

function miniCard({ id, reason }) {
  const p = getProperty(id);
  if (!p) return "";
  return `<article class="mini" data-vt-scope>
    <div class="frame">${picture(p.images[0].slot, { alt: "", sizes: "96px", width: 800 })}</div>
    <div class="mini__body">
      <h3 class="mini__title serif"><a href="residence.html?id=${esc(p.id)}">${esc(p.name)}</a></h3>
      <p class="mini__meta">${esc(p.city)} · ${esc(formatPrice(p))} · ${p.beds} bedrooms</p>
      <p class="mini__reason">${esc(reason)}</p>
    </div>
    ${heartButton(p, "heart--bare")}
  </article>`;
}

function messageHTML(m) {
  const bot = m.role !== "user";
  const picks = bot && m.picks && m.picks.length ? `<div class="msg__picks">${m.picks.map(miniCard).join("")}</div>` : "";
  const note = bot && m.picks && m.picks.length ? `<p class="msg__note">An adviser can arrange viewings of any of these.</p>` : "";
  return `<li class="msg msg--${bot ? "bot" : "user"}"><span class="msg__who">${bot ? "Concierge" : "You"}</span><p class="msg__text">${esc(m.text)}</p>${picks}${note}</li>`;
}

function render() {
  log.innerHTML = messageHTML({ role: "assistant", text: greeting() }) + messages.map(messageHTML).join("");
  const last = [...messages].reverse().find(m => m.mode);
  setMode(last ? last.mode : null);
  scrollDown();
}

function append(m) {
  log.insertAdjacentHTML("beforeend", messageHTML(m));
  scrollDown();
}

function scrollDown() {
  requestAnimationFrame(() => log.scrollTo({ top: log.scrollHeight, behavior: reducedMotion() ? "auto" : "smooth" }));
}

function setMode(mode) {
  modeEl.textContent = MODE_LABEL[mode] || "Concierge";
}

// Assistant turns carry their picks as text, so the model knows what it already suggested
function toApiMessages() {
  return messages.slice(-12).map(m => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.role === "user" || !m.picks || !m.picks.length
      ? m.text
      : m.text + "\n[Suggested: " + m.picks.map(p => (getProperty(p.id) || {}).name).filter(Boolean).join(", ") + "]"
  }));
}

async function askApi() {
  if (apiOff() || location.protocol === "file:") return null;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: toApiMessages(), shortlist: getShortlist() }),
      signal: AbortSignal.timeout(TIMEOUT)
    });
    // No endpoint here, or no key: stop asking for the rest of the visit
    if ([404, 405, 501, 503].includes(res.status)) { markApiOff(); return null; }
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.offline) { markApiOff(); return null; }
    if (!data || typeof data.reply !== "string" || !data.reply.trim()) return null;
    const picks = (Array.isArray(data.picks) ? data.picks : [])
      .filter(p => p && getProperty(p.id))
      .slice(0, 3)
      .map(p => ({ id: p.id, reason: String(p.reason || "").slice(0, 240) }));
    return { reply: data.reply.slice(0, 1200), picks, mode: "ai" };
  } catch (e) {
    if (e && e.name === "TimeoutError") markApiOff();
    return null;
  }
}

function askLocal() {
  const said = messages.filter(m => m.role === "user").map(m => m.text);
  const answer = recommend(said, { properties: PROPERTIES, shortlist: getShortlist() });
  return { reply: answer.reply, picks: answer.picks, mode: "local" };
}

async function send(raw) {
  const text = String(raw || "").trim().slice(0, 1000);
  if (!text || busy) return;
  busy = true;
  input.value = "";
  sizeInput();
  const user = { role: "user", text };
  messages.push(user);
  append(user);
  save();

  log.insertAdjacentHTML("beforeend", `<li class="msg msg--bot" data-typing><span class="msg__who">Concierge</span><span class="typing" aria-label="Thinking"><span></span><span></span><span></span></span></li>`);
  scrollDown();
  const started = Date.now();
  const answer = (await askApi()) || askLocal();
  // A short, natural pause before a local answer appears
  const wait = reducedMotion() ? 0 : Math.max(0, 650 - (Date.now() - started));
  await new Promise(r => setTimeout(r, wait));

  const typing = $("[data-typing]", log);
  if (typing) typing.remove();
  const reply = { role: "assistant", text: answer.reply, picks: answer.picks, mode: answer.mode };
  messages.push(reply);
  append(reply);
  setMode(answer.mode);
  save();
  busy = false;
}

function sizeInput() {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 140) + "px";
}

function build() {
  dialog = document.createElement("dialog");
  dialog.className = "concierge";
  dialog.setAttribute("aria-labelledby", "concierge-title");
  dialog.innerHTML = `
    <div class="concierge__head">
      <span class="concierge__mode" data-mode>Concierge</span>
      <h2 id="concierge-title">How would you like to live?</h2>
      <button class="round-btn" type="button" data-close aria-label="Close the concierge">${ICONS.close}</button>
    </div>
    <ol class="concierge__log" role="log" aria-label="Conversation with the concierge"></ol>
    <div class="concierge__foot">
      <div class="concierge__quick" role="group" aria-label="Suggested questions">
        ${QUICK.map(q => `<button type="button" class="chip" data-quick>${esc(q)}</button>`).join("")}
      </div>
      <form class="concierge__form">
        <label class="visually-hidden" for="concierge-input">Describe what you're looking for</label>
        <textarea id="concierge-input" rows="1" maxlength="1000" placeholder="A quiet house by the sea, under ₹40 Cr…"></textarea>
        <button class="round-btn round-btn--lg" type="submit" aria-label="Send">${ICONS.send}</button>
      </form>
      <p class="concierge__small">Picks come only from the eight residences here. In AI mode your messages are sent to Claude to choose them, and nothing is kept. <button type="button" class="clear-btn" data-reset>Start over</button></p>
    </div>`;
  document.body.appendChild(dialog);

  log = $(".concierge__log", dialog);
  input = $("textarea", dialog);
  modeEl = $("[data-mode]", dialog);

  $("[data-close]", dialog).addEventListener("click", () => dialog.close());
  $("form", dialog).addEventListener("submit", e => { e.preventDefault(); send(input.value); });
  input.addEventListener("input", sizeInput);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(input.value); }
  });
  $$("[data-quick]", dialog).forEach(b => b.addEventListener("click", () => send(b.textContent)));
  $("[data-reset]", dialog).addEventListener("click", () => {
    messages = [];
    save();
    render();
    input.focus();
  });
  // A click on the dimmed backdrop closes the panel
  dialog.addEventListener("click", e => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => { if (opener && opener.isConnected) opener.focus(); });
  // Following a residence link from the panel
  log.addEventListener("click", e => { if (e.target.closest("a")) dialog.close(); });

  load();
  render();
}

export function openConcierge(prompt) {
  if (!dialog) build();
  opener = document.activeElement;
  if (!dialog.open) dialog.showModal();
  scrollDown();
  if (prompt) send(prompt);
  else input.focus();
}

export function initConcierge() {
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-concierge-open]");
    if (!btn) return;
    e.preventDefault();
    openConcierge(btn.dataset.conciergePrompt || "");
  });
}
