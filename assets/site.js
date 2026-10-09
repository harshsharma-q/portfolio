(() => {
  const SHEET_TIMEOUT_MS = 2500;
  const bundled = window.SITE_CONTENT || {};
  const config = window.SHEET_CONFIG || {};
  const $ = id => document.getElementById(id);

  // ---------- helpers ----------
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const clean = value => String(value ?? "").trim();
  // Escapes text and turns [label](https://…) into links.
  const rich = value => esc(value).replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)\s]+)\)/g, (_, label, url) => `<a href="${url}"${url.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${label}</a>`);
  const external = (url, label) => url ? `<a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(label)}</a>` : "";
  const arxivId = value => clean(value).replace(/^https?:\/\/arxiv\.org\/(?:abs|pdf)\//i, "").replace(/^arxiv:\s*/i, "").replace(/\.pdf$/i, "").replace(/v\d+$/, "");
  const hasContent = row => Object.values(row).some(value => clean(value));

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
    return { headers, rows: rows.map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))).filter(hasContent) };
  };

  // ---------- Google Sheet ----------
  // Unknown tab names make Google return the first tab, so each tab is accepted only if its headers match.
  const fetchTab = async ({ name, columns }) => {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(config.spreadsheetId)}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(name)}`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const { headers, rows } = parseCsv(await response.text());
      if (!columns.every(column => headers.includes(column))) throw new Error(`unexpected columns: ${headers.join(", ")}`);
      return rows;
    } catch (error) {
      console.warn(`Sheet tab "${name}" was not used (${error.message}); showing the bundled copy.`);
      return null;
    }
  };

  const loadSheet = async () => {
    const entries = await Promise.all(Object.entries(config.tabs || {}).map(async ([key, tab]) => [key, await fetchTab(tab)]));
    const data = structuredClone(bundled);
    entries.forEach(([key, rows]) => {
      if (!rows) return;
      if (key === "profile") data.profile = Object.fromEntries(rows.filter(row => clean(row.field)).map(row => [clean(row.field), clean(row.value)]));
      else data[key] = rows;
    });
    return data;
  };

  // ---------- publications ----------
  const yearOf = item => {
    const journalYears = clean(item.journal).match(/(?:19|20)\d{2}/g);
    if (journalYears) return Number(journalYears.at(-1));
    const fromId = arxivId(item.arxiv || item.id).match(/^(\d{2})(\d{2})\./);
    return fromId ? 2000 + Number(fromId[1]) : Number(item.year) || 0;
  };
  const splitAuthors = authors => clean(authors).split(/\s*[·,]\s*/).filter(Boolean);

  // The weekly arXiv feed (assets/publications.js) adds new papers; Sheet rows add summaries and override fields.
  const mergePublications = rows => {
    const byKey = new Map();
    (window.PUBLICATIONS || []).forEach(item => byKey.set(arxivId(item.id), { ...item, arxiv: item.id }));
    (rows || []).forEach(row => {
      const key = arxivId(row.arxiv) || clean(row.doi) || clean(row.title);
      const overrides = Object.fromEntries(Object.entries(row).filter(([, value]) => clean(value)).map(([field, value]) => [field, clean(value)]));
      byKey.set(key, { ...(byKey.get(key) || {}), ...overrides });
    });
    return [...byKey.values()]
      .map(item => ({ ...item, id: arxivId(item.arxiv || item.id), year: yearOf(item) }))
      .sort((a, b) => b.year - a.year || b.id.localeCompare(a.id));
  };

  const bibtex = item => {
    const authors = splitAuthors(item.authors);
    const surname = (authors[0] || "Author").split(/\s+/).map(part => part.replace(/[^A-Za-z]/g, "")).filter(part => part.length > 1).at(-1) || "Author";
    const firstWord = clean(item.title).replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).find(word => word.length > 3) || "paper";
    const fields = [`  title={${item.title}}`, `  author={${authors.join(" and ")}}`];
    if (item.journal) fields.push(`  journal={${item.journal.replace(/\s*\((?:19|20)\d{2}\)\s*$/, "")}}`);
    fields.push(`  year={${item.year}}`);
    if (item.doi) fields.push(`  doi={${item.doi}}`);
    if (item.id) fields.push(`  eprint={${item.id}}`, "  archivePrefix={arXiv}");
    return `@${item.journal ? "article" : "misc"}{${surname}${item.year}${firstWord},\n${fields.join(",\n")}\n}`;
  };

  // ---------- rendering ----------
  const renderProfile = profile => {
    $("profile-name").textContent = profile.name || "";
    $("profile-title").textContent = profile.title || "";
    $("profile-bio").innerHTML = clean(profile.bio).split(/\n+/).filter(Boolean).map(paragraph => `<p>${rich(paragraph)}</p>`).join("");
    const availability = $("profile-availability");
    availability.innerHTML = rich(profile.availability);
    availability.hidden = !clean(profile.availability);

    const links = [
      profile.email && `<a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>`,
      external(profile.cv, "CV"),
      external(profile.scholar, "Google Scholar"),
      external(profile.arxiv, "arXiv"),
      external(profile.orcid, "ORCID"),
      external(profile.linkedin, "LinkedIn"),
      external(profile.github, "GitHub"),
    ].filter(Boolean);
    $("profile-links").innerHTML = links.map(link => `<li>${link}</li>`).join("");

    const portrait = $("profile-portrait");
    portrait.hidden = !profile.photo;
    if (profile.photo) { $("profile-photo").src = profile.photo; $("profile-photo").alt = `Portrait of ${profile.name || ""}`; }

    document.querySelectorAll("[data-cv-link]").forEach(link => { link.hidden = !profile.cv; if (profile.cv) link.href = profile.cv; });
    $("footer-address").textContent = profile.address || "";
    const email = $("footer-email");
    email.textContent = profile.email || "";
    email.href = profile.email ? `mailto:${profile.email}` : "#";
  };

  const renderPublications = (papers, selfName) => {
    const authorHtml = authors => splitAuthors(authors).map(name => name === selfName ? `<strong>${esc(name)}</strong>` : esc(name)).join(", ");
    $("publication-list").innerHTML = papers.map(item => {
      const journal = clean(item.journal).replace(/\s*\((?:19|20)\d{2}\)\s*$/, "");
      const venue = journal ? esc(journal) : item.id ? `Preprint, arXiv:${esc(item.id)}` : "";
      const titleUrl = item.doi ? `https://doi.org/${item.doi}` : item.id ? `https://arxiv.org/abs/${item.id}` : "";
      const links = [
        item.id && external(`https://arxiv.org/abs/${item.id}`, "arXiv"),
        item.id && external(`https://arxiv.org/pdf/${item.id}`, "PDF"),
        item.doi && external(`https://doi.org/${item.doi}`, "Journal"),
        `<button type="button" class="link-button" data-bibtex="${esc(bibtex(item))}">BibTeX</button>`,
      ].filter(Boolean);
      return `<article class="entry pub"><span class="entry-year">${esc(item.year || "")}</span><div>
        <h3>${titleUrl ? `<a href="${esc(titleUrl)}" target="_blank" rel="noreferrer">${esc(item.title)}</a>` : esc(item.title)}</h3>
        <p class="pub-authors">${authorHtml(item.authors)}</p>
        ${venue ? `<p class="pub-venue">${venue}</p>` : ""}
        ${clean(item.summary) ? `<p class="pub-summary">${rich(item.summary)}</p>` : ""}
        <p class="entry-links">${links.join("")}</p>
      </div></article>`;
    }).join("");
    document.querySelectorAll("[data-bibtex]").forEach(button => button.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(button.dataset.bibtex); button.textContent = "Copied"; }
      catch (_) { button.textContent = "Copy failed"; }
      window.setTimeout(() => { button.textContent = "BibTeX"; }, 1600);
    }));
  };

  const renderTalks = talks => {
    // Rows with a title are talks or posters; the same title given at several events is listed once.
    const groups = new Map();
    talks.filter(item => clean(item.title)).forEach(item => {
      const key = clean(item.title).toLowerCase().replace(/\s+/g, " ");
      if (!groups.has(key)) groups.set(key, { title: clean(item.title), items: [] });
      groups.get(key).items.push(item);
    });
    const sorted = [...groups.values()]
      .map(group => ({ ...group, items: [...group.items].sort((a, b) => Number(b.year) - Number(a.year)) }))
      .sort((a, b) => Number(b.items[0].year) - Number(a.items[0].year));
    $("talk-list").innerHTML = sorted.map(group => `<article class="talk"><h3>${esc(group.title)}</h3><ul>${group.items.map(item => {
      const where = [item.event, item.venue].map(clean).filter(Boolean).map(esc).join(", ");
      const links = [external(item.eventUrl, clean(item.eventLabel) || "Event"), external(item.videoUrl, "Video")].filter(Boolean).join("");
      return `<li><span class="entry-year">${esc(item.year)}</span><span>${clean(item.type) ? `${esc(item.type)} · ` : ""}${where}${links ? ` <span class="entry-links">${links}</span>` : ""}</span></li>`;
    }).join("")}</ul></article>`).join("");

    const attended = talks.filter(item => !clean(item.title));
    $("attended-list").innerHTML = attended.length ? `<h3 class="subhead">Schools and workshops attended</h3><ul class="compact">${attended.map(item => {
      const name = clean(item.eventUrl) ? external(item.eventUrl, item.event) : esc(item.event);
      return `<li><span class="entry-year">${esc(item.year)}</span><span>${name}${clean(item.venue) ? `, ${esc(item.venue)}` : ""}</span></li>`;
    }).join("")}</ul>` : "";
  };

  const renderBackground = data => {
    const block = (heading, rows, render) => rows?.length ? `<h3 class="subhead">${heading}</h3><ul class="compact">${rows.map(render).join("")}</ul>` : "";
    $("background-list").innerHTML = [
      block("Education", data.education, item => `<li><span class="entry-year wide">${esc(item.period)}</span><span><strong>${esc(item.degree)}</strong>, ${esc(item.institution)}${clean(item.detail) ? `<small>${rich(item.detail)}</small>` : ""}</span></li>`),
      block("Fellowships and awards", data.awards, item => `<li><span class="entry-year wide">${esc(item.year)}</span><span><strong>${esc(item.title)}</strong>, ${esc(item.organization)}${clean(item.detail) ? `<small>${rich(item.detail)}</small>` : ""}</span></li>`),
      block("National examinations", data.qualifications, item => `<li><span class="entry-year wide">${esc(item.year)}</span><span>${esc(item.title)}: ${esc(item.organization)}</span></li>`),
    ].join("");
  };

  const renderStructuredData = (profile, papers) => {
    let script = document.getElementById("person-jsonld");
    if (!script) {
      script = Object.assign(document.createElement("script"), { type: "application/ld+json", id: "person-jsonld" });
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      url: "https://harshsharma-q.github.io/portfolio/",
      image: "https://harshsharma-q.github.io/portfolio/assets/harsh-sharma.jpg",
      jobTitle: profile.title,
      email: profile.email ? `mailto:${profile.email}` : undefined,
      affiliation: { "@type": "CollegeOrUniversity", name: "Indian Institute of Technology Bombay", url: "https://www.iitb.ac.in/" },
      sameAs: [profile.scholar, profile.orcid, profile.arxiv, profile.linkedin, profile.github].filter(Boolean),
      subjectOf: papers.filter(item => item.doi).map(item => ({ "@type": "ScholarlyArticle", name: item.title, url: `https://doi.org/${item.doi}` })),
    });
  };

  let rendered = "";
  const render = data => {
    const signature = JSON.stringify(data);
    if (signature === rendered) return;
    const firstRender = !rendered;
    rendered = signature;
    const profile = data.profile || {};
    const papers = mergePublications(data.publications);
    renderProfile(profile);
    renderPublications(papers, profile.name);
    renderTalks(data.talks || []);
    renderBackground(data);
    renderStructuredData(profile, papers);
    $("main").classList.remove("is-loading");
    // Content arrives after the browser has already jumped to #section, so jump again once it is in place.
    const target = firstRender && location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      const root = document.documentElement;
      root.style.scrollBehavior = "auto";
      target.scrollIntoView();
      root.style.scrollBehavior = "";
    }
  };

  // ---------- page behaviour ----------
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 4);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const navLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.toggleAttribute("aria-current", link.getAttribute("href") === `#${entry.target.id}`));
    }), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
  }

  // Wait briefly for the Sheet so visitors do not see the bundled copy flash first.
  if (config.enabled && config.spreadsheetId) {
    const fallback = window.setTimeout(() => render(bundled), SHEET_TIMEOUT_MS);
    loadSheet().then(data => { window.clearTimeout(fallback); render(data); });
  } else {
    render(bundled);
  }
})();
