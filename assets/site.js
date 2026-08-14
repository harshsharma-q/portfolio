(async () => {
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const parseCsv = text => {
    const rows = [];
    let row = [], cell = "", quoted = false;
    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      if (char === '"' && quoted && text[index + 1] === '"') { cell += '"'; index += 1; }
      else if (char === '"') quoted = !quoted;
      else if (char === "," && !quoted) { row.push(cell); cell = ""; }
      else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && text[index + 1] === "\n") index += 1;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += char;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    const headers = (rows.shift() || []).map(header => header.trim());
    return rows
      .filter(values => values.some(value => value.trim()))
      .map(values => Object.fromEntries(headers.map((header, index) => [header, (values[index] || "").trim()])));
  };

  const loadSheetContent = async base => {
    const config = window.SHEET_CONFIG;
    if (!config?.enabled || !config.spreadsheetId) return base;
    const next = structuredClone(base);
    const fetchTab = async tab => {
      const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(config.spreadsheetId)}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`Sheet tab ${tab} returned ${response.status}`);
      return parseCsv(await response.text());
    };
    try {
      const entries = await Promise.all(Object.entries(config.tabs).map(async ([key, tab]) => [key, await fetchTab(tab)]));
      const tabs = Object.fromEntries(entries);
      (tabs.profile || []).forEach(({ section, key, value }) => {
        if (next[section] && key && value !== "") next[section][key] = value;
      });
      if (tabs.interests?.length) next.researchInterests = tabs.interests.map(row => row.label).filter(Boolean);
      ["updates", "projects", "education", "awards", "qualifications", "presentations"].forEach(key => {
        if (tabs[key]?.length) next[key] = tabs[key].map(row => ({ ...row, selected: String(row.selected).toLowerCase() === "true" }));
      });
      next.sheetConnected = true;
      return next;
    } catch (error) {
      console.warn("Google Sheets data was unavailable; using the bundled website content.", error);
      return base;
    }
  };

  const data = await loadSheetContent(window.SITE_CONTENT || {});
  const publicationYear = item => {
    const years = String(item.journal || "").match(/(?:19|20)\d{2}/g);
    return Number(years?.at(-1) || item.year || 0);
  };
  const publicationMap = new Map();
  [...(window.PUBLICATIONS || []), ...(data.manualPublications || [])].forEach(item => publicationMap.set(item.id || item.doi || item.title, { ...(publicationMap.get(item.id) || {}), ...item }));
  const papers = [...publicationMap.values()].sort((a, b) => publicationYear(b) - publicationYear(a) || String(b.id).localeCompare(String(a.id)));
  const page = document.body.dataset.page || "about";
  const nav = [
    ["about", "index.html", "About"],
    ["research", "research.html", "Research"],
    ["background", "background.html", "Background"],
    ["activities", "activities.html", "Talks & Events"],
    ["publications", "publications.html", "Publications"],
    ["contact", "contact.html", "Contact"],
  ];
  const formatDate = value => {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.valueOf()) ? value : date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };
  const mount = (selector, html) => { const element = document.querySelector(selector); if (element) element.innerHTML = html; };
  const setText = (selector, value) => document.querySelectorAll(selector).forEach(element => { element.textContent = value || ""; });
  const setLinks = (selector, url) => document.querySelectorAll(selector).forEach(element => { if (url) element.href = url; });

  mount("#site-header", `<a class="brand" href="index.html" aria-label="Harsh Sharma, home"><span class="brand-mark">HS</span><span><strong>${esc(data.profile.name)}</strong><small>Quantum information · thermodynamics</small></span></a><button class="menu-button" aria-expanded="false" aria-controls="primary-nav">Menu</button><nav id="primary-nav" aria-label="Primary navigation">${nav.map(([id, url, label]) => `<a href="${url}"${page === id ? ' aria-current="page"' : ""}>${label}</a>`).join("")}</nav>`);
  mount("#site-footer", `<div><strong>${esc(data.profile.name)}</strong><span>${esc(data.profile.department)}, IIT Bombay</span></div><div><a href="mailto:${esc(data.profile.email)}">${esc(data.profile.email)}</a><span>Updated ${esc(formatDate(data.lastUpdated))}</span><span>© ${new Date().getFullYear()}</span></div>`);

  const menu = document.querySelector(".menu-button");
  menu?.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", String(!open));
    document.querySelector("#primary-nav")?.classList.toggle("open", !open);
  });

  setText("[data-introduction]", data.profile.introduction);
  setText("[data-short-bio]", data.profile.shortBio);
  setText("[data-perspective]", data.profile.perspective);
  setText("[data-perspective-note]", data.profile.perspectiveNote);
  setText("[data-availability]", data.profile.availability);
  setText("[data-location]", data.profile.location);
  setText("[data-role]", `${data.profile.role}, ${data.profile.department}, ${data.profile.institution}`);
  setText("[data-supervisor]", data.profile.supervisor);
  setText("[data-updated]", formatDate(data.lastUpdated));
  document.querySelectorAll("[data-photo]").forEach(image => { image.src = data.profile.photo; image.alt = `${data.profile.name}, ${data.profile.role} at ${data.profile.institution}`; });
  document.querySelectorAll("[data-email]").forEach(element => { element.textContent = data.profile.email; element.href = `mailto:${data.profile.email}`; });
  [["[data-linkedin]", data.links.linkedin], ["[data-orcid]", data.links.orcid], ["[data-arxiv]", data.links.arxiv], ["[data-scholar]", data.links.scholar], ["[data-department]", data.links.department], ["[data-supervisor-link]", data.links.supervisor]].forEach(([selector, url]) => setLinks(selector, url));

  mount("#interests", (data.researchInterests || []).map(item => `<span>${esc(item)}</span>`).join(""));
  mount("#focus-grid", (data.researchInterests || []).map((item, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><h3>${esc(item)}</h3></article>`).join(""));
  mount("#profile-stats", `<article><strong>${papers.length}</strong><span>research papers</span></article><article><strong>${(data.researchThemes || []).length}</strong><span>connected themes</span></article><article><strong>${(data.presentations || []).filter(item => ["Talk", "Poster"].includes(item.type)).length}</strong><span>talks & posters</span></article>`);
  mount("#updates-list", (data.updates || []).map(item => `<article><time>${esc(item.date)}</time><div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></div><a href="${esc(item.url)}" target="_blank" rel="noreferrer" aria-label="Open ${esc(item.title)}">↗</a></article>`).join(""));

  const projectCard = item => `<article class="project-card"><p>${esc(item.tag)}</p><h3>${esc(item.title)}</h3><div><p>${esc(item.description)}</p><a href="https://arxiv.org/abs/${encodeURIComponent(item.arxiv)}" target="_blank" rel="noreferrer">Read paper <span>↗</span></a></div></article>`;
  mount("#selected-research", (data.projects || []).filter(item => item.selected).slice(0, 3).map(projectCard).join(""));
  mount("#research-projects", (data.projects || []).map(projectCard).join(""));
  mount("#research-themes", (data.researchThemes || []).map(item => `<article class="theme-card"><span>${esc(item.number)}</span><div><p>${esc(item.label)}</p><h2>${esc(item.title)}</h2><p>${esc(item.description)}</p><small>${esc(item.methods)}</small><a href="https://arxiv.org/abs/${encodeURIComponent(item.arxiv)}" target="_blank" rel="noreferrer">Related publication ↗</a></div></article>`).join(""));

  const timelineItem = item => `<article><time>${esc(item.period || item.year)}</time><div><h3>${esc(item.degree || item.title)}</h3><p>${esc(item.institution || item.organization)}</p>${item.detail ? `<small>${esc(item.detail)}</small>` : ""}</div></article>`;
  mount("#education-list", (data.education || []).map(timelineItem).join(""));
  mount("#awards-list", (data.awards || []).map(timelineItem).join(""));
  mount("#qualifications-list", (data.qualifications || []).map(timelineItem).join(""));

  const events = data.presentations || [];
  const featuredVideo = events.find(item => item.videoUrl);
  if (featuredVideo) {
    let videoId = "";
    try { const url = new URL(featuredVideo.videoUrl); videoId = url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).at(-1); } catch (_) {}
    mount("#featured-video", `<a class="video-card" href="${esc(featuredVideo.videoUrl)}" target="_blank" rel="noreferrer"><img src="https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg" alt="Video thumbnail for ${esc(featuredVideo.title)}" loading="lazy"><span class="play-button" aria-hidden="true">▶</span><div><p>Featured recording · ${esc(featuredVideo.event)}</p><h2>${esc(featuredVideo.title)}</h2><span>Watch presentation ↗</span></div></a>`);
  }
  const eventTypes = ["All", ...new Set(events.map(item => item.type))];
  mount("#event-filters", eventTypes.map((type, index) => `<button type="button" data-event-filter="${esc(type)}"${index === 0 ? ' aria-pressed="true"' : ' aria-pressed="false"'}>${esc(type)}</button>`).join(""));
  mount("#events", events.map(item => `<article class="activity" data-event-type="${esc(item.type)}"><div class="activity-meta"><time>${esc(item.year)}</time><span>${esc(item.type)}</span></div><div><h3>${esc(item.event)}</h3><p>${esc(item.venue)}</p>${item.title ? `<strong>${esc(item.title)}</strong>` : ""}</div><div class="activity-links">${item.eventUrl ? `<a href="${esc(item.eventUrl)}" target="_blank" rel="noreferrer">${esc(item.eventLabel || "Event website")} ↗</a>` : ""}${item.videoUrl ? `<a class="video" href="${esc(item.videoUrl)}" target="_blank" rel="noreferrer">Watch video ▶</a>` : ""}</div></article>`).join(""));
  document.querySelectorAll("[data-event-filter]").forEach(button => button.addEventListener("click", () => {
    const filter = button.dataset.eventFilter;
    document.querySelectorAll("[data-event-filter]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    document.querySelectorAll("[data-event-type]").forEach(item => { item.hidden = filter !== "All" && item.dataset.eventType !== filter; });
  }));

  const authorHtml = authors => esc(authors).replace(/Harsh Sharma/g, '<strong class="author-self">Harsh Sharma</strong>');
  const bibtex = item => {
    const firstWord = String(item.title).replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).find(Boolean) || "Paper";
    const key = `Sharma${publicationYear(item)}${firstWord}`;
    const authors = String(item.authors).split(/\s+·\s+|,\s+/).join(" and ");
    if (item.journal) return `@article{${key},\n  title={${item.title}},\n  author={${authors}},\n  journal={${item.journal}},\n  year={${publicationYear(item)}}${item.doi ? `,\n  doi={${item.doi}}` : ""}\n}`;
    return `@misc{${key},\n  title={${item.title}},\n  author={${authors}},\n  year={${item.year}},\n  eprint={${item.id}},\n  archivePrefix={arXiv}\n}`;
  };
  mount("#all-publications", papers.map((item, index) => `<article class="publication"><span>${String(index + 1).padStart(2, "0")}</span><div><p class="publication-status">${item.journal ? `<b>Published</b> · ${esc(item.journal)}` : `<b>Preprint</b> · arXiv:${esc(item.id)} · ${esc(item.year)}`}</p><h3>${esc(item.title)}</h3><small>${authorHtml(item.authors)}</small><div><a href="https://arxiv.org/abs/${encodeURIComponent(item.id)}" target="_blank" rel="noreferrer">arXiv ↗</a><a href="https://arxiv.org/pdf/${encodeURIComponent(item.id)}" target="_blank" rel="noreferrer">PDF ↓</a>${item.doi ? `<a href="https://doi.org/${encodeURIComponent(item.doi)}" target="_blank" rel="noreferrer">Journal / DOI ↗</a>` : ""}<button class="bibtex-button" type="button" data-bibtex="${esc(bibtex(item))}">Copy BibTeX</button></div></div></article>`).join(""));
  document.querySelectorAll("[data-bibtex]").forEach(button => button.addEventListener("click", async () => {
    const original = button.textContent;
    try { await navigator.clipboard.writeText(button.dataset.bibtex); button.textContent = "Copied"; }
    catch (_) { button.textContent = "Copy failed"; }
    window.setTimeout(() => { button.textContent = original; }, 1600);
  }));
  setText("[data-publications-updated]", formatDate(window.PUBLICATIONS_UPDATED || data.lastUpdated));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.profile.name,
    url: "https://harshsharma-q.github.io/portfolio/",
    image: "https://harshsharma-q.github.io/portfolio/assets/harsh-sharma.jpg",
    jobTitle: data.profile.role,
    email: `mailto:${data.profile.email}`,
    affiliation: { "@type": "CollegeOrUniversity", name: data.profile.institution, url: "https://www.iitb.ac.in/" },
    sameAs: [data.links.scholar, data.links.orcid, data.links.arxiv, data.links.linkedin],
    knowsAbout: data.researchInterests,
  };
  const jsonLd = document.createElement("script");
  jsonLd.type = "application/ld+json";
  jsonLd.textContent = JSON.stringify(structuredData);
  document.head.appendChild(jsonLd);
})();
