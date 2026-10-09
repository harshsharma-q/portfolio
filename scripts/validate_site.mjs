import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scripts = ["assets/content.js", "assets/sheet-config.js", "assets/publications.js", "assets/site.js"];
const redirects = {
  "research.html": "index.html#publications",
  "publications.html": "index.html#publications",
  "activities.html": "index.html#talks",
  "background.html": "index.html#background",
  "contact.html": "index.html#contact",
};
const errors = [];

const index = await readFile(path.join(root, "index.html"), "utf8");
for (const required of ["<title>", 'name="description"', 'rel="canonical"', 'id="main"', 'id="publications"', 'id="talks"', 'id="background"', 'id="contact"', ...scripts]) {
  if (!index.includes(required)) errors.push(`index.html: missing ${required}`);
}
if (index.includes("private/")) errors.push("index.html: public page references private owner tools");
const ids = [...index.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicates = ids.filter((id, position) => ids.indexOf(id) !== position);
if (duplicates.length) errors.push(`index.html: duplicate ids ${[...new Set(duplicates)].join(", ")}`);
for (const [, reference] of index.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  if (/^(?:https?:|mailto:|#|data:)/.test(reference)) continue;
  const local = reference.split(/[?#]/)[0];
  if (!local) continue;
  try { await access(path.join(root, local)); }
  catch { errors.push(`index.html: missing local reference ${local}`); }
}
const order = scripts.map(item => index.indexOf(item));
if (!order.every((value, position) => value >= 0 && (position === 0 || value > order[position - 1]))) errors.push("index.html: data scripts are out of order");

const content = await readFile(path.join(root, "assets/content.js"), "utf8");
try {
  const data = JSON.parse(content.slice(content.indexOf("{"), content.lastIndexOf("}") + 1));
  for (const key of ["profile", "publications", "talks", "education", "awards", "qualifications"]) {
    if (!(key in data)) errors.push(`assets/content.js: missing "${key}"`);
  }
} catch (error) {
  errors.push(`assets/content.js: content is not valid JSON (${error.message})`);
}

for (const [page, target] of Object.entries(redirects)) {
  try {
    const source = await readFile(path.join(root, page), "utf8");
    if (!source.includes(`url=${target}`)) errors.push(`${page}: should redirect to ${target}`);
  } catch {
    errors.push(`${page}: redirect page is missing`);
  }
}

const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
if (!sitemap.includes("<loc>https://harshsharma-q.github.io/portfolio/</loc>")) errors.push("sitemap.xml: missing the site root");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated index.html, local assets, content data, ${Object.keys(redirects).length} redirects, and the sitemap.`);
