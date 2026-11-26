/* brOS landing: lingua, shader dell'hero, effetto pixel sugli screenshot, apparizione allo scroll. Pubblicata da Vercel a ogni push su main. */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Lingua ---------- */
  var TITLES = {
    it: "brOS · Il browser per Mac che tratta le tab come file",
    en: "brOS · The Mac browser that treats tabs like files"
  };
  var DESCS = {
    it: "brOS è un browser per Mac gratuito che mostra le tab aperte come file in una finestra del Finder. Fork di Search, con un Workspace: Inbox, cartelle, scadenze.",
    en: "brOS is a free Mac browser that shows your open tabs like files in a Finder window. A fork of Search with a Workspace: Inbox, folders, due dates."
  };
  function setLang(l, save) {
    doc.dataset.lang = l; doc.lang = l;
    document.title = TITLES[l];
    var m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", DESCS[l]);
    document.querySelectorAll("[data-set-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.setLang === l));
    });
    if (save) { try { localStorage.setItem("bros-lang", l); } catch (e) {} }
    // dentro il portfolio il titolo della scheda segue la lingua scelta
    try { if (window.self !== window.top) window.parent.document.title = TITLES[l]; } catch (e) {}
  }

  // Dentro il portfolio (iframe) compare il link di ritorno, che riporta alla lista Ideas
  try {
    if (window.self !== window.top) {
      var back = document.querySelector(".back");
      if (back) {
        back.hidden = false;
        back.addEventListener("click", function (e) {
          try { window.top.location.hash = "#/ideas"; e.preventDefault(); } catch (err) {}
        });
      }
    }
  } catch (e) {}
  document.querySelectorAll("[data-set-lang]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.setLang, true); });
  });
  setLang(doc.dataset.lang, false);

  /* ---------- Apparizione allo scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Shader dell'hero: rumore a flusso, pixelato e retinato (dither) ---------- */
  (function shader() {
    var cv = document.getElementById("shader");
    if (!cv) return;
    var gl = cv.getContext("webgl", { antialias: false, alpha: true });
    if (!gl) return; // senza WebGL resta lo sfondo nero

    var VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    var FS = [
      "precision mediump float;",
      "uniform vec2 r;uniform float t;uniform vec2 m;",
      "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
      "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);",
      " return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}",
      "float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}",
      "float b2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}",
      "float b4(vec2 a){return b2(.5*a)*.25+b2(a);}",
      "void main(){",
      " vec2 p=(gl_FragCoord.xy-.5*r)/r.y;",
      " vec2 q=p*2.4;",
      " vec2 w=vec2(fbm(q+vec2(0.,t*.05)),fbm(q+vec2(5.2,1.3)-t*.04));",
      " float f=fbm(q+2.2*w+t*.03);",
      " float ridge=abs(sin((f*5.+p.y*1.6-t*.07)*3.14159));",
      " float v=f*.75+ridge*.25;",
      " float d=length(p-m);",
      " v+=exp(-d*3.2)*.38;",
      " v=pow(clamp(v,0.,1.),3.4)*1.7;",
      " float s=v*3.;",
      " float l=min((floor(s)+step(b4(gl_FragCoord.xy),fract(s)))/3.,1.);",
      " vec3 hot=mix(vec3(.92,.16,.0),vec3(1.,.48,.06),smoothstep(.35,1.,l));",
      " vec3 c=hot*l*l+vec3(.05)*l;",
      " gl_FragColor=vec4(c*1.0,1.);",
      "}"
    ].join("\n");

    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uR = gl.getUniformLocation(pr, "r"), uT = gl.getUniformLocation(pr, "t"), uM = gl.getUniformLocation(pr, "m");

    var CELL = window.innerWidth < 700 ? 5 : 8; // dimensione del "pixel" in px CSS
    var mx = 0.25, my = 0.15, tx = mx, ty = my; // puntatore, in unità di altezza
    function size() {
      var w = Math.max(1, Math.ceil(cv.clientWidth / CELL)), h = Math.max(1, Math.ceil(cv.clientHeight / CELL));
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
    }
    function draw(t) {
      size();
      mx += (tx - mx) * 0.06; my += (ty - my) * 0.06;
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uT, t);
      gl.uniform2f(uM, mx, my);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    window.addEventListener("pointermove", function (e) {
      var b = cv.getBoundingClientRect();
      if (!b.height) return;
      tx = (e.clientX - b.left - b.width / 2) / b.height;
      ty = -(e.clientY - b.top - b.height / 2) / b.height;
    }, { passive: true });

    if (reduce) { draw(14); window.addEventListener("resize", function () { draw(14); }); return; }

    var visible = true, last = 0, start = performance.now();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(cv);
    }
    (function loop(now) {
      requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 33) return; // circa 30 fps
      last = now;
      draw((now - start) / 1000 + 14);
    })(performance.now());
  })();


  /* ---------- Dithering: matrice di Bayer 4x4, in arancione ---------- */
  var BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
  var ORANGE = [255, 122, 26];
  function thr(x, y) { return (BAYER[y & 3][x & 3] + 0.5) / 16; }
  // Immagine -> arancione a N livelli di luminosita', retinato
  function ditherPixels(id, levels, done) {
    var d = id.data, w = id.width;
    for (var i = 0, p = 0; i < d.length; i += 4, p++) {
      var L = Math.pow((d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11) / 255, 0.8) * levels;
      var f = L - Math.floor(L), lv = Math.min(1, (Math.floor(L) + (f > thr(p % w, (p / w) | 0) ? 1 : 0)) / levels);
      d[i] = ORANGE[0] * lv; d[i + 1] = ORANGE[1] * lv; d[i + 2] = ORANGE[2] * lv; d[i + 3] = 255;
    }
    done(id);
  }
  // Sfumatura retinata disegnata su un canvas (verso: down = sfuma dall'alto verso il basso, up = il contrario, mid = al centro)
  function ditherGradient(cv, o) {
    var cell = o.cell || 6, w = Math.max(1, Math.ceil(cv.clientWidth / cell)), h = Math.max(1, Math.ceil(cv.clientHeight / cell));
    cv.width = w; cv.height = h;
    var ctx = cv.getContext("2d"), id = ctx.createImageData(w, h), d = id.data, levels = o.levels || 3;
    for (var y = 0; y < h; y++) {
      var t = h > 1 ? y / (h - 1) : 1;
      if (o.dir === "up") t = 1 - t; else if (o.dir === "mid") t = 1 - Math.abs(2 * t - 1);
      var v = Math.pow(t, o.pow || 1.6) * levels;
      for (var x = 0; x < w; x++) {
        var f = v - Math.floor(v), lv = Math.min(levels, Math.floor(v) + (f > thr(x, y) ? 1 : 0)) / levels, k = (y * w + x) * 4;
        d[k] = ORANGE[0]; d[k + 1] = ORANGE[1]; d[k + 2] = ORANGE[2]; d[k + 3] = Math.round(255 * lv * (o.alpha || 0.4));
      }
    }
    ctx.putImageData(id, 0, 0);
  }
  var bands = document.querySelectorAll("[data-dither]");
  function paintBands() {
    bands.forEach(function (el) {
      var cv = el.querySelector("canvas"); if (!cv) return;
      ditherGradient(cv, { dir: el.dataset.dither, alpha: parseFloat(el.dataset.alpha) || 0.4, cell: parseInt(el.dataset.cell, 10) || 3, pow: parseFloat(el.dataset.pow) || 1.6 });
    });
  }
  // Bagliore retinato nelle celle: compare a gradini al passaggio del mouse
  document.querySelectorAll(".fc, .k").forEach(function (cell) {
    var cv = document.createElement("canvas"); cv.className = "dglow"; cv.setAttribute("aria-hidden", "true");
    cell.insertBefore(cv, cell.firstChild);
  });
  function paintGlows() {
    document.querySelectorAll(".dglow").forEach(function (cv) { ditherGradient(cv, { dir: "down", alpha: 0.26, cell: 2, pow: 1.4 }); });
  }
  paintBands(); paintGlows();
  var rz; addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(function () { paintBands(); paintGlows(); }, 200); });

  /* ---------- Screenshot reali: compaiono con un effetto pixel che si scioglie ---------- */
  function pixelReveal(img) {
    var shot = img.closest(".shot"), body = img.parentElement;
    shot.classList.add("has-img");
    if (reduce || !("IntersectionObserver" in window)) { img.classList.add("on"); return; }

    var cv = document.createElement("canvas");
    cv.className = "px";
    body.appendChild(cv);
    var px = parseFloat(img.dataset.px), py = parseFloat(img.dataset.py);
    if (isNaN(px)) px = 0.5; if (isNaN(py)) py = 0.5;

    function run() {
      var w = body.clientWidth, h = body.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      var full = document.createElement("canvas");
      full.width = cv.width; full.height = cv.height;
      var fx = full.getContext("2d");
      var s = Math.max(full.width / img.naturalWidth, full.height / img.naturalHeight);
      var dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      fx.drawImage(img, (full.width - dw) * px, (full.height - dh) * py, dw, dh);

      var ctx = cv.getContext("2d"), steps = [{ c: 3, l: 1 }, { c: 2, l: 3 }, 36, 18, 9, 5, 0], i = 0;
      (function step() {
        var st = steps[i];
        if (st === 0) { img.classList.add("on"); cv.remove(); return; }
        var cells = typeof st === "object" ? st.c : st;
        var tw = Math.max(1, Math.round(cv.width / (cells * dpr))), th = Math.max(1, Math.round(cv.height / (cells * dpr)));
        var tiny = document.createElement("canvas"); tiny.width = tw; tiny.height = th;
        var tctx = tiny.getContext("2d");
        tctx.drawImage(full, 0, 0, tw, th);
        if (typeof st === "object") ditherPixels(tctx.getImageData(0, 0, tw, th), st.l, function (d) { tctx.putImageData(d, 0, 0); });
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tiny, 0, 0, cv.width, cv.height);
        i++; setTimeout(step, typeof st === "object" ? 150 : 110);
      })();
    }
    if (img.hasAttribute("data-now")) { run(); return; }
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { io.disconnect(); run(); }
    }, { threshold: 0.25 });
    io.observe(body);
  }
  document.querySelectorAll("img[data-shot]").forEach(function (img) {
    function ok() { if (img.naturalWidth) pixelReveal(img); }
    if (img.complete) ok(); else img.addEventListener("load", ok);
    // se il file manca resta il segnaposto
  });

  /* ---------- Icone: in hover si pixelano per un attimo (griglia che si affina, poi il tratto pulito) ---------- */
  (function iconHover() {
    var COLOR = "#ff7a1a", STEPS = [4, 5, 6, 8, 10, 13, 17, 24], FRAME = 90; // circa 0,7 s in tutto
    document.querySelectorAll(".fc .ic").forEach(function (svg) {
      var host = svg.closest(".fc"), wrap = document.createElement("span");
      wrap.className = "icw"; svg.parentNode.insertBefore(wrap, svg); wrap.appendChild(svg);
      if (reduce) return;
      var image = null, ready = false, busy = false;
      function load() {
        if (image) return;
        var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96" fill="none" stroke="' + COLOR +
                '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + svg.innerHTML + "</svg>";
        image = new Image(); image.onload = function () { ready = true; };
        image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
      }
      function play() {
        if (busy || !ready) { load(); return; }
        busy = true;
        var cv = document.createElement("canvas"), size = 56; cv.width = cv.height = size; wrap.appendChild(cv);
        var ctx = cv.getContext("2d"), i = 0; svg.style.opacity = "0";
        (function step() {
          if (i >= STEPS.length) { cv.remove(); svg.style.opacity = ""; busy = false; return; }
          var n = STEPS[i++], tiny = document.createElement("canvas"); tiny.width = tiny.height = n;
          tiny.getContext("2d").drawImage(image, 0, 0, n, n);
          ctx.clearRect(0, 0, size, size); ctx.imageSmoothingEnabled = false; ctx.drawImage(tiny, 0, 0, size, size);
          setTimeout(step, FRAME);
        })();
      }
      host.addEventListener("mouseenter", play);
      host.addEventListener("pointerdown", load);
      load();
    });
  })();

  /* ---------- Versione e DMG: letti dall'ultima release dell'app, cosi' la pagina e' sempre aggiornata ---------- */
  (function release() {
    var line = document.querySelector("[data-rel]");
    function size(b, it) { var s = (b / 1048576).toFixed(1); return it ? s.replace(".", ",") : s; }
    function apply(r) {
      if (!r || !r.tag) return;
      document.querySelectorAll("[data-download]").forEach(function (a) { if (r.dmg_url) a.href = r.dmg_url; });
      document.querySelectorAll("[data-dmg]").forEach(function (c) { if (r.dmg_name) c.textContent = r.dmg_name; });
      if (!line) return;
      var v = r.tag.replace(/^v/, ""), d = new Date(r.published_at), parts = { it: [], en: [] };
      var date = function (loc) { return isNaN(d) ? "" : d.toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" }); };
      line.innerHTML =
        '<span lang="it">Versione ' + v + (r.dmg_size ? " · DMG " + size(r.dmg_size, true) + " MB" : "") + (date("it-IT") ? " · " + date("it-IT") : "") + "</span>" +
        '<span lang="en">Version ' + v + (r.dmg_size ? " · DMG " + size(r.dmg_size, false) + " MB" : "") + (date("en-GB") ? " · " + date("en-GB") : "") + "</span>";
      line.hidden = false;
    }
    function fallback() { fetch("release.json").then(function (x) { return x.json(); }).then(apply).catch(function () {}); }
    var cached = null;
    try { cached = JSON.parse(sessionStorage.getItem("bros-rel") || "null"); } catch (e) {}
    if (cached && Date.now() - cached.at < 30 * 60 * 1000) { apply(cached.r); return; }
    fetch("https://api.github.com/repos/MEPoss/bros/releases/latest", { headers: { Accept: "application/vnd.github+json" } })
      .then(function (x) { if (!x.ok) throw new Error(x.status); return x.json(); })
      .then(function (g) {
        var a = (g.assets || []).filter(function (s) { return /\.dmg$/i.test(s.name); })[0];
        var r = { tag: g.tag_name, published_at: g.published_at, dmg_name: a && a.name, dmg_url: a && a.browser_download_url, dmg_size: a && a.size };
        try { sessionStorage.setItem("bros-rel", JSON.stringify({ at: Date.now(), r: r })); } catch (e) {}
        apply(r);
      })
      .catch(fallback);
  })();
})();
