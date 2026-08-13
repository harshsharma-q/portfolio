const data = window.SITE_CONTENT || {};
const publicationYear = item => {
  const years = String(item.journal || "").match(/(?:19|20)\d{2}/g);
  return Number(years?.at(-1) || item.year || 0);
};
const papers = [...(window.PUBLICATIONS || [])].sort((a,b) => publicationYear(b) - publicationYear(a));
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]);
const page = document.body.dataset.page || "about";
const nav = [["about","index.html","About"],["background","background.html","Background"],["activities","activities.html","Talks & Events"],["publications","publications.html","Publications"],["contact","contact.html","Contact"]];

document.querySelector("#site-header").innerHTML = `<a class="brand" href="index.html"><strong>Harsh Sharma</strong><small>Quantum Researcher</small></a><button class="menu-button" aria-expanded="false" aria-controls="primary-nav">Menu</button><nav id="primary-nav" aria-label="Primary navigation">${nav.map(([id,url,label]) => `<a href="${url}"${page===id?' aria-current="page"':''}>${label}</a>`).join("")}</nav>`;
document.querySelector("#site-footer").innerHTML = `<div><strong>Harsh Sharma</strong><span>Quantum Information · Quantum Thermodynamics</span></div><div><a href="mailto:${esc(data.profile.email)}">${esc(data.profile.email)}</a><span>© ${new Date().getFullYear()}</span></div>`;

const menu = document.querySelector(".menu-button");
menu.addEventListener("click", () => { const open = menu.getAttribute("aria-expanded") === "true"; menu.setAttribute("aria-expanded", String(!open)); document.querySelector("#primary-nav").classList.toggle("open", !open); });

const setText = (selector,value) => document.querySelectorAll(selector).forEach(el => el.textContent=value);
setText("[data-introduction]",data.profile.introduction); setText("[data-perspective]",data.profile.perspective); setText("[data-perspective-note]",data.profile.perspectiveNote); setText("[data-availability]",data.profile.availability); setText("[data-location]",data.profile.location); setText("[data-role]",`${data.profile.role}, ${data.profile.institution}`);
document.querySelectorAll("[data-email]").forEach(el => { el.textContent=data.profile.email; el.href=`mailto:${data.profile.email}`; });
[["[data-linkedin]",data.links.linkedin],["[data-orcid]",data.links.orcid],["[data-arxiv]",data.links.arxiv]].forEach(([selector,url]) => document.querySelectorAll(selector).forEach(el => el.href=url));

const mount = (selector,html) => { const el=document.querySelector(selector); if(el) el.innerHTML=html; };
mount("#interests",data.researchInterests.map(x=>`<span>${esc(x)}</span>`).join(""));
mount("#focus-grid",data.researchInterests.map((x,i)=>`<article><span>${String(i+1).padStart(2,"0")}</span><h3>${esc(x)}</h3></article>`).join(""));
mount("#updates-list",(data.updates||[]).map(x=>`<article><time>${esc(x.date)}</time><div><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p></div><a href="${esc(x.url)}" target="_blank" rel="noreferrer" aria-label="Open ${esc(x.title)}">↗</a></article>`).join(""));
const detail = (x,education) => `<article><time>${esc(x.period||x.year)}</time><div><h3>${esc(x.degree||x.title)}</h3><p>${esc(x.institution||x.organization)}</p>${education&&x.detail?`<small>${esc(x.detail)}</small>`:""}</div></article>`;
mount("#education-list",data.education.map(x=>detail(x,true)).join("")); mount("#awards-list",data.awards.map(x=>detail(x,false)).join(""));
mount("#events",data.presentations.map(x=>`<article class="activity"><div class="activity-meta"><time>${esc(x.year)}</time><span>${esc(x.type)}</span></div><div><h3>${esc(x.event)}</h3><p>${esc(x.venue)}</p>${x.title?`<strong>${esc(x.title)}</strong>`:""}</div><div class="activity-links">${x.eventUrl?`<a href="${esc(x.eventUrl)}" target="_blank" rel="noreferrer">${esc(x.eventLabel||"Event website")} ↗</a>`:""}${x.videoUrl?`<a class="video" href="${esc(x.videoUrl)}" target="_blank" rel="noreferrer">Watch video ▶</a>`:""}</div></article>`).join(""));
mount("#all-publications",papers.map((x,i)=>`<article class="publication"><span>${String(i+1).padStart(2,"0")}</span><div><p class="publication-status">${x.journal?`<b>Published</b> · ${esc(x.journal)}`:`<b>Preprint</b> · arXiv:${esc(x.id)} · ${esc(x.year)}`}</p><h3>${esc(x.title)}</h3><small>${esc(x.authors)}</small><div><a href="https://arxiv.org/abs/${encodeURIComponent(x.id)}" target="_blank" rel="noreferrer">arXiv ↗</a><a href="https://arxiv.org/pdf/${encodeURIComponent(x.id)}" target="_blank" rel="noreferrer">PDF ↓</a>${x.doi?`<a href="https://doi.org/${encodeURIComponent(x.doi)}" target="_blank" rel="noreferrer">Journal / DOI ↗</a>`:""}</div></div></article>`).join(""));
