# Harsh Sharma — Academic Website

Professional multi-page website for research, postdoctoral, and job applications.

## Pages

- `index.html` — profile, research perspective, selected work, and updates
- `research.html` — research statement, connected themes, and project explanations
- `background.html` — education, awards, fellowships, and qualifications
- `activities.html` — talks, posters, conferences, workshops, official links, and recordings
- `publications.html` — arXiv-synced publications with journal metadata, DOI, PDF, and BibTeX
- `contact.html` — affiliation, research group, email, and academic profiles

## Fastest update: Google Sheets

The website includes an optional live Google Sheets data source. A prepared workbook named `Harsh_Sharma_Website_Content.xlsx` accompanies the local project.

1. Import the workbook into Google Sheets.
2. Update the content in its named tabs. Do not rename row-one headers or sheet tabs.
3. Share the Sheet as **Anyone with the link — Viewer**. Only public website information belongs in this Sheet.
4. Copy the long spreadsheet ID from its URL.
5. Open `assets/sheet-config.js`, paste the ID into `spreadsheetId`, and change `enabled` to `true`.
6. Commit that configuration change. After that, ordinary content edits in Google Sheets appear on the website without a GitHub commit.

If the Sheet is unavailable, the website automatically falls back to `assets/content.js`.

## Update through GitHub instead

All bundled website content is in `assets/content.js`. Edit it with GitHub’s pencil button and commit the change. GitHub Pages republishes automatically.

## Publications

`assets/publications.js` is refreshed weekly from Harsh Sharma’s arXiv author feed by `.github/workflows/pages.yml`. Journal references and DOIs are shown whenever arXiv supplies them. The 2024 *Journal of Physics A* article, which is not included in that author feed, is merged from the verified manual record in `assets/content.js`.

## Private CV builder

The CV builder is intentionally stored only in the local `private/` directory. That directory is ignored by Git, has no public link, and is not deployed to GitHub Pages.

Run a local preview from the repository:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/private/cv-builder.html`. Choose sections, scope, type style, colour, page size, and whether to include a photo; select **Download / Print PDF** and save as PDF in the print dialog.

Because the repository is public, no client-side password could securely protect a deployed CV generator. The local-only design provides the actual access boundary requested.

## Local website preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`.
