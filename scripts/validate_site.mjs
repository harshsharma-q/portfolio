import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pages = ["index.html", "research.html", "background.html", "activities.html", "publications.html", "contact.html"];
const errors = [];

for (const page of pages) {
  const source = await readFile(path.join(root, page), "utf8");
  for (const required of ["<title>", 'name="description"', 'rel="canonical"', 'id="site-header"', 'id="site-footer"', "assets/content.js", "assets/sheet-config.js", "assets/publications.js", "assets/site.js"]) {
    if (!source.includes(required)) errors.push(`${page}: missing ${required}`);
  }
  if (source.includes("private/")) errors.push(`${page}: public page references private owner tools`);
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) errors.push(`${page}: duplicate ids ${[...new Set(duplicates)].join(", ")}`);
  const references = [...source.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(match => match[1]);
  for (const reference of references) {
    if (/^(?:https?:|mailto:|#|data:)/.test(reference)) continue;
    const clean = reference.split(/[?#]/)[0];
    if (!clean) continue;
    try { await access(path.resolve(root, path.dirname(page), clean)); }
    catch { errors.push(`${page}: missing local reference ${clean}`); }
  }
  const scriptOrder = ["assets/content.js", "assets/sheet-config.js", "assets/publications.js", "assets/site.js"].map(item => source.indexOf(item));
  if (!scriptOrder.every((value, index) => value >= 0 && (index === 0 || value > scriptOrder[index - 1]))) errors.push(`${page}: data scripts are out of order`);
}

const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
for (const page of pages) {
  const url = page === "index.html" ? "https://harshsharma-q.github.io/portfolio/" : `https://harshsharma-q.github.io/portfolio/${page}`;
  if (!sitemap.includes(url)) errors.push(`sitemap.xml: missing ${url}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${pages.length} public pages, local assets, canonical metadata, script order, and sitemap entries.`);
