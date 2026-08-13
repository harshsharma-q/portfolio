# Harsh Sharma — Academic Portfolio

Professional multi-page academic website hosted with GitHub Pages.

## Website pages

- `index.html` — About and recent updates
- `background.html` — Education, awards, and fellowships
- `activities.html` — Talks, conferences, posters, and workshops
- `publications.html` — Publications refreshed from arXiv
- `contact.html` — Contact details and academic profiles

## Updating the website

Nearly all editable information is in [`assets/content.js`](assets/content.js):

- name, role, institution, email and location
- homepage introduction and availability statement
- research interests
- recent updates
- education
- awards and fellowships
- presentations and workshops, including event and video links
- LinkedIn, ORCID and arXiv links

To update it on GitHub:

1. Open `assets/content.js` in the repository.
2. Select the pencil icon (**Edit this file**).
3. Change the relevant text while preserving quotation marks, commas and brackets.
4. Select **Commit changes**.
5. GitHub Actions republishes the website automatically.

To link an event or recording, add `eventUrl` or `videoUrl` to its presentation entry. Leave either one out when no public link is available.

## Publications

`assets/publications.js` is refreshed weekly from Harsh Sharma’s arXiv author feed by `.github/workflows/pages.yml`. Journal references and DOIs are displayed whenever arXiv supplies them; otherwise an item is labelled as a preprint. If arXiv is temporarily unavailable, deployment continues with the existing publication list.

## Local preview

From this repository, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
