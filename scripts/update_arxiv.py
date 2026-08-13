from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
import json, re
from xml.etree import ElementTree as ET

try:
    request = Request(
        "https://arxiv.org/a/sharma_h_2.atom2",
        headers={"User-Agent": "Mozilla/5.0 (compatible; HarshSharmaPortfolio/1.0)", "Accept": "application/atom+xml, application/xml;q=0.9, */*;q=0.8"},
    )
    root = ET.fromstring(urlopen(request, timeout=30).read())
    ns = {"a": "http://www.w3.org/2005/Atom", "arxiv": "http://arxiv.org/schemas/atom"}
    items = []
    for entry in root.findall("a:entry", ns):
        item = {
            "id": re.sub(r"v\d+$", "", entry.findtext("a:id", "", ns).split("/")[-1]),
            "title": " ".join(entry.findtext("a:title", "", ns).split()),
            "authors": " · ".join(a.findtext("a:name", "", ns) for a in entry.findall("a:author", ns)),
            "year": entry.findtext("a:published", "", ns)[:4],
        }
        journal = " ".join(entry.findtext("arxiv:journal_ref", "", ns).split())
        doi = entry.findtext("arxiv:doi", "", ns).strip()
        if journal:
            item["journal"] = journal
        if doi:
            item["doi"] = doi
        items.append(item)
    if not items:
        raise ValueError("arXiv returned an empty publication feed")
    Path("assets/publications.js").write_text("window.PUBLICATIONS=" + json.dumps(items, ensure_ascii=False) + ";\n", encoding="utf-8")
    print(f"Updated {len(items)} publications from arXiv.")
except (HTTPError, URLError, TimeoutError, ET.ParseError, ValueError) as error:
    print(f"Warning: arXiv refresh unavailable ({error}). Keeping the existing publication list.")
