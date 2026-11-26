#!/usr/bin/env python3
"""Allinea la landing all'app (MEPoss/bros). Solo libreria standard.

  - legge l'ultima release e il suo DMG  -> release.json (+ versione e data nel JSON-LD di index.html)
  - legge il README dell'app              -> se è cambiato dall'ultima volta, scrive sync/readme.diff

Il testo delle funzioni NON si riscrive da solo: una modifica al README apre una segnalazione
(vedi .github/workflows/sync-app.yml) e la landing si aggiorna a mano su quella base.
Con GITHUB_OUTPUT impostato (GitHub Actions) scrive release_changed / readme_changed.
"""
import difflib, json, os, re, urllib.request

APP = "MEPoss/bros"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)


def get(url):
    headers = {"User-Agent": "bros-landing-sync"}
    token = os.environ.get("GITHUB_TOKEN")
    if token and url.startswith("https://api.github.com"):
        headers["Authorization"] = "Bearer " + token
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as r:
        return r.read().decode("utf-8")


def output(key, value):
    path = os.environ.get("GITHUB_OUTPUT")
    if path:
        with open(path, "a") as f:
            f.write(f"{key}={value}\n")
    print(f"{key}={value}")


# ---- release e DMG ----
release = json.loads(get(f"https://api.github.com/repos/{APP}/releases/latest"))
dmg = next((a for a in release.get("assets", []) if a["name"].lower().endswith(".dmg")), None)
info = {
    "tag": release["tag_name"],
    "name": release.get("name") or release["tag_name"],
    "published_at": release["published_at"],
    "html_url": release["html_url"],
    "dmg_name": dmg["name"] if dmg else None,
    "dmg_url": dmg["browser_download_url"] if dmg else None,
    "dmg_size": dmg["size"] if dmg else None,
    "notes": (release.get("body") or "").strip(),
}
old = None
if os.path.exists(P("release.json")):
    with open(P("release.json")) as f:
        old = json.load(f)
release_changed = old != info
if release_changed:
    with open(P("release.json"), "w") as f:
        json.dump(info, f, indent=2, ensure_ascii=False)
        f.write("\n")
output("release_changed", str(release_changed).lower())
output("release_tag", info["tag"])

# ---- JSON-LD di index.html: versione, data, dimensione del DMG ----
with open(P("index.html")) as f:
    html = f.read()
m = re.search(r'(<script type="application/ld\+json">)(.*?)(</script>)', html, re.S)
if m:
    data = json.loads(m.group(2))
    data["softwareVersion"] = info["tag"].lstrip("v")
    data["dateModified"] = info["published_at"][:10]
    if info["dmg_size"]:
        data["fileSize"] = f'{info["dmg_size"] / 1048576:.1f} MB'
    block = m.group(1) + "\n" + json.dumps(data, indent=2, ensure_ascii=False) + "\n" + m.group(3)
    new_html = html[: m.start()] + block + html[m.end():]
    if new_html != html:
        with open(P("index.html"), "w") as f:
            f.write(new_html)

# ---- README dell'app ----
readme = get(f"https://raw.githubusercontent.com/{APP}/main/README.md")
os.makedirs(P("sync"), exist_ok=True)
snap = P("sync", "app-README.md")
readme_changed = False
if os.path.exists(snap):
    with open(snap) as f:
        before = f.read()
    if before != readme:
        readme_changed = True
        diff = "".join(difflib.unified_diff(before.splitlines(True), readme.splitlines(True),
                                            "README (landing snapshot)", "README (app, now)", n=2))
        with open(P("sync", "readme.diff"), "w") as f:
            f.write(diff)
if readme_changed or not os.path.exists(snap):
    with open(snap, "w") as f:
        f.write(readme)
output("readme_changed", str(readme_changed).lower())
