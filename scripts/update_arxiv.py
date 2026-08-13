from pathlib import Path
from urllib.request import Request, urlopen
import json, re
from xml.etree import ElementTree as ET

request = Request("https://arxiv.org/a/sharma_h_2.atom2", headers={"User-Agent": "harsh-sharma-portfolio/1.0"})
root = ET.fromstring(urlopen(request, timeout=30).read())
ns = {"a": "http://www.w3.org/2005/Atom"}
items = []
for entry in root.findall("a:entry", ns):
    items.append({
        "id": re.sub(r"v\d+$", "", entry.findtext("a:id", "", ns).split("/")[-1]),
        "title": " ".join(entry.findtext("a:title", "", ns).split()),
        "authors": " · ".join(a.findtext("a:name", "", ns) for a in entry.findall("a:author", ns)),
        "year": entry.findtext("a:published", "", ns)[:4],
    })
Path("assets/publications.js").write_text("window.PUBLICATIONS=" + json.dumps(items, ensure_ascii=False) + ";\n", encoding="utf-8")
