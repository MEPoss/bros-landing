/* brOS landing: lingua, shader dell'hero, effetto pixel sugli screenshot, apparizione allo scroll */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Lingua ---------- */
  var TITLES = {
    it: "brOS · Il browser che tratta le tue pagine come file",
    en: "brOS · The browser that treats your pages like files"
  };
  var DESCS = {
    it: "brOS è un browser per Mac che mostra le tab aperte come file in una finestra del Finder. Fork di Search, con un Workspace per ordinare le pagine.",
    en: "brOS is a Mac browser that shows your open tabs like files in a Finder window. A fork of Search, with a Workspace to sort your pages."
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
      " float l=(floor(s)+step(b4(gl_FragCoord.xy),fract(s)))/3.;",
      " vec3 hot=mix(vec3(.95,.26,.12),vec3(1.,.80,.32),l);",
      " vec3 c=hot*l*l+vec3(.10)*l;",
      " gl_FragColor=vec4(c*.5,1.);",
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

    var CELL = window.innerWidth < 700 ? 4 : 5; // dimensione del "pixel" in px CSS
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

      var ctx = cv.getContext("2d"), steps = [36, 18, 9, 5, 0], i = 0;
      (function step() {
        var cells = steps[i];
        if (!cells) { img.classList.add("on"); cv.remove(); return; }
        var tw = Math.max(1, Math.round(cv.width / (cells * dpr))), th = Math.max(1, Math.round(cv.height / (cells * dpr)));
        var tiny = document.createElement("canvas"); tiny.width = tw; tiny.height = th;
        tiny.getContext("2d").drawImage(full, 0, 0, tw, th);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tiny, 0, 0, cv.width, cv.height);
        i++; setTimeout(step, 120);
      })();
    }
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
})();
