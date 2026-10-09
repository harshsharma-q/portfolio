/*
  GOOGLE SHEETS CONNECTION

  The site reads its content from this Google Sheet on every page load, so
  edits in the Sheet appear without a GitHub commit. The Sheet must be shared
  as "Anyone with the link — Viewer"; everything in it is public.

  Each tab is used only if its first row contains the listed columns. A tab
  that is missing or renamed is ignored and the copy in assets/content.js is
  shown instead. See the "Read me" tab in the Sheet for editing rules.
*/
window.SHEET_CONFIG = {
  enabled: true,
  spreadsheetId: "1QF4c0BC79IKqa2fKvnlr6G95nAPexUG31iJHfHE4qD0",
  tabs: {
    profile: { name: "Profile", columns: ["field", "value"] },
    publications: { name: "Publications", columns: ["arxiv", "title", "authors", "journal", "doi", "summary"] },
    talks: { name: "Talks", columns: ["year", "type", "title", "event", "venue"] },
    education: { name: "Education", columns: ["period", "degree", "institution"] },
    awards: { name: "Awards", columns: ["year", "title", "organization"] },
    qualifications: { name: "Qualifications", columns: ["year", "title", "organization"] },
  },
};
