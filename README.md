# Harsh Sharma — Academic Portfolio

Professional academic portfolio and complete research record, hosted with GitHub Pages.

## Updating the website

Nearly all editable information is in [`assets/content.js`](assets/content.js):

- name, role, institution, email and location
- homepage introduction and availability statement
- research interests
- projects and descriptions
- education
- awards and fellowships
- presentations and workshops
- LinkedIn, ORCID and arXiv links

To update it on GitHub:

1. Open `assets/content.js` in the repository.
2. Select the pencil icon (**Edit this file**).
3. Change the relevant text while preserving quotation marks, commas and brackets.
4. Select **Commit changes**.
5. GitHub Actions republishes the website automatically.

Items marked `selected: true` appear on the curated homepage. All entries appear on the full academic-record page.

## Publications

`assets/publications.js` is refreshed weekly from Harsh Sharma’s arXiv author feed by `.github/workflows/pages.yml`. If arXiv is temporarily unavailable, deployment continues with the existing publication list.

## Local preview

From this repository, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
