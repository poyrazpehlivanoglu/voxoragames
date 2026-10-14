/* Voxora Games - script.js
   Edit the CONFIG block below to update the site. No build step needed. */

const CONFIG = {
  // Contact links. Leave a value empty ("") to hide that link.
  contact: {
    email: "hello@example.com", // TODO: replace with your real studio email
    discord: "",                // e.g. "https://discord.gg/yourinvite"
    robloxGroup: "",            // e.g. "https://www.roblox.com/communities/123456/Voxora-Games"
    youtube: "",
    x: ""
  },

  // Games shown on the site.
  // status: "live" or "dev". Add "url" (the game's Roblox page) once it is published.
  // These three are placeholder codenames. Replace them with your real projects.
  games: [
    {
      title: "Codename: Ember",
      genre: "Obby",
      status: "dev",
      blurb: "A fast obstacle course where every stage changes the rules of movement.",
      url: "",
      colors: ["#FFB020", "#5B3DF5", "#3F27C7"]
    },
    {
      title: "Codename: Tidepool",
      genre: "Simulator",
      status: "dev",
      blurb: "Collect, grow, and trade creatures from a shoreline that changes with the tide.",
      url: "",
      colors: ["#0FA597", "#5B3DF5", "#3F27C7"]
    },
    {
      title: "Codename: Gearhouse",
      genre: "Tycoon",
      status: "dev",
      blurb: "Build a workshop, automate the boring parts, and invite friends to run it with you.",
      url: "",
      colors: ["#5B3DF5", "#FFB020", "#0FA597"]
    }
  ]
};

/* ---------- Small helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Footer year ---------- */
$("#year").textContent = new Date().getFullYear();

/* ---------- Mobile navigation ---------- */
(function nav() {
  const toggle = $(".nav-toggle");
  const menu = $("#site-nav");
  const close = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("a", menu).forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
})();

/* ---------- Roblox topic tabs ---------- */
(function tabs() {
  const list = $(".tab-list");
  const buttons = $$('[role="tab"]', list);

  function select(btn, focus) {
    buttons.forEach((b) => {
      const on = b === btn;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      $("#" + b.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) btn.focus();
  }

  buttons.forEach((b, i) => {
    b.addEventListener("click", () => select(b, false));
    b.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key === "ArrowRight") next = buttons[(i + 1) % buttons.length];
      if (e.key === "ArrowLeft") next = buttons[(i - 1 + buttons.length) % buttons.length];
      if (e.key === "Home") next = buttons[0];
      if (e.key === "End") next = buttons[buttons.length - 1];
      if (next) {
        e.preventDefault();
        select(next, true);
      }
    });
  });
})();

/* ---------- Games list ---------- */
(function games() {
  const grid = $("#games-grid");
  const NS = "http://www.w3.org/2000/svg";

  function art(colors) {
    // A small isometric stack of blocks. Original artwork, no Roblox assets.
    const [top, left, right] = colors;
    const cube = (cx, cy, s) => {
      const h = s * 0.5;
      return `
        <polygon points="${cx},${cy - h} ${cx + s},${cy} ${cx},${cy + h} ${cx - s},${cy}" fill="${top}"/>
        <polygon points="${cx - s},${cy} ${cx},${cy + h} ${cx},${cy + h + s} ${cx - s},${cy + s}" fill="${left}"/>
        <polygon points="${cx + s},${cy} ${cx},${cy + h} ${cx},${cy + h + s} ${cx + s},${cy + s}" fill="${right}"/>`;
    };
    return `<svg xmlns="${NS}" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="300" height="150" fill="#E4E8F2"/>
      ${cube(110, 96, 34)}${cube(178, 96, 34)}${cube(144, 76, 34)}${cube(144, 40, 34)}
    </svg>`;
  }

  CONFIG.games.forEach((g) => {
    const card = document.createElement("article");
    card.className = "game";
    const isLive = g.status === "live";
    const statusText = isLive ? "Live on Roblox" : "In development";

    const link = g.url
      ? `<a class="game-link" href="${g.url}" target="_blank" rel="noopener">Play on Roblox</a>`
      : `<span class="game-link is-soon">Link coming at launch</span>`;

    card.innerHTML = `
      <div class="game-art">${art(g.colors)}</div>
      <div class="game-body">
        <div class="game-meta">
          <span class="tag ${isLive ? "status-live" : "status-dev"}">${statusText}</span>
          <span class="tag">${g.genre}</span>
        </div>
        <h3></h3>
        <p></p>
        ${link}
      </div>`;
    // Set text separately so titles and blurbs are never read as HTML.
    $("h3", card).textContent = g.title;
    $("p", card).textContent = g.blurb;
    grid.appendChild(card);
  });
})();

