const content = window.SITE_CONTENT;
const publications = window.PUBLICATIONS || [];
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[character]);
const setText = (selector, value) => { const element = document.querySelector(selector); if (element) element.textContent = value; };
const setLink = (selector, href) => { const element = document.querySelector(selector); if (element) element.href = href; };

function projectCard(project, index) {
  return `<article class="card"><div class="card-meta"><span>${String(index + 1).padStart(2,"0")}</span><small>${escapeHtml(project.tag)}</small></div><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p><a href="https://arxiv.org/abs/${encodeURIComponent(project.arxiv)}" target="_blank" rel="noreferrer">View research <b>↗</b></a></article>`;
}
function paperCard(paper, index) {
  return `<article class="pub"><small>${String(index + 1).padStart(2,"0")}</small><div><i>${escapeHtml(paper.journal || `arXiv:${paper.id}`)} · ${escapeHtml(paper.year)}</i><h3>${escapeHtml(paper.title)}</h3><p>${escapeHtml(paper.authors)}</p></div><div class="pub-actions"><a href="https://arxiv.org/abs/${encodeURIComponent(paper.id)}" target="_blank" rel="noreferrer">Abstract ↗</a><a href="https://arxiv.org/pdf/${encodeURIComponent(paper.id)}" target="_blank" rel="noreferrer">PDF ↓</a></div></article>`;
}
function backgroundItem(item, education = false) {
  return `<article><small>${escapeHtml(item.period || item.year)}</small><div><b>${escapeHtml(item.degree || item.title)}</b><p>${escapeHtml(item.institution || item.organization)}</p>${education && item.detail ? `<i>${escapeHtml(item.detail)}</i>` : ""}</div></article>`;
}
function presentationItem(item) {
  return `<article><b>${escapeHtml(item.year)}</b><small>${escapeHtml(item.type)}</small><div><h3>${escapeHtml(item.event)}</h3><p>${escapeHtml(item.venue)}</p>${item.title ? `<i>${escapeHtml(item.title)}</i>` : ""}</div></article>`;
}

setText("[data-name]", content.profile.name);
setText("[data-role]", `${content.profile.role} · ${content.profile.institution}`);
setText("[data-introduction]", content.profile.introduction);
setText("[data-perspective]", `“${content.profile.perspective}”`);
setText("[data-perspective-note]", content.profile.perspectiveNote);
setText("[data-availability]", content.profile.availability);
setText("[data-location]", content.profile.location);
document.querySelectorAll("[data-email]").forEach(element => { element.textContent = content.profile.email; element.href = `mailto:${content.profile.email}`; });
setLink("[data-linkedin]", content.links.linkedin); setLink("[data-orcid]", content.links.orcid); setLink("[data-arxiv]", content.links.arxiv);

const selectedProjects = content.projects.filter(project => project.selected);
document.querySelector("#project-cards")?.insertAdjacentHTML("beforeend", selectedProjects.map(projectCard).join(""));
document.querySelector("#all-projects")?.insertAdjacentHTML("beforeend", content.projects.map(projectCard).join(""));
document.querySelector("#publication-list")?.insertAdjacentHTML("beforeend", publications.slice(0,4).map(paperCard).join(""));
document.querySelector("#all-publications")?.insertAdjacentHTML("beforeend", publications.map(paperCard).join(""));
document.querySelector("#education-list")?.insertAdjacentHTML("beforeend", content.education.map(item => backgroundItem(item,true)).join(""));
document.querySelector("#awards-list")?.insertAdjacentHTML("beforeend", content.awards.map(item => backgroundItem(item)).join(""));
document.querySelector("#events")?.insertAdjacentHTML("beforeend", content.presentations.map(presentationItem).join(""));
document.querySelector("#selected-events")?.insertAdjacentHTML("beforeend", content.presentations.filter(item => item.selected).slice(0,3).map(presentationItem).join(""));
document.querySelector("#interests")?.insertAdjacentHTML("beforeend", content.researchInterests.map(item => `<span>${escapeHtml(item)}</span>`).join(""));
