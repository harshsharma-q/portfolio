# Harsh Sharma — Academic Website

A single-page academic website: profile, publications, talks, and background.
It is published with GitHub Pages at https://harshsharma-q.github.io/portfolio/.

## Editing content: Google Sheets

All content comes from a Google Sheet, so ordinary edits need no GitHub commit.
The Sheet's **Read me** tab explains the rules; in short:

| Tab | One row per… | Notes |
| --- | --- | --- |
| Profile | field (`name`, `title`, `bio`, `availability`, `email`, links…) | Blank values are hidden. Each line of `bio` is a paragraph. |
| Publications | paper | Adds summaries, journal references, and non-arXiv papers. Write IDs as `arXiv:2408.11628`. |
| Talks | event | Rows with a title are talks/posters; rows without one are workshops attended. |
| Education, Awards, Qualifications | entry | Shown in row order. |

Do not rename tabs or change the first row of a tab. A tab whose column names
don't match is ignored, and the site shows the bundled copy instead.
Links can be written in any text as `[label](https://…)`.

### Connecting a Sheet

1. In Google Sheets, open the existing Sheet, choose **File → Import → Upload**, select
   `Harsh_Sharma_Website_Content.xlsx`, and pick **Replace spreadsheet**. This keeps the
   same Sheet ID and sharing settings.
2. The Sheet must be shared as **Anyone with the link — Viewer**. Everything in it is public.
3. `assets/sheet-config.js` holds the Sheet ID and `enabled: true`.

The page waits up to 2.5 seconds for the Sheet, then shows the bundled copy in
`assets/content.js`. Keep that file roughly in step with the Sheet; it must stay
valid JSON, which the deploy workflow checks.

## Publications from arXiv

`.github/workflows/pages.yml` refreshes `assets/publications.js` weekly from the
arXiv author feed, so new preprints appear automatically. Rows in the Sheet's
Publications tab are matched by arXiv ID and add a summary or override fields.

## Old page addresses

`research.html`, `publications.html`, `activities.html`, `background.html`, and
`contact.html` redirect to the matching section of `index.html`, so existing
links keep working.

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