/* ---------- Glossary search ---------- */
(function glossary() {
  const input = $("#glossary-search");
  const status = $("#glossary-status");
  const terms = $$(".term");
  const originals = terms.map((t) => ({
    dt: $("dt", t).textContent,
    dd: $("dd", t).textContent
  }));

  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function mark(text, q) {
    if (!q) return document.createTextNode(text);
    const frag = document.createDocumentFragment();
    const re = new RegExp(escape(q), "ig");
    let last = 0;
    let m;
    while ((m = re.exec(text))) {
      if (m.index > last) frag.append(text.slice(last, m.index));
      const el = document.createElement("mark");
      el.textContent = m[0];
      frag.append(el);
      last = m.index + m[0].length;
    }
    frag.append(text.slice(last));
    return frag;
  }

  function filter() {
    const q = input.value.trim();
    let shown = 0;
    terms.forEach((t, i) => {
      const { dt, dd } = originals[i];
      const hit = !q || (dt + " " + dd).toLowerCase().includes(q.toLowerCase());
      t.hidden = !hit;
      const dtEl = $("dt", t);
      const ddEl = $("dd", t);
      dtEl.replaceChildren(mark(dt, hit ? q : ""));
      ddEl.replaceChildren(mark(dd, hit ? q : ""));
      if (hit) shown++;
    });
    if (!q) status.textContent = "";
    else if (shown === 0) status.textContent = `No terms match "${q}". Try a shorter word.`;
    else status.textContent = `${shown} ${shown === 1 ? "term" : "terms"} found.`;
  }

  input.addEventListener("input", filter);
})();

/* ---------- Contact links ---------- */
(function contact() {
  const list = $("#contact-list");
  const c = CONFIG.contact;
  const items = [
    c.email && { label: "Email", value: c.email, href: "mailto:" + c.email },
    c.discord && { label: "Discord", value: "Join our server", href: c.discord },
    c.robloxGroup && { label: "Roblox community", value: "Join the group on Roblox", href: c.robloxGroup },
    c.youtube && { label: "YouTube", value: "Watch updates", href: c.youtube },
    c.x && { label: "X", value: "Follow for news", href: c.x }
  ].filter(Boolean);

  items.forEach((it) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = it.href;
    if (!it.href.startsWith("mailto:")) {
      a.target = "_blank";
      a.rel = "noopener";
    }
    const l = document.createElement("span");
    l.className = "c-label";
    l.textContent = it.label;
    const v = document.createElement("span");
    v.className = "c-value";
    v.textContent = it.value;
    a.append(l, v);
    li.append(a);
    list.append(li);
  });
})();

