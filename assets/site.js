const content = window.SITE_CONTENT || {};
const publications = window.PUBLICATIONS || [];
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const $ = selector => document.querySelector(selector);
const put = (selector, value) => { const node = $(selector); if (node) node.textContent = value; };
const link = (selector, href) => document.querySelectorAll(selector).forEach(node => node.href = href);
const mount = (selector, markup) => { const node = $(selector); if (node) node.innerHTML = markup; };

function projectCard(project, index) {
  return `<article class="project-card">
    <div class="project-number">${String(index + 1).padStart(2, "0")}</div>
    <div class="project-body"><p class="project-tag">${esc(project.tag)}</p><h3>${esc(project.title)}</h3><p>${esc(project.description)}</p></div>
    <a href="https://arxiv.org/abs/${encodeURIComponent(project.arxiv)}" target="_blank" rel="noreferrer" aria-label="Read ${esc(project.title)} on arXiv"><span>arXiv:${esc(project.arxiv)}</span><b>↗</b></a>
  </article>`;
}

function paperCard(paper, index) {
  return `<article class="paper-row">
    <span class="paper-number">${String(index + 1).padStart(2, "0")}</span>
    <div class="paper-body"><p>${esc(paper.journal || `arXiv:${paper.id}`)} · ${esc(paper.year)}</p><h3>${esc(paper.title)}</h3><small>${esc(paper.authors)}</small></div>
    <div class="paper-actions"><a href="https://arxiv.org/abs/${encodeURIComponent(paper.id)}" target="_blank" rel="noreferrer">Abstract ↗</a><a href="https://arxiv.org/pdf/${encodeURIComponent(paper.id)}" target="_blank" rel="noreferrer">PDF ↓</a></div>
  </article>`;
}

function detailItem(item, education = false) {
  return `<article class="detail-item"><span>${esc(item.period || item.year)}</span><div><h4>${esc(item.degree || item.title)}</h4><p>${esc(item.institution || item.organization)}</p>${education && item.detail ? `<small>${esc(item.detail)}</small>` : ""}</div></article>`;
}

function eventItem(item) {
  return `<article class="event-row"><span>${esc(item.year)}</span><small>${esc(item.type)}</small><div><h3>${esc(item.event)}</h3><p>${esc(item.venue)}</p>${item.title ? `<em>${esc(item.title)}</em>` : ""}</div></article>`;
}

if (content.profile) {
  put("[data-introduction]", content.profile.introduction);
  put("[data-perspective]", content.profile.perspective);
  put("[data-perspective-note]", content.profile.perspectiveNote);
  put("[data-location]", content.profile.location);
  document.querySelectorAll("[data-email]").forEach(node => { node.href = `mailto:${content.profile.email}`; if (!node.querySelector("span")) node.textContent = content.profile.email; });
}
if (content.links) {
  link("[data-linkedin]", content.links.linkedin);
  link("[data-orcid]", content.links.orcid);
  link("[data-arxiv]", content.links.arxiv);
}

const projects = content.projects || [];
mount("#project-cards", projects.filter(item => item.selected).map(projectCard).join(""));
mount("#all-projects", projects.map(projectCard).join(""));
mount("#publication-list", publications.slice(0, 4).map(paperCard).join(""));
mount("#all-publications", publications.map(paperCard).join(""));
mount("#education-list", (content.education || []).map(item => detailItem(item, true)).join(""));
mount("#awards-list", (content.awards || []).map(item => detailItem(item)).join(""));
mount("#selected-events", (content.presentations || []).filter(item => item.selected).slice(0, 3).map(eventItem).join(""));
mount("#events", (content.presentations || []).map(eventItem).join(""));
mount("#interests", (content.researchInterests || []).map(item => `<span>${esc(item)}</span>`).join(""));

document.querySelectorAll("#current-year, #footer-year").forEach(node => node.textContent = new Date().getFullYear());

const revealItems = document.querySelectorAll(".project-card, .paper-row, .event-row, .detail-item");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealItems.forEach(node => node.classList.add("reveal"));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); }
  }), { threshold: .08 });
  revealItems.forEach(node => observer.observe(node));
}
