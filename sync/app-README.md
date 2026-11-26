# Bros

A Mac browser that treats your open tabs like files in a Finder window.

Bros is a fork of [Search](https://github.com/driceroland/Search) by [Office Commun](https://officecommun.com) (MIT). It keeps everything Search is — a small, fast, native WebKit browser with no toolbar and no account — and adds one idea on top: **a Workspace**, where the pages you have open are laid out like files you can sort into folders, mark and find again.

macOS 14 or later · Mac only · [Download the latest `Bros.dmg`](../../releases/latest)

> The app is ad-hoc signed, not notarised, so macOS may say it "could not verify Bros.app" the first time. Open Terminal and paste this once, then open Bros normally (the same line is written on the disk image):
>
> ```
> xattr -dr com.apple.quarantine /Applications/Bros.app
> ```
>
> Or: System Settings › Privacy & Security › *Open Anyway*. Updates Bros fetches itself are not blocked.

---

## What Bros adds

### The Workspace

![A folder of links in the list view, with the folders and sections down the left](.github/screens/workspace-list.png)

Open it with **`⌘K`** (Bookmarks › Show Workspace…), from the door icon at the foot of the tab column, or with **`⇧⌘O`** to put it in the sidebar. It is a *view of your open tabs*, not a list of bookmarks: a page you open appears in the **Inbox** by itself, and a page whose tab you close goes away again unless you filed or kept it.

- **Sections:** Inbox, To do, Due this week, and your own **folders**, nested as deep as you like. The sections are a tree on the left; the links of the one you pick are on the right.
- **Like files:** each link has a status, a priority (none to high), a due date, tags and notes. Right-click for the menu; set several at once on a selection.
- **Three views:** icons, a list, or **snapshots**, where each tile is a picture of the page as you last saw it (kept on disk, refreshed while the tab is open).
- **Drag and drop:** drag links onto a folder or onto the Inbox, and folders onto folders. Pick several with the mouse as in the Finder (click, ⌘-click, ⇧-click, or a rubber band).
- **Folders where you are:** right-click empty space for *New Folder*, or select links and choose *Create Folder from Selection*.
- **Keep When Closed:** a link you keep stays in the Workspace after its tab is gone. **`⌥⌘S`** keeps the page in front.
- **Delete:** `⌘⌫` on selected links or a folder asks first. Links are taken out and their tabs closed; a folder's links go to the Inbox.
- **Icons for folders:** right-click a folder › Icon, and pick one of thirty.
- **Search:** the field above the tree finds folders and links; the Workspace page has its own.

| Icons | To do |
|---|---|
| ![The Inbox in the icon view, with folders carrying their own icons](.github/screens/workspace-icons.png) | ![Everything still to do, across folders](.github/screens/workspace-todo.png) |

*Drawn from sample links; the folder icons are the ones you pick from a folder's menu.*

### Keyboard first

| Key | Does |
|---|---|
| `⌘K` | Show the Workspace |
| `⇧⌘O` | Workspace in the sidebar, in place of the tab column |
| `⌥⌘S` | Keep the page in front in the Workspace |
| `⌥⌘↓` / `⌥⌘↑` | Next / previous page in the list on the left. Goes round from the last to the first. Works with the caret in a page's text field, Google's included. |
| `⌥⌘→` / `⌥⌘←` | Next / previous section of the Workspace |
| `↑ ↓ ← →` | Inside the Workspace: move through the sections, open and close folders, and cross to the links on the right and back. `Return` opens. |
| `⌘⌫` | Delete the selected links, or the folder, with a confirmation |

The plain arrows belong to the Workspace until you click on a page, which gives the keyboard back to it. `⇧⌘O` or a click on the Workspace takes it again.

### Other differences from Search

- **`⌘K` is the Workspace.** In Search it lists open tabs by name; that command is gone here.
- **Its own name and data.** The app is *Bros* (`app.bros.browser`), with its own folder in `~/Library/Application Support/Bros/`, so it never touches a Search install's tabs, bookmarks or passwords.
- **It updates itself.** Bros looks at this repo's latest release every hour and at launch (Bros › Check for Updates…), downloads the new build, checks it against a signature made with the author's key, and puts it in place for the next launch. Your data is not touched. Search's own update feed is not used.
- The Workspace is stored in `workspace.json`, and its pictures in `workspace-thumbs/`, in that folder.

## Building it

```bash
./build.sh          # build/Bros.app
./fresh.sh again    # a throwaway test copy with its own data
swift test          # the test suite
```

Needs the Xcode command line tools and Swift 6. To publish a release: `./build.sh && ./bros-release.sh "what is new"`, then the `gh release create` line it prints (the signing key lives in `~/.config/bros/update.key`, outside the repo). Where the code lives: `Sources/Search/Workspace*.swift` (model, panel, column, keys, thumbnails, ⌘K offers) and `Brand.swift` (the name). Everything else is Search's.

## Credits and licence

Bros is built on Search, © Office Commun, MIT licensed; see [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The Workspace is an independent addition; it is not affiliated with or endorsed by Office Commun.

---

## Search, the browser Bros is built on

A small, fast, quiet web browser for the Mac, by [Office Commun](https://officecommun.com).

![Search, with its tabs down the left and a page taking the rest of the window](.github/screenshot.png)

**[Download for macOS →](https://searchbrowser.app)** · macOS 14 or later · free · about 14 MB

Or with [Homebrew](https://brew.sh): `brew install --cask driceroland/tap/search`

---

## What it is

Search is a browser with nothing in the way. A row of tabs — down the left, or across the top if you prefer — and the page. There is no toolbar, no start page, no sidebar of suggestions, no account to sign into, nothing that wants your attention. You type an address or a few words in one field and you are on the page.

It uses **WebKit**, the engine already inside every Mac (it is what Safari runs on). That is why the whole app is about 14 MB on disk and opens instantly: there is no second copy of Chromium to download, update and keep in memory.

It was built by a design studio that spends its whole day in a browser and was tired of the ones that had become products. This one is a tool.

## What it does

- **One field.** Type an address and you go there; type words and you search. It finishes addresses from your own history and never sends what you type anywhere until you press Return.
- **Tabs that stay out of the way.** Pin the pages you keep open all day and they shrink to a letter or their icon. Tabs from your last session come back instantly and cost nothing until you click them. `⌘K` lists your open tabs by name.
- **Keep an important site running.** Enable Keep selected sites awake in Settings › Tabs, then choose Keep This Site Awake in the site card. It prevents sleeping and automatic closure, even under memory pressure, at the cost of more memory. Private choices last only in that tab; manual closing still works.
- **Two pages side by side.** Turn on Split View in Settings › Tabs, then drag a tab onto a page or choose Tabs › Split Current Page. Drag the divider to resize the panes; the outlined pane receives page commands. Pairs and their widths come back with their Space, including after a restart.
- **Reading mode.** `⇧⌘R` strips a page down to the article.
- **Hide anything, for good.** `⇧⌘H`, then click a cookie banner, a newsletter overlay, a rail of "related" nonsense — it goes, and it is still gone on that site next time, before the page has drawn a single frame.
- **An ad blocker that runs before the page.** Third-party trackers and ad networks are stopped at the network level, so there is nothing to render and nothing to slow down. On by default, off per site if something breaks.
- **Video that follows you.** `⇧⌘P` lifts the video out of the page into a small window that stays above everything, including other apps.
- **Passwords, in your keychain.** Search offers to save a sign-in once it has actually worked, and offers your saved accounts, and the Mac's passkeys for the site, under the field when you click it — the way Safari does, never filling anything on its own. Everything lives in the macOS keychain, encrypted by the system, readable only by Search. Bring yours in from Chrome, Arc, Dia, Brave or Edge in one click; nothing leaves the Mac. Keep them in Apple's Passwords app instead? Turn it on in Settings › Passwords and its accounts and verification codes come up under their box too.
- **Light, dark, or the Mac's own.** The frame and the pages follow.
- **A wall behind the blank tab, if you like.** Settings › Themes paints it with a scenic mural, a pack of stickers, a colour, a gradient or a picture of your own, in light and dark, drawn once and kept so it costs nothing while you browse. Off until you choose one.
- **Bookmarks, history, downloads** — each a panel, each searchable, each one keystroke away.
- **Chrome extensions, without Chrome.** Paste a Chrome Web Store link in Settings › Extensions, or open the extension's page in Search and press Add. It runs on WebKit's own extension engine — the one Safari uses — and where Chrome has APIs WebKit doesn't (bookmarks, history, downloads, side panel, offscreen documents, fonts, notifications, speech, OAuth sign-in), Search fills them in itself. They live behind the puzzle button; pin the ones you use often. Building your own? Load its folder as an unpacked extension and press Reload after each change, as in Chrome's developer mode. macOS 15.4 or later.
- **Updates itself, quietly.** Once a day it checks for a newer build, downloads it, verifies it is signed by Office Commun, and swaps it in for the next launch. Nothing restarts on its own.

## What it doesn't do

On purpose:

- No extension you have to install to feel at home. Blocking ads, hiding clutter, reading mode, picture-in-picture and passwords are built in; extensions are there for everything else.
- No account and no cloud of ours. Your history and passwords are on your Mac and nowhere else. Sync with iCloud keeps your open tabs, pins, spaces, bookmarks and a few settings in your own iCloud, end to end encrypted: on for a new install once you leave the welcome, where its switch is, and off for a Search you had before until you turn it on.
- No telemetry, no analytics, no crash reports sent anywhere. The only things that leave your Mac are the pages you ask for, their icons, one small request a day to see whether there is a newer version, and, while they are on, Sync with iCloud and Handoff (below).
- One window. Tabs are the only kind of "new" there is.

## Privacy, concretely

| What | Where it is | Who can read it |
|---|---|---|
| Passwords | The macOS login keychain, as ordinary keychain items tagged `Search` | Search, signed by Office Commun. Any other app triggers the system's permission dialog. |
| History, bookmarks, open tabs, hidden elements | Small JSON files in `~/Library/Application Support/Search/` | You. |
| Cookies and site data | WebKit's own store for the app | The sites that set them, as in any browser. |
| Extensions | Unpacked in `~/Library/Application Support/Search/Extensions/`, their data in WebKit's extension store | Each extension, within the permissions you accepted when adding it. |
| News by email, the iPhone beta | Only if you type your email and press Join or Ask (the What's New card, the welcome, Settings › About): one HTTPS POST to searchbrowser.app with the address, where you pressed (`app-whats-new`, `app-welcome`, `app-settings`), which Mac download you have and, if ticked, that you want the iPhone beta. Your Mac keeps two yes/no flags, never the address. See `OptIn.swift`. | Office Commun, to send those emails through Resend; every one has a link to stop them, and hello@searchbrowser.app removes the address. |
| Sync with iCloud | While it is on (Settings › General; on for a new install from the moment you leave the welcome, off for a Search you had before until you turn it on): open tabs, pins, spaces, bookmarks, your search engine (and its suggestions address) and look, in Search's own zone of your private iCloud database, their contents end to end encrypted. Never private tabs, history, passwords, cookies or sign-ins. See `SYNC.md` and `ICloudSync.swift`. | You, on your devices signed in to your Apple Account. Not Office Commun: there is no server of ours. |
| Handoff | While it is on (Settings › General; on for a new install from the moment you leave the welcome, off for a Search you had before until you turn it on): the address and title of the page in front, handed to macOS, which offers it to your iPhone, iPad and other Macs. Never a private tab. See `Handoff.swift`. | Your devices signed in to your Apple Account, through Apple's Handoff. |
| Anything else | Nowhere. There is no server. | — |

A **private tab** (`⇧⌘N`) has its own cookie jar and leaves nothing behind when it closes.

Apps you allow in System Settings › Privacy & Security › Automation can read the address and title of your tabs with AppleScript, and the name of the space and profile each window is in; private tabs are never shown, and a window with one in front shows neither name.

## Keyboard

| | |
|---|---|
| `⌘L` address · `⌘K` switch tab · `⌘T` new tab · `⌘W` close · `⇧⌘T` reopen | `⌘[` `⌘]` back, forward · `⇧⌘[` `⇧⌘]` previous, next tab · `⌘1`–`⌘9` jump |
| `⇧⌘S` tabs down the left or across the top · `⌘S` fold the sidebar away · `⇧⌘B` bookmark this page | `⇧⌘R` reading mode · `⇧⌘P` float the video · `⇧⌘H` hide something · `⇧⌘U` what is hidden here |
| `⌘F` find · `⌘D` duplicate tab · `⇧⌘C` copy address · `⇧⌘V` paste and go | `⌘Y` history · `⇧⌘J` downloads · `⌘,` settings · `⌥⌘L` passwords |

Space keys (Control+1–9 by default) and the modifier used to peek at a link can be changed in Settings › Shortcuts while those features are enabled.

`⌘R` reloads the page; `⌥⌘R` reloads it from origin, checking everything cached with the site again, as Safari's Reload Page From Origin, which is also in a right-click on the reload button.

`⌃Tab` and `⌃⇧Tab` walk along the row of tabs; `Tab` stays the page's, for moving through a form. `esc` puts away whatever is open.

With Split View on, `⌥⌘N` splits the current page and `⌃⌘←` / `⌃⌘→` go from one page to the other. `⌘W` closes the focused tab and gives the remaining page the whole area. Tabs › Separate Split Tabs keeps both tabs open separately.

---

## For developers

### Why the source is here

So anyone can read exactly what a browser handling their passwords and history is doing, build it themselves, or fix something that bothers them. The code is small enough to actually read — about 42,000 lines of Swift, no dependencies beyond what Apple ships with macOS, one file per concern.

### Building it

- macOS 14 or later, Xcode 16 / Swift 6 toolchain
- `swift build` — runs the app straight from the SwiftPM binary
- `./build.sh` — assembles a real, double-clickable `Bros.app` in `build/`, ad-hoc signed so it runs on your own Mac. `SEARCH_DEV=1 ./build.sh` makes it a dev build, on a yellow icon and named for its branch (`Search-split-view` from `claude/split-view-4a6927`), so it's never mistaken for an installed Search or for another worktree's build; `SEARCH_FEATURE=name` picks the name. It shares the installed app's settings and its bundle id, so while both run, a link from another app may land in either

A build you make yourself won't be notarized or carry Office Commun's Developer ID, so the first launch needs a right-click → Open (or an allow in System Settings → Privacy & Security). That's expected — it's the same thing that happens with any app that isn't from the App Store or a notarized DMG. Your own build also keeps its passwords apart from a signed Search's: the keychain tells the two apart by their signatures.

`./build.sh release dmg` also makes `Search.dmg` / `Search.zip`. `./build.sh release ship` additionally notarizes and staples — that step needs a Developer ID certificate and Apple credentials, so it only really does anything for Office Commun's own releases.

### How it's put together

- **SwiftUI** for everything drawn, **AppKit** for the handful of things SwiftUI doesn't reach on macOS (the window's title bar, dragging the window by an empty part of the tab row), **WKWebView** for pages.
- One `Tab` per page. Its web view is built lazily — a tab restored from last session doesn't cost a process until you switch to it. That's most of why launching with twenty tabs is still instant. Each page runs in WebKit's own content process, as in Safari; a tab you close is really gone.
- The ad blocker is a `WKContentRuleList` compiled once at launch and enforced inside WebKit's networking, before a request is made — zero cost at run time, unlike a JavaScript blocker.
- Hidden elements are a per-site list of selectors injected as a stylesheet at document start, so nothing is ever seen appearing and vanishing.
- Every colour is a light/dark pair in `Design.swift`, resolved by the window's appearance; nothing else in the code knows which mode it is in.
- Extensions run on `WKWebExtension` (macOS 15.4+). `Crx.swift` fetches an extension from the Chrome Web Store's public update address and checks the CRX3 signature against the extension's id before anything is unpacked. `Extensions.swift` is the browser's side of WebKit's contract — tabs, the window, permissions, popups. `ExtensionShims.swift` adds, at install, a small script to the extension's worker, pages and content scripts: it defines the Chrome APIs WebKit lacks — `userScripts`, `privacy`, `browsingData`, `sessions`, the old FileSystem API and more — as calls answered natively by Search, and mends the places where WebKit behaves differently from Chrome: replies from pages that don't answer, listeners added after a worker starts, workers WebKit loses track of, members and constants it leaves out. Extension pages are served from `chrome-extension://<id>/`, the address they have in Chrome, so servers and sites recognise them. `./bench ext-*` drives all of it from the shell against a test run. `ExtensionNative.swift` speaks Chrome's native messaging to hosts registered in Chrome's `NativeMessagingHosts` folders.
- `Sources/Search/` is one file per concern: `Vault.swift` is the keychain, `Shield.swift` the ad blocker, `Curtain.swift` the hidden elements, `Session.swift` what comes back at launch, `Updater.swift` the update, `Bench.swift` the test socket, and so on. There's no framework of its own to learn first.

### Testing it without closing it

Turn on **Settings › General › Let a script drive Search** and the running app listens on a Unix socket in its own folder (readable by your user only). `./bench` at the root of the repository speaks it:

```
./bench open https://example.com     # a tab of its own, at the end of your row, marked with a flask
./bench wait 2e7e7e89                 # until it has loaded
./bench text 2e7e7e89                 # the page's text
./bench shot 2e7e7e89 out.png         # a picture of it
./bench click 2e7e7e89 "button.go"    # click, type, submit — through the page's own events
./bench probe                         # the window's state: open panels, a modal, every window
./bench close all
```

Bench tabs are never selected for you, never enter the session or the history, and go when the script says so. It is how this browser is tested while somebody is using it.

An agent can drive an isolated copy of Search through `./bench-mcp`, an MCP server over the same socket. Run `./build.sh` from the repository root first, then register the server with your client:

```sh
claude mcp add search-bench -- "$PWD/bench-mcp"
codex mcp add search-bench -- "$PWD/bench-mcp"
agy mcp add --type stdio search-bench "$PWD/bench-mcp"
```

Each session starts this checkout's `build/Bros.app` hidden, in a test world of its own, and wipes that world when it closes; the browser you use is never in reach. Its tools read a page as roles and names, or as an outline of its sections to open one at a time, click with real mouse events, type and check what the field holds, and wait on a condition, and a handle that has gone stale or a button that is covered is an error, never a guess. `python3 Tests/bench_mcp.py` checks it end to end.

To let an agent use the Search you have open instead, turn on Settings › About › Developer › Let coding agents use Search, and give it `./search-mcp`: `claude mcp add search -- "$PWD/search-mcp"`. Search asks you in the window each time one connects, shows a pill with Stop while it is there, and keeps it to tabs of its own; the rules are in `Sources/Search/AgentControl.swift`, and `python3 Tests/agent_control.py` checks them in a hidden probe.

`python3 Tests/split_view.py`, after `./build.sh`, checks Split View through the app's own model in a hidden test run with its own settings and files, all removed afterwards. It never makes or shows a window; what can only be seen (dragging onto a page's edge, the divider under the pointer, the motion) is checked by hand on a release candidate.

### Contributing

Issues and pull requests are genuinely welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for how this is reviewed and what tends to get merged. The short version: small changes, no new dependencies, nothing that phones home. Found a security problem? Please report it privately, as [SECURITY.md](SECURITY.md) says.

### License

MIT — see [LICENSE](LICENSE). Do what you want with the code. "Search" and the app icon are Office Commun's; please rename a fork before distributing it under another name.
