/**
 * Load, validate, resolve and render image prompts.
 *
 * Resolution cascade, first hit wins:  prompt -> set -> project -> meta.defaults
 *
 * The prompt builder only CONCATENATES AUTHORED SENTENCES; it never invents prose.
 * Anything that has to read as English (a set description, a backdrop) is written by
 * a human in the JSON and appended verbatim. That keeps the rendered prompt reviewable
 * and stops the script from becoming a second, hidden art director.
 */
import { readFileSync } from "node:fs";

export const CUTOUT_SUFFIX = "-cutout";

/** Read + validate the prompt file. Throws on the mistakes that are silent otherwise. */
export function loadPromptData(file) {
  const data = JSON.parse(readFileSync(file, "utf8"));
  if (!data.projects || typeof data.projects !== "object") throw new Error(`${file}: missing "projects"`);
  if (!Array.isArray(data.prompts)) throw new Error(`${file}: missing "prompts" array`);
  const seen = new Set();
  for (const p of data.prompts) {
    if (!p.id) throw new Error(`${file}: a prompt has no id`);
    if (seen.has(p.id)) throw new Error(`${file}: duplicate prompt id "${p.id}"`);
    seen.add(p.id);
    if (!p.subject) throw new Error(`${file}: prompt "${p.id}" has no subject`);
  }
  return data;
}

/** prompt -> set -> project -> meta.defaults */
export function resolvePrompt(prompt, data) {
  const project = data.projects[prompt.project];
  if (!project) throw new Error(`prompt "${prompt.id}": unknown project "${prompt.project}"`);
  const set = prompt.set ? data.sets?.[prompt.set] : undefined;
  if (prompt.set && !set) throw new Error(`prompt "${prompt.id}": unknown set "${prompt.set}"`);
  const defaults = data.meta?.defaults ?? {};
  const pick = (key, fallback) =>
    prompt[key] ?? set?.[key] ?? project[key] ?? defaults[key] ?? fallback;

  const style = pick("style");
  if (!style) throw new Error(`prompt "${prompt.id}": no style on the prompt, set, project or defaults`);

  return {
    id: prompt.id,
    project: prompt.project,
    slot: prompt.slot ?? null,
    subject: prompt.subject,
    style,
    palette: pick("palette", {}),
    paletteMode: pick("paletteMode", "hex"),
    size: pick("size", "1536x1024"),
    quality: pick("quality", "low"),
    cutout: pick("cutout", false) === true,
    noText: pick("noText", true) !== false,
    // Authored sentences, appended verbatim in this order.
    sentences: [set?.description, pick("backdrop"), prompt.note].filter(Boolean),
  };
}

const period = (s) => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

/** The exact text sent to the model. Keep any UI copy of this byte-identical. */
export function buildPrompt(r) {
  const article = /^[aeiou]/i.test(r.style) ? "An" : "A";
  const sentences = [`${article} ${r.style} of ${r.subject}.`];
  for (const s of r.sentences) sentences.push(period(s));
  // The model bakes in garbled lettering otherwise. Brand names belong in the DOM.
  if (r.noText) sentences.push("No text, letters, numbers, or logos.");
  const head = sentences.join(" ");

  const entries = Object.entries(r.palette ?? {});
  if (!entries.length) return head;

  // A hex list is a constraint a flat graphic style can satisfy; a photograph needs
  // each colour anchored to a material before it has any purchase.
  const header =
    r.paletteMode === "scene"
      ? "Palette - render these as the scene's real materials, surfaces, and light:"
      : "Palette - use these colours and no others:";
  const lines = entries.map(([name, v]) =>
    typeof v === "string" ? `${name}: ${v}` : `${name}: ${v.hex}${v.as ? ` - ${v.as}` : ""}`,
  );
  return `${head}\n\n${header}\n${lines.join("\n")}`;
}

/** The slug the site actually serves: the cut-out when there is one. */
export function servedSlug(resolved) {
  return resolved.cutout ? `${resolved.id}${CUTOUT_SUFFIX}` : resolved.id;
}

/** Resolved prompts matching the usual CLI filters. */
export function selectPrompts(data, { only = null, project = null, slot = null, cutout = null } = {}) {
  let list = data.prompts;
  if (only) list = list.filter((p) => only.includes(p.id));
  if (project) list = list.filter((p) => p.project === project);
  const resolved = list.map((p) => resolvePrompt(p, data));
  const filtered = resolved
    .filter((r) => (slot ? r.slot === slot : true))
    .filter((r) => (cutout === null ? true : r.cutout === cutout));
  return filtered.map((r) => ({ ...r, prompt: buildPrompt(r) }));
}
