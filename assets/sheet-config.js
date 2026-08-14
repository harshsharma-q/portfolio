/*
  OPTIONAL LIVE GOOGLE SHEETS CONNECTION

  1. Import the provided Harsh_Sharma_Website_Content.xlsx into Google Sheets.
  2. Share it as "Anyone with the link — Viewer".
  3. Paste the ID from the Sheet URL below and set enabled to true.

  The public website only receives read access. Keep private CV-only information
  out of this Sheet because data used by a public website is necessarily public.
*/
window.SHEET_CONFIG = {
    enabled: true,
  spreadsheetId: "1QF4c0BC79IKqa2fKvnlr6G95nAPexUG31iJHfHE4qD0",
  tabs: {
    profile: "Profile",
    interests: "ResearchInterests",
    updates: "Updates",
    projects: "Projects",
    education: "Education",
    awards: "Awards",
    qualifications: "Qualifications",
    presentations: "Presentations",
  },
};