/* ---------- Hero: isometric block terrain ---------- */
(function voxel() {
  const canvas = $("#voxel");
  const resetBtn = $("#voxel-reset");
  const ctx = canvas.getContext("2d");

  const N = 12;               // grid size
  const MAX_EXTRA = 4;        // max blocks a player can stack on one cell
  const stops = [[15, 165, 151], [91, 61, 245], [255, 176, 32]]; // teal, violet, amber

  const target = [];
  const cur = [];
  const extra = [];
  for (let i = 0; i < N; i++) {
    target.push(new Array(N).fill(0));
    cur.push(new Array(N).fill(0));
    extra.push(new Array(N).fill(0));
  }

  let w = 0, h = 0, dpr = 1;
  let tw = 0, th = 0, bh = 0, ox = 0, oy = 0;
  let pointer = null;
  let running = false;
  let visible = true;
  let time = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fit the whole grid, plus room for the tallest stack, inside the canvas.
    const rise = 6; // block heights of headroom
    tw = Math.min(w / N, h / (rise * 0.45 + (N + 1) / 4));
    th = tw / 2;
    bh = tw * 0.45;
    const totalH = rise * bh + N * th + th;
    ox = w / 2;
    oy = (h - totalH) / 2 + rise * bh + th / 2;
    draw();
  }

  function cellCenter(i, j) {
    return { x: ox + ((i - j) * tw) / 2, y: oy + ((i + j) * th) / 2 };
  }

  function mix(t) {
    t = Math.max(0, Math.min(1, t)) * (stops.length - 1);
    const a = Math.floor(t);
    const b = Math.min(a + 1, stops.length - 1);
    const f = t - a;
    return stops[a].map((v, k) => v + (stops[b][k] - v) * f);
  }

  const rgb = (c, s) => `rgb(${Math.round(c[0] * s)},${Math.round(c[1] * s)},${Math.round(c[2] * s)})`;

  function computeTargets() {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        let base = 1.4 + 0.9 * Math.sin(i * 0.6 + time) + 0.9 * Math.sin(j * 0.55 - time * 0.8);
        let bump = 0;
        if (pointer) {
          const c = cellCenter(i, j);
          const d = Math.hypot(c.x - pointer.x, c.y - cur[i][j] * bh - pointer.y);
          bump = Math.max(0, 1 - d / (tw * 2.4)) * 2.5;
        }
        target[i][j] = Math.round((base + bump) * 2) / 2 + extra[i][j];
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const H = Math.max(0.5, cur[i][j]);
        const c = cellCenter(i, j);
        const cx = c.x;
        const cy = c.y;
        const ty = cy - H * bh;
        const col = mix(H / 6);

        ctx.fillStyle = rgb(col, 1);
        ctx.beginPath();
        ctx.moveTo(cx, ty - th / 2);
        ctx.lineTo(cx + tw / 2, ty);
        ctx.lineTo(cx, ty + th / 2);
        ctx.lineTo(cx - tw / 2, ty);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = rgb(col, 0.8);
        ctx.beginPath();
        ctx.moveTo(cx - tw / 2, ty);
        ctx.lineTo(cx, ty + th / 2);
        ctx.lineTo(cx, cy + th / 2);
        ctx.lineTo(cx - tw / 2, cy);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = rgb(col, 0.62);
        ctx.beginPath();
        ctx.moveTo(cx + tw / 2, ty);
        ctx.lineTo(cx, ty + th / 2);
        ctx.lineTo(cx, cy + th / 2);
        ctx.lineTo(cx + tw / 2, cy);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  function tick() {
    if (!running) return;
    time += 0.012;
    computeTargets();
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        cur[i][j] += (target[i][j] - cur[i][j]) * 0.12;
      }
    }
    draw();
    requestAnimationFrame(tick);
  }

  function start() {
    if (reduceMotion || running || !visible) return;
    running = true;
    requestAnimationFrame(tick);
  }
  function stop() { running = false; }

  function settle() {
    computeTargets();
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) cur[i][j] = target[i][j];
    draw();
  }

  function toCanvas(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function nearestCell(p) {
    let best = null;
    let bestD = Infinity;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const c = cellCenter(i, j);
        const d = Math.hypot(c.x - p.x, c.y - cur[i][j] * bh - p.y);
        if (d < bestD) { bestD = d; best = [i, j]; }
      }
    }
    return best;
  }

  canvas.addEventListener("pointermove", (e) => {
    pointer = toCanvas(e);
    if (reduceMotion) settle();
  });
  canvas.addEventListener("pointerleave", () => {
    pointer = null;
    if (reduceMotion) settle();
  });
  canvas.addEventListener("pointerdown", (e) => {
    const p = toCanvas(e);
    const cell = nearestCell(p);
    if (!cell) return;
    const [i, j] = cell;
    extra[i][j] = extra[i][j] >= MAX_EXTRA ? 0 : extra[i][j] + 1;
    if (reduceMotion) settle();
  });

  resetBtn.addEventListener("click", () => {
    for (let i = 0; i < N; i++) extra[i].fill(0);
    if (reduceMotion) settle();
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      visible ? start() : stop();
    }).observe(canvas);
  }

  window.addEventListener("resize", resize);
  resize();
  computeTargets();
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) cur[i][j] = target[i][j];
  draw();
  start();
})();
