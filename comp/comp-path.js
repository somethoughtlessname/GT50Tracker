(function() {
    // ===== PATH COMPONENT =====
    // A path is a set of real cards (LIST, CHECKLIST, RADIO, THRESHOLD) joined by "comes after" links,
    // for games where what you can do next depends on what you've done and what you chose.
    //
    // A node:  { id, card: { type, state }, after: [{ id, opt }], optional, missable, doneAt }
    //   card     an ordinary card; it draws itself with its own comp file (renderView / renderBuild)
    //   after    what it needs: every linked card done. opt = a RADIO option index ("only if this was picked")
    //   optional shown on the path, doesn't count toward progress
    //   missable optional cards only: drops off once the story moves past the card it hangs off
    //
    // The path card opens a full-screen window: VIEW mode plays the path (what's available now,
    // optional cards, done in completion order, missed); EDIT mode opens the builder
    // (LIST: cards + automatic map, GRID: build on the map itself).

    window.GT50Lib = window.GT50Lib || {};
    const esc = s => (window.GT50 && GT50.escapeHTML) ? GT50.escapeHTML(s) : String(s == null ? '' : s);
    const NODE_TYPES = ['list', 'checklist', 'radio', 'threshold', 'progress'];
    const TYPE_NAME = { list: 'LIST', checklist: 'CHECKLIST', radio: 'RADIO', threshold: 'THRESHOLD', progress: 'PROGRESS' };

    // ===== ICONS =====
    const ICON = {
        // node graph: a hollow start node branching to two solid nodes, drawn a little smaller inside the box
        path: (c = 'currentColor', s = 22) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-linecap="round" stroke-linejoin="round" style="display:block">
            <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="4" stroke-width="3.2"/>
            <g transform="translate(12 12) scale(.82) translate(-12 -12)">
            <circle cx="7.6" cy="12" r="2.4" stroke-width="1.95"/><circle cx="16.2" cy="7.6" r="2.5" fill="${c}" stroke="none"/><circle cx="16.2" cy="16.4" r="2.5" fill="${c}" stroke="none"/>
            <path d="M9.6 10.9L16.2 7.6M9.6 13.1L16.2 16.4" stroke-width="1.85"/></g></svg>`,
        check: (c = '#fff') => `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg>`,
        down: `<svg viewBox="0 0 12 12" width="10" height="10"><path d="M1.5 3.5h9L6 9z" fill="#fff" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
        type: {
            list: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="12" height="12" rx="3"/></svg>',
            checklist: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l1.5 1.5L6 3M2 11l1.5 1.5L6 10M9 4.5h5M9 11.5h5"/></svg>',
            radio: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="3.5" r="2"/><path d="M8 5.5v2.5M8 8l-4.5 4M8 8l4.5 4"/><circle cx="3" cy="13" r="1.2" fill="#fff"/><circle cx="13" cy="13" r="1.2" fill="#fff"/></svg>',
            threshold: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"><rect x="4" y="4" width="8" height="8" rx="1.5" transform="rotate(45 8 8)"/></svg>',
            progress: '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><rect x="1.8" y="5" width="12.4" height="6" rx="2"/><path d="M4.5 8h3.5"/></svg>'
        }
    };

    // ===== CARD HELPERS (the real card types) =====
    const typeDef = t => (window.GT50 && GT50.getType) ? GT50.getType(t) : null;
    const title = n => (n.card.state && n.card.state.title) || 'Untitled';
    const options = n => n.card.type === 'radio' ? (n.card.state.items || []).map(i => i.text || '') : [];
    const picked = n => { const s = n.card.state.selectedIndex; return s === undefined ? null : s; };
    function cardDone(n) {
        const d = typeDef(n.card.type);
        try { return !!(d && d.info(n.card.state).done); } catch (e) { return false; }
    }
    function newCard(type) {
        const d = typeDef(type);
        return { type, state: d ? d.lib.defaultState() : { title: '' } };
    }

    // ===== PATH LOGIC =====
    const byId = (P, id) => P.nodes.find(n => n.id === id);
    function linkCut(P, link, memo) {
        const p = byId(P, link.id); if (!p) return true;
        if (lockedOut(P, p, memo)) return true;
        return link.opt !== undefined && picked(p) !== null && picked(p) !== link.opt;
    }
    // Locked out = every way in is cut (a card fed by rival branches survives either choice),
    // or a choice it depends on went another way
    function lockedOut(P, n, memo = new Map()) {
        if (memo.has(n.id)) return memo.get(n.id);
        memo.set(n.id, false);
        const v = n.after.length > 0 && (n.after.every(l => linkCut(P, l, memo)) || n.after.some(l => l.opt !== undefined && linkCut(P, l, memo)));
        memo.set(n.id, v); return v;
    }
    function linkMet(P, link) {
        const p = byId(P, link.id);
        if (!p || !cardDone(p)) return false;
        return link.opt === undefined || picked(p) === link.opt;
    }
    // Missed = a missable optional card whose moment has passed: a non-optional card after the same card is done.
    // Optional cards that only hang off missed cards are missed too.
    function isMissed(P, n) {
        if (!n.optional || cardDone(n) || !n.after.length) return false;
        if (n.missable && n.after.some(l => P.nodes.some(c => c !== n && !c.optional && c.after.some(cl => cl.id === l.id) && cardDone(c)))) return true;
        return n.after.every(l => { const p = byId(P, l.id); return p && p.optional && status(P, p) === 'missed'; });
    }
    function status(P, n) {
        if (cardDone(n)) return 'done';
        if (lockedOut(P, n)) return 'locked';
        if (isMissed(P, n)) return 'missed';
        const live = n.after.filter(l => !linkCut(P, l, new Map()));
        return live.every(l => linkMet(P, l)) ? 'available' : 'later';
    }
    const counted = P => P.nodes.filter(n => !n.optional && !lockedOut(P, n));
    function progress(P) { const c = counted(P); return { done: c.filter(cardDone).length, total: c.length }; }
    function stamp(P) {
        P.nodes.forEach(n => { const c = cardDone(n); if (c && !n.doneAt) n.doneAt = ++P.stampSeq; if (!c) n.doneAt = null; });
    }
    function depthOf(P, n, seen = new Set()) {
        if (!n.after.length || seen.has(n.id)) return 0;
        seen.add(n.id);
        return 1 + Math.max(...n.after.map(l => { const p = byId(P, l.id); return p ? depthOf(P, p, new Set(seen)) : -1; }));
    }
    function descendants(P, id, acc = new Set()) {
        P.nodes.forEach(c => { if (c.after.some(l => l.id === id) && !acc.has(c.id)) { acc.add(c.id); descendants(P, c.id, acc); } });
        return acc;
    }
    const ordered = P => [...P.nodes].sort((a, b) => depthOf(P, a) - depthOf(P, b) || P.nodes.indexOf(a) - P.nodes.indexOf(b));
    function addNode(P, type, extra = {}) {
        const n = { id: 'p' + (++P.seq), card: newCard(type), after: [], optional: false, missable: false, doneAt: null, ...extra };
        P.nodes.push(n); return n;
    }
    function removeNode(P, id) {
        P.nodes = P.nodes.filter(x => x.id !== id);
        P.nodes.forEach(c => c.after = c.after.filter(l => l.id !== id));
        if (P.gridLayout) Object.keys(P.gridLayout).forEach(k => { if (k === id || k.startsWith(id + '#')) delete P.gridLayout[k]; });
    }

    // ===== STYLES =====
    function injectStyles() {
        if (document.getElementById('gt-path-style')) return;
        const css = document.createElement('style');
        css.id = 'gt-path-style';
        css.textContent = `
        .gp-ov { position: fixed; inset: 0; z-index: 4000; background: var(--bg-1); display: flex; flex-direction: column; }
        .gp-ov * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        .gp-band { flex: none; position: relative; z-index: 5; }
        .gp-band::after { content: ''; position: absolute; left: 0; right: 0; top: 100%; height: 12px; pointer-events: none; background: linear-gradient(180deg, rgba(0,0,0,.3), rgba(0,0,0,0)); }
        .gp-play { flex: 1; overflow-y: auto; padding: 8px var(--margin) 40px; }
        .gp-sec { border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); overflow: hidden; margin-bottom: var(--margin); }
        .gp-sec > .gp-sh { display: flex; height: calc(var(--card-height) - 2 * var(--border-width)); align-items: center; justify-content: center; color: var(--color-10); font-weight: 800; font-size: 12px; letter-spacing: .06em; position: relative; }
        .gp-sec > .gp-sh .gp-arr { position: absolute; right: 0; top: 0; bottom: 0; width: var(--square-section); border-left: var(--border-width) solid var(--border-color); display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.18); }
        .gp-sec.open > .gp-sh .gp-arr svg { transform: rotate(180deg); }
        .gp-sec > .gp-sb { display: none; background: var(--bg-2); border-top: var(--border-width) solid var(--border-color); padding: var(--margin) var(--margin) 0; }
        .gp-sec.open > .gp-sb { display: flow-root; }
        .gp-sec.toggle > .gp-sh { cursor: pointer; }
        .gp-sec { background: var(--bg-2); } .gp-done > .gp-sh, .gp-opt > .gp-sh { background: var(--color-9); } .gp-miss > .gp-sh { background: var(--color-1); }
        .gp-mini { --card-height: 28px; --square-section: 22px; --check-size: 12px; }
        .gp-mini input { font-size: 12px !important; }
        .gp-note { font-size: 10px; font-weight: 700; color: var(--color-10); background: var(--bg-3); border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); padding: 5px 8px; text-align: center; margin-bottom: var(--margin); }
        .gp-empty { text-align: center; font-size: 12px; font-weight: 700; color: var(--color-9); padding: 14px 0; }
        .gp-bar { height: 22px; border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); background: var(--bg-4); position: relative; overflow: hidden; margin-bottom: var(--margin); }
        .gp-bar i { position: absolute; left: 0; top: 0; bottom: 0; background: var(--accent); }
        .gp-bar.full i { background: var(--gold); }
        .gp-bar b { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: var(--color-10); font-size: 10px; font-weight: 800; letter-spacing: .05em; }
        /* builder */
        .gp-build { flex: 1; display: flex; flex-direction: column; min-height: 0; position: relative; }
        .gp-seg { display: flex; height: 30px; border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); overflow: hidden; background: var(--color-10); flex: none; }
        .gp-seg > div { flex: 1; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 10px; letter-spacing: .04em; cursor: pointer; color: #000; }
        .gp-seg > div + div { border-left: var(--border-width) solid var(--border-color); }
        .gp-seg > div.on { background: var(--color-5); color: var(--color-10); }
        .gp-bmode { margin: 6px var(--margin) 0; }
        .gp-list { flex: 1; overflow-y: auto; padding: 6px var(--margin) var(--margin); min-height: 0; }
        .gp-node { border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); overflow: hidden; margin-bottom: var(--margin); background: var(--color-5); }
        .gp-node.optional { border-style: dashed; }
        .gp-node.sel { box-shadow: 0 0 0 3px var(--gold); }
        .gp-bn { display: flex; height: 39px; cursor: pointer; }
        .gp-bn .gp-ico { width: var(--square-section); min-width: var(--square-section); border-right: var(--border-width) solid var(--border-color); display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,.12); }
        .gp-bn .gp-nm { flex: 1; display: flex; align-items: center; padding: 0 8px; color: var(--color-10); font-weight: 700; font-size: 13px; min-width: 0; }
        .gp-bn .gp-nm span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .gp-bn .gp-af { font-size: 9px; font-weight: 700; color: rgba(255,255,255,.7); padding-right: 8px; display: flex; align-items: center; white-space: nowrap; max-width: 45%; overflow: hidden; }
        .gp-bn .gp-x { width: var(--square-section); border-left: var(--border-width) solid var(--border-color); display: flex; align-items: center; justify-content: center; color: var(--color-10); font-weight: 800; background: var(--color-1); }
        .gp-ed { background: var(--bg-2); border-top: var(--border-width) solid var(--border-color); padding: var(--margin); }
        .gp-lbl { font-size: 9px; font-weight: 800; letter-spacing: .08em; color: #c9bfae; margin: 8px 2px 3px; }
        .gp-lbl:first-child { margin-top: 2px; }
        .gp-types { display: flex; border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); overflow: hidden; height: 30px; background: var(--bg-4); }
        .gp-types > div { flex: 1; display: flex; align-items: center; justify-content: center; color: var(--color-10); font-size: 9px; font-weight: 800; letter-spacing: .04em; cursor: pointer; }
        .gp-types > div + div { border-left: var(--border-width) solid var(--border-color); }
        .gp-types > div.on { background: var(--color-5); }
        .gp-after { border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); overflow: hidden; background: var(--bg-5); }
        .gp-after > .gp-ah { display: flex; min-height: 36px; cursor: pointer; }
        .gp-after .gp-ak { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 3px 8px; min-width: 0; }
        .gp-after .gp-ak small { font-size: 8.5px; font-weight: 800; letter-spacing: .08em; color: #c9bfae; }
        .gp-after .gp-ak span { font-size: 12px; font-weight: 700; color: var(--color-10); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .gp-after .gp-ac { padding: 0 8px; display: flex; align-items: center; color: var(--color-10); font-weight: 800; font-size: 12px; }
        .gp-after .gp-aa { width: var(--square-section); border-left: var(--border-width) solid var(--border-color); display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.18); }
        .gp-after.open .gp-aa svg { transform: rotate(180deg); }
        .gp-after > .gp-ad { display: none; background: var(--bg-2); border-top: var(--border-width) solid var(--border-color); padding: 4px; }
        .gp-after.open > .gp-ad { display: block; }
        .gp-row { display: flex; height: 30px; border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); overflow: hidden; margin-bottom: 4px; background: var(--bg-4); cursor: pointer; }
        .gp-row.on { background: var(--accent); }
        .gp-row.sub { margin-left: 16px; }
        .gp-row .gp-sq { width: 30px; min-width: 30px; background: var(--color-10); border-right: var(--border-width) solid var(--border-color); display: flex; align-items: center; justify-content: center; }
        .gp-row.on .gp-sq { background: var(--accent); }
        .gp-row .gp-rn { flex: 1; display: flex; align-items: center; padding: 0 8px; color: var(--color-10); font-size: 12px; font-weight: 600; min-width: 0; }
        .gp-row .gp-rn span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .gp-subhead { display: flex; align-items: center; gap: 6px; color: #c9bfae; font-size: 10px; font-weight: 800; letter-spacing: .04em; margin: 6px 2px 4px; }
        .gp-hint { font-size: 10px; font-weight: 600; color: var(--color-10); background: var(--bg-3); border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); padding: 6px 8px; margin-top: 4px; }
        .gp-tog { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: var(--color-10); cursor: pointer; margin-top: 4px; }
        .gp-tog .gp-box { width: 22px; height: 22px; min-width: 22px; border: var(--border-width) solid var(--border-color); border-radius: 6px; background: var(--color-10); display: flex; align-items: center; justify-content: center; }
        .gp-tog.on .gp-box { background: var(--accent); }
        .gp-btns { display: flex; gap: 4px; margin-top: 8px; }
        .gp-btn { height: 32px; border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); background: var(--bg-4); color: var(--color-10); font-weight: 800; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0 10px; }
        .gp-btn.green { background: var(--color-4); flex: 1; } .gp-btn.red { background: var(--color-1); } .gp-btn.wide { flex: 1; }
        .gp-cardwrap { margin-top: 2px; }
        .gp-cardwrap div:has(> [data-action="move-up-card"]), .gp-cardwrap [data-action$="-card"] { display: none !important; }
        .gp-map { height: 34vh; min-height: 200px; border-top: var(--border-width) solid var(--border-color); background: var(--bg-2); position: relative; flex: none; }
        .gp-build.grid .gp-list { display: none; }
        .gp-build.grid .gp-map { flex: 1; height: auto; margin-top: 6px; }
        .gp-mapin { position: absolute; inset: 0; overflow: auto; display: flex; padding-bottom: 30px; }
        .gp-mapin svg { display: block; margin: auto; flex: none; }
        .gp-build.grid .gp-mapin { touch-action: none; padding-bottom: 0; }
        .gp-build.grid .gp-mapin svg { margin: 0; }
        .gp-zoom { position: absolute; bottom: 8px; left: 6px; z-index: 3; height: 28px; display: flex; align-items: center; gap: 6px; padding: 0 8px 0 6px; background: var(--bg-4); border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); cursor: pointer; color: var(--color-10); font-size: 10px; font-weight: 800; letter-spacing: .05em; }
        .gp-zoom .gp-dots { display: flex; gap: 3px; } .gp-zoom .gp-dots i { width: 7px; height: 7px; border-radius: 50%; border: 2px solid #000; background: #fff; } .gp-zoom .gp-dots i.on { background: var(--gold); }
        .gp-key { position: absolute; right: 6px; bottom: 12px; display: flex; gap: 7px; font-size: 9px; font-weight: 700; color: #c9bfae; z-index: 3; background: rgba(43,38,32,.85); padding: 3px 6px; border-radius: 6px; }
        .gp-key span::before { content: ''; display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 3px; vertical-align: -1px; background: var(--c); }
        .gp-tools { display: none; flex: none; background: var(--bg-3); border-top: var(--border-width) solid var(--border-color); padding: var(--margin); }
        .gp-build.grid .gp-tools { display: block; }
        .gp-tools .gp-seg { height: 34px; } .gp-tools .gp-seg > div { font-size: 9.5px; } .gp-tools .gp-seg > div.act { background: var(--bg-4); color: var(--color-10); }
        .gp-tsub { display: flex; align-items: center; gap: 4px; min-height: 26px; margin-top: 4px; font-size: 10px; font-weight: 700; color: var(--color-10); flex-wrap: wrap; }
        .gp-chip { font-size: 10px; font-weight: 700; color: var(--color-10); background: var(--bg-5); border: 2px solid #000; border-radius: 12px; padding: 4px 7px; cursor: pointer; }
        .gp-chip.on { background: var(--color-5); }
        .gp-tsub .gp-hx { flex: 1; text-align: center; color: var(--bg-1); }
        .gp-sheet { display: none; position: absolute; left: 0; right: 0; bottom: 0; max-height: 62%; overflow-y: auto; z-index: 10; background: var(--bg-1); border-top: var(--border-width) solid var(--border-color); padding: var(--margin); box-shadow: 0 -6px 14px rgba(0,0,0,.35); }
        .gp-sheet.on { display: block; }
        .gp-sheet .gp-node { margin-bottom: 0; }
        .gp-toast { display: none; position: absolute; left: 50%; top: 52px; transform: translateX(-50%); z-index: 12; background: var(--color-1); color: var(--color-10); border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); padding: 6px 10px; font-size: 11px; font-weight: 800; white-space: nowrap; }
        .gp-toast.on { display: block; }
        `;
        document.head.appendChild(css);
    }

    // ===== THE FULL-SCREEN WINDOW =====
    // One window at a time. It holds a reference to the path's state, so the app's own render()
    // can run underneath (that's how changes get saved) without closing it.
    let W = null;   // { P, mode: 'view'|'build', tabColor, el, ...builder ui state }
    const save = () => { if (typeof window.render === 'function') { const y = W && W.el ? W.el.querySelector('.gp-play, .gp-list') : null; const top = y ? y.scrollTop : 0; window.render(true); if (y) y.scrollTop = top; } };

    function open(P, mode, tabColor) {
        injectStyles();
        close(false);
        W = { P, mode, tabColor, buildMode: (P.ui && P.ui.buildMode) || 'list', tool: 'select', addType: 'list', linkFrom: null, linkOpt: null,
              selected: null, afterOpen: false, zoom: 0, gridView: null, optOpen: true, missOpen: false, sheetGuard: 0 };
        const el = document.createElement('div');
        el.className = 'gp-ov';
        el.innerHTML = `<div class="gp-band"></div>
            <div class="gp-main" style="flex:1; display:flex; flex-direction:column; min-height:0"></div>`;
        document.body.appendChild(el);
        document.body.style.overflow = 'hidden';
        W.el = el;
        drawHeader();
        draw();
    }
    function close(doSave) {
        if (!W) return;
        if (W.P) { W.P.ui = W.P.ui || {}; W.P.ui.buildMode = W.buildMode; }
        if (W.el) W.el.remove();
        document.body.style.overflow = '';
        W = null;
        if (doSave) save();
    }
    // the same bar nests use: back on the left, the name in the middle, home (view) or save-and-exit (edit) on the right
    function drawHeader() {
        const band = W.el.querySelector('.gp-band');
        const home = () => {
            close(true);
            const h = document.querySelector('#frozenHeader [data-action="home"]');
            if (h) h.click();
        };
        if (GT50Lib.Header && GT50Lib.Header.renderNestBar) {
            GT50Lib.Header.renderNestBar(band, W.P.name || 'Path', W.mode === 'build' ? 'build' : 'view', () => close(true), home);
        } else {
            band.innerHTML = `<div style="display:flex;height:45px;background:#fff;align-items:center;justify-content:center;font-weight:700">${esc(W.P.name || 'Path')}</div>`;
            band.onclick = () => close(true);
        }
    }
    function draw() {
        if (!W) return;
        if (W.mode === 'view') drawPlay(); else drawBuild();
    }

    // ===== PLAY (VIEW MODE) =====
    function mountCard(host, n, mini) {
        const d = typeDef(n.card.type);
        const wrap = document.createElement('div');
        if (mini) wrap.className = 'gp-mini';
        host.appendChild(wrap);
        if (!d || typeof d.lib.renderView !== 'function') {
            wrap.innerHTML = `<div class="gp-note">${esc(n.card.type.toUpperCase())} — NOT INSTALLED</div>`;
            return;
        }
        d.lib.renderView(wrap, n.card.state, () => { stamp(W.P); save(); drawPlay(); }, W.tabColor);
        // same dropdown padding the app gives cards in a tab
        wrap.querySelectorAll('div[style*="border-radius: 0 0 8px 8px"]').forEach(sec => {
            sec.style.padding = 'var(--margin) var(--margin) 0 var(--margin)';
            const last = sec.lastElementChild;
            if (last && !last.style.marginBottom) last.style.marginBottom = 'var(--margin)';
        });
    }
    function drawPlay() {
        const P = W.P, main = W.el.querySelector('.gp-main');
        const keep = main.querySelector('.gp-play'); const top = keep ? keep.scrollTop : 0;
        stamp(P);
        const st = new Map(P.nodes.map(n => [n.id, status(P, n)]));
        const availAll = P.nodes.filter(n => st.get(n.id) === 'available');
        const avail = availAll.filter(n => !n.optional), extra = availAll.filter(n => n.optional);
        const done = P.nodes.filter(n => st.get(n.id) === 'done').sort((a, b) => a.doneAt - b.doneAt);
        const missed = P.nodes.filter(n => st.get(n.id) === 'missed');
        const p = progress(P), pct = p.total ? Math.round(p.done / p.total * 100) : 0;
        main.innerHTML = `<div class="gp-play">
            <div class="gp-bar ${p.total && p.done === p.total ? 'full' : ''}"><i style="width:${pct}%"></i><b>${p.done} / ${p.total} · ${pct}%</b></div>
            <div data-slot="avail"></div>
            ${extra.length ? `<div class="gp-sec gp-opt toggle ${W.optOpen ? 'open' : ''}"><div class="gp-sh" data-gp="opt">OPTIONAL · ${extra.length}<div class="gp-arr">${ICON.down}</div></div><div class="gp-sb" data-slot="extra"></div></div>` : ''}
            ${done.length ? `<div class="gp-sec gp-done open"><div class="gp-sh">DONE · ${done.length}</div><div class="gp-sb" data-slot="done"></div></div>` : ''}
            ${missed.length ? `<div class="gp-sec gp-miss toggle ${W.missOpen ? 'open' : ''}"><div class="gp-sh" data-gp="miss">MISSED · ${missed.length}<div class="gp-arr">${ICON.down}</div></div><div class="gp-sb" data-slot="missed"></div></div>` : ''}
        </div>`;
        const slot = k => main.querySelector(`[data-slot="${k}"]`);
        if (!P.nodes.length) slot('avail').innerHTML = `<div class="gp-empty">EMPTY PATH — SWITCH TO EDIT TO BUILD IT</div>`;
        else if (!avail.length) slot('avail').innerHTML = `<div class="gp-empty">${p.total && p.done === p.total ? 'PATH COMPLETE' : 'NOTHING AVAILABLE'}</div>`;
        // a choice we held open while it was undecided closes once it's picked
        W.forced = W.forced || new Set();
        P.nodes.forEach(n => { if (W.forced.has(n.id) && st.get(n.id) !== 'available') { n.card.state.open = false; W.forced.delete(n.id); } });
        avail.forEach(n => {
            // an undecided choice: always open, with a note
            if (n.card.type === 'radio') {
                n.card.state.open = true; W.forced.add(n.id);
                const branches = P.nodes.some(c => c.after.some(l => l.id === n.id && l.opt !== undefined));
                const note = document.createElement('div');
                note.className = 'gp-note';
                note.textContent = branches ? 'Picking one closes the other paths' : 'Records your choice. The story continues either way';
                slot('avail').appendChild(note);
            }
            mountCard(slot('avail'), n, false);
        });
        if (slot('extra')) extra.forEach(n => mountCard(slot('extra'), n, true));
        if (slot('done')) done.forEach(n => mountCard(slot('done'), n, false));
        if (slot('missed')) missed.forEach(n => mountCard(slot('missed'), n, true));
        const t = main.querySelector('[data-gp="opt"]'); if (t) t.onclick = () => { W.optOpen = !W.optOpen; drawPlay(); };
        const m = main.querySelector('[data-gp="miss"]'); if (m) m.onclick = () => { W.missOpen = !W.missOpen; drawPlay(); };
        main.querySelector('.gp-play').scrollTop = top;
    }

    // ===== BUILDER (EDIT MODE) =====
    function afterLabel(P, n) {
        if (!n.after.length) return 'START';
        return n.after.map(l => { const p = byId(P, l.id); return p ? (l.opt !== undefined ? (options(p)[l.opt] || '?') : title(p)) : '?'; }).join(' + ');
    }
    function drawBuild() {
        const main = W.el.querySelector('.gp-main');
        if (!main.querySelector('.gp-build')) {
            main.innerHTML = `<div class="gp-build">
                <div class="gp-seg gp-bmode"><div data-b="list">LIST</div><div data-b="grid">GRID</div></div>
                <div class="gp-list"></div>
                <div class="gp-map"><div class="gp-mapin"></div><div class="gp-zoom"></div>
                    <div class="gp-key"><span style="--c:#c9a227">done</span><span style="--c:#8f7658">available</span><span style="--c:#4a3f35">later</span><span style="--c:#7a2f2b">locked / missed</span></div></div>
                <div class="gp-tools"></div><div class="gp-sheet"></div><div class="gp-toast"></div></div>`;
            wireBuild(main.querySelector('.gp-build'));
        }
        const b = main.querySelector('.gp-build');
        b.classList.toggle('grid', W.buildMode === 'grid');
        b.querySelectorAll('.gp-bmode > div').forEach(d => d.classList.toggle('on', d.dataset.b === W.buildMode));
        if (W.buildMode === 'grid') return drawGridUI();
        b.querySelector('.gp-sheet').classList.remove('on');
        const list = b.querySelector('.gp-list'), keep = list.scrollTop, P = W.P;
        list.innerHTML = '';
        ordered(P).forEach(n => list.appendChild(nodeBlock(n, false)));
        const add = document.createElement('div');
        add.className = 'gp-btns';
        add.innerHTML = `<div class="gp-btn green" data-gp="addstart">+ NEW STARTING CARD</div>`;
        list.appendChild(add);
        list.scrollTop = keep;
        drawMap();
    }
    // a node row; selected = row + editor (the real card's own edit card inside)
    function nodeBlock(n, inSheet) {
        const P = W.P, sel = n.id === W.selected;
        const el = document.createElement('div');
        el.className = `gp-node ${sel ? 'sel' : ''} ${n.optional ? 'optional' : ''}`;
        el.dataset.id = n.id;
        el.innerHTML = `<div class="gp-bn" data-gp="select"><div class="gp-ico">${ICON.type[n.card.type] || ''}</div>
            <div class="gp-nm"><span>${esc(title(n))}</span></div>
            ${inSheet ? `<div class="gp-x">×</div>` : `<div class="gp-af">after: ${esc(afterLabel(P, n))}</div>`}</div>`;
        if (sel) el.appendChild(editor(n));
        return el;
    }
    function editor(n) {
        const P = W.P, ed = document.createElement('div');
        ed.className = 'gp-ed';
        const banned = descendants(P, n.id); banned.add(n.id);
        const rows = [];
        P.nodes.filter(p => !banned.has(p.id)).forEach(p => {
            if (p.card.type === 'radio') {
                rows.push(`<div class="gp-subhead">${ICON.type.radio}<span>${esc(title(p))}</span></div>`);
                const on0 = n.after.some(l => l.id === p.id && l.opt === undefined);
                rows.push(`<div class="gp-row sub ${on0 ? 'on' : ''}" data-gp="link" data-p="${p.id}"><div class="gp-sq">${on0 ? ICON.check() : ''}</div><div class="gp-rn"><span>Any option (once it's picked)</span></div></div>`);
                options(p).forEach((o, i) => {
                    const on = n.after.some(l => l.id === p.id && l.opt === i);
                    rows.push(`<div class="gp-row sub ${on ? 'on' : ''}" data-gp="link" data-p="${p.id}" data-o="${i}"><div class="gp-sq">${on ? ICON.check() : ''}</div><div class="gp-rn"><span>${esc(o || 'Option ' + (i + 1))}</span></div></div>`);
                });
            } else {
                const on = n.after.some(l => l.id === p.id);
                rows.push(`<div class="gp-row ${on ? 'on' : ''}" data-gp="link" data-p="${p.id}"><div class="gp-sq">${on ? ICON.check() : ''}</div><div class="gp-rn"><span>${esc(title(p))}</span></div></div>`);
            }
        });
        ed.innerHTML = `
            <div class="gp-lbl">CARD TYPE</div>
            <div class="gp-types">${NODE_TYPES.filter(t => typeDef(t)).map(t => `<div class="${t === n.card.type ? 'on' : ''}" data-gp="type" data-t="${t}">${TYPE_NAME[t]}</div>`).join('')}</div>
            <div class="gp-lbl">CARD</div><div class="gp-cardwrap"></div>
            <div class="gp-lbl">PATH</div>
            <div class="gp-after ${W.afterOpen ? 'open' : ''}"><div class="gp-ah" data-gp="afteropen">
                <div class="gp-ak"><small>COMES AFTER</small><span>${n.after.length ? esc(afterLabel(P, n)) : 'Start of the path'}</span></div>
                <div class="gp-ac">${n.after.length || ''}</div><div class="gp-aa">${ICON.down}</div></div>
                <div class="gp-ad">${rows.join('') || '<div class="gp-hint">No other cards yet</div>'}
                <div class="gp-hint">Needs every card ticked here. A choice's option means "only if this was picked".</div></div></div>
            <div class="gp-lbl">EXTRA</div>
            <div class="gp-tog ${n.optional ? 'on' : ''}" data-gp="optional"><div class="gp-box">${n.optional ? ICON.check() : ''}</div>Optional: shown on the path, doesn't count toward progress</div>
            ${n.optional ? `<div class="gp-tog ${n.missable ? 'on' : ''}" data-gp="missable"><div class="gp-box">${n.missable ? ICON.check() : ''}</div>Missable: drops off once you move past this point</div>` : ''}
            <div class="gp-btns"><div class="gp-btn green" data-gp="addafter">+ ADD CARD AFTER THIS</div><div class="gp-btn red" data-gp="delete">DELETE</div></div>`;
        // the real card's own edit card
        const d = typeDef(n.card.type), host = ed.querySelector('.gp-cardwrap');
        if (d) {
            let before = (n.card.state.items || []).slice();
            d.lib.renderBuild(host, n.card.state, () => {
                // a RADIO's options were moved or deleted: keep branch links on the same options
                if (n.card.type === 'radio') {
                    const now = n.card.state.items || [];
                    P.nodes.forEach(c => c.after = c.after.map(l => {
                        if (l.id !== n.id || l.opt === undefined) return l;
                        const i = now.indexOf(before[l.opt]);
                        return i < 0 ? null : { id: l.id, opt: i };
                    }).filter(Boolean));
                    before = now.slice();
                }
                save(); drawBuild();
            }, null, null, false);
            // typing a title doesn't call onChange: keep the row label in step
            host.addEventListener('input', () => {
                const nm = ed.parentElement && ed.parentElement.querySelector('.gp-bn .gp-nm span');
                if (nm) nm.textContent = title(n);
                drawMap({ noScroll: true });
            });
            host.addEventListener('change', () => save());
        }
        return ed;
    }
    function convertCard(n, to) {
        const P = W.P, from = n.card, old = from.state || {};
        const texts = (old.items || []).map(i => i.text || '');
        const card = newCard(to), s = card.state;
        s.title = old.title || '';
        if (old.dropdownText) s.dropdownText = old.dropdownText;
        if (to === 'radio') s.items = texts.length ? texts.map(text => ({ text })) : [{ text: '' }, { text: '' }];
        else if (to !== 'list' || texts.length) s.items = texts.map(text => ({ text, completed: false }));
        if (to === 'threshold') { const need = Math.max(1, Math.min(texts.length || 1, Math.ceil(texts.length / 2))); s.number1 = need; s.threshold = need; }
        if (from.type === 'radio') P.nodes.forEach(c => c.after.forEach(l => { if (l.id === n.id) delete l.opt; }));
        n.card = card;
    }
    function editAction(t, n) {
        const P = W.P, act = t.dataset.gp;
        switch (act) {
            case 'select': W.selected = W.selected === n.id ? null : n.id; W.afterOpen = false; break;
            case 'afteropen': W.afterOpen = !W.afterOpen; break;
            case 'type': if (t.dataset.t !== n.card.type) convertCard(n, t.dataset.t); break;
            case 'link': {
                const pid = t.dataset.p, opt = t.dataset.o === undefined ? undefined : +t.dataset.o;
                const i = n.after.findIndex(l => l.id === pid && l.opt === opt);
                if (i >= 0) n.after.splice(i, 1);
                else { n.after = n.after.filter(l => l.id !== pid); n.after.push(opt === undefined ? { id: pid } : { id: pid, opt }); }
                break;
            }
            case 'optional': n.optional = !n.optional; break;
            case 'missable': n.missable = !n.missable; break;
            case 'addafter': { const c = addNode(P, 'list', { after: [n.card.type === 'radio' ? { id: n.id, opt: 0 } : { id: n.id }] }); W.selected = c.id; W.afterOpen = false; break; }
            case 'delete': removeNode(P, n.id); W.selected = null; break;
            default: return false;
        }
        save(); drawBuild(); return true;
    }
    function wireBuild(b) {
        b.querySelector('.gp-bmode').onclick = e => {
            const d = e.target.closest('[data-b]'); if (!d || d.dataset.b === W.buildMode) return;
            W.buildMode = d.dataset.b; W.selected = null; W.linkFrom = null; W.linkOpt = null; W.afterOpen = false;
            if (W.buildMode === 'grid') { W.zoom = 0; W.gridView = null; }
            b.querySelector('.gp-toast').classList.remove('on');
            drawBuild();
        };
        const onEdit = e => {
            const t = e.target.closest('[data-gp]'); if (!t) return;
            if (t.dataset.gp === 'addstart') { const n = addNode(W.P, 'list'); W.selected = n.id; save(); return drawBuild(); }
            const host = t.closest('.gp-node'); if (!host) return;
            const n = byId(W.P, host.dataset.id); if (!n) return;
            editAction(t, n);
        };
        b.querySelector('.gp-list').addEventListener('click', onEdit);
        // the grid's bottom sheet: ignore the tail of the tap that opened it (it would land on a text field)
        const sheet = b.querySelector('.gp-sheet');
        const guarded = () => Date.now() - W.sheetGuard < 500;
        ['mousedown', 'mouseup', 'click', 'touchend'].forEach(ev => sheet.addEventListener(ev, e => { if (guarded()) { e.preventDefault(); e.stopPropagation(); } }, true));
        sheet.addEventListener('focusin', e => { if (guarded()) e.target.blur(); });
        sheet.addEventListener('click', onEdit);
        b.querySelector('.gp-zoom').onclick = () => { W.zoom = (W.zoom + 1) % ZOOMS.length; drawMap({ noScroll: true, center: ZOOMS[W.zoom] === 'fit' }); };
        b.querySelector('.gp-tools').addEventListener('click', e => {
            const at = e.target.closest('[data-addtype]'); if (at) { W.addType = at.dataset.addtype; return drawGridUI(); }
            const d = e.target.closest('[data-tool]'); if (!d) return;
            if (d.dataset.tool === 'tidy') { W.P.gridLayout = null; toast('Back to the automatic layout'); save(); drawGridUI(); return drawMap({ center: true }); }
            W.tool = d.dataset.tool; W.linkFrom = null; W.linkOpt = null;
            if (W.tool !== 'select' && W.tool !== 'add') W.selected = null;
            drawGridUI();
        });
        wireMapPointer(b.querySelector('.gp-mapin'));
    }
    function toast(msg) {
        const t = W.el.querySelector('.gp-toast'); if (!t) return;
        t.textContent = msg; t.classList.add('on');
        clearTimeout(W.toastT); W.toastT = setTimeout(() => t.classList.remove('on'), 1800);
    }

    // ===== MAPS =====
    const NW = 132, NH = 34, GX = 40, GY = 24, PAD = 20, SNAP = 20, R = 20, COLW = 100, ROWH = 60;
    const ZOOMS = [1, 0.7, 'fit'];
    const CTRL_H = 40;
    const OPT_COLORS = ['#6d8fe0', '#7fae55', '#c08ae0', '#e09a4a', '#4fb8b2'];
    const OPT_TAG = ['#304a8a', '#46632c', '#6a3f86', '#87531f', '#22625e'];
    const FILL = { done: '#9a6b09', available: '#8f7658', later: '#4a3f35', locked: '#7a2f2b', missed: '#7a2f2b' };
    const snapG = v => Math.round(v / SNAP) * SNAP;

    // A line that skips past other cards must not run through them: use the plain S-curve when it's clear,
    // otherwise run along a free lane, changing height only in the open gaps at either end.
    function routeLine(x1, y1, x2, y2, obs) {
        const bend = Math.max(30, Math.abs(x2 - x1) / 2);
        const plain = `M${x1} ${y1} C${x1 + bend} ${y1} ${x2 - bend} ${y2} ${x2} ${y2}`;
        const M = 7;
        const hits = (x, y) => obs.some(o => x > o.x0 - M && x < o.x1 + M && y > o.y0 - M && y < o.y1 + M);
        const bez = (t, a, b, c, d) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
        let clear = true;
        for (let i = 1; i < 40 && clear; i++) { const t = i / 40; if (hits(bez(t, x1, x1 + bend, x2 - bend, x2), bez(t, y1, y1, y2, y2))) clear = false; }
        if (clear || x2 <= x1 + 40) return plain;
        const inWay = obs.filter(o => o.x1 > x1 && o.x0 < x2);
        if (!inWay.length) return plain;
        const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
        const tw1 = clamp(Math.min(...inWay.map(o => o.x0)) - x1 - 4, 16, 60);
        const tw2 = clamp(x2 - Math.max(...inWay.map(o => o.x1)) - 4, 16, 60);
        const laneClear = y => { for (let x = x1 + tw1; x <= x2 - tw2; x += 6) if (hits(x, y)) return false; return true; };
        const top = Math.min(...inWay.map(o => o.y0)), bottom = Math.max(...inWay.map(o => o.y1));
        const lanes = [y1, y2, ...inWay.flatMap(o => [o.y0 - GY / 2, o.y1 + GY / 2]), top - 22, bottom + 22];
        let lane = lanes.filter(laneClear).sort((a, c) => Math.abs(a - y1) + Math.abs(a - y2) - Math.abs(c - y1) - Math.abs(c - y2))[0];
        if (lane === undefined) return plain;
        if (lane > bottom) lane = bottom + 22;
        if (lane < top) lane = top - 22;
        const h1 = x1 + tw1 / 2, h2 = x2 - tw2 / 2;
        return `M${x1} ${y1} C${h1} ${y1} ${h1} ${lane} ${x1 + tw1} ${lane} L${x2 - tw2} ${lane} C${h2} ${lane} ${h2} ${y2} ${x2} ${y2}`;
    }
    // LIST mode map: automatic columns by depth, each column ordered by where its parents sit
    function autoPositions(P) {
        const cols = [];
        ordered(P).forEach(n => { const d = depthOf(P, n); (cols[d] = cols[d] || []).push(n); });
        const rank = {};
        cols.forEach((col, d) => {
            if (d > 0) {
                const key = n => {
                    const gate = n.after.filter(l => l.opt !== undefined && rank[l.id] !== undefined);
                    const ks = (gate.length ? gate : n.after.filter(l => rank[l.id] !== undefined)).map(l => rank[l.id] + (l.opt || 0) * 0.01);
                    return ks.length ? ks.reduce((x, y) => x + y, 0) / ks.length : 0.5;
                };
                const k = new Map(col.map(n => [n, key(n)]));
                col.sort((x, y) => k.get(x) - k.get(y) || P.nodes.indexOf(x) - P.nodes.indexOf(y));
            }
            col.forEach((n, i) => rank[n.id] = (i + 0.5) / col.length);
        });
        const pos = {}, tallest = Math.max(1, ...cols.map(c => c.length));
        const H = PAD * 2 + tallest * NH + (tallest - 1) * GY;
        cols.forEach((col, d) => {
            const colH = col.length * NH + (col.length - 1) * GY, top = (H - colH) / 2;
            col.forEach((n, i) => pos[n.id] = { x: PAD + d * (NW + GX), y: top + i * (NH + GY) });
        });
        return pos;
    }
    function drawMap(opts = {}) {
        if (!W || W.mode !== 'build') return;
        if (W.buildMode === 'grid') return drawGridMap(opts);
        const P = W.P, pos = autoPositions(P), ps = Object.values(pos);
        const Wd = ps.length ? Math.max(...ps.map(p => p.x)) + NW + PAD : 300;
        const H = ps.length ? Math.max(...ps.map(p => p.y)) + NH + PAD : 200;
        const obstacles = P.nodes.filter(n => pos[n.id]).map(n => { const q = pos[n.id]; return { id: n.id, x0: q.x, y0: q.y, x1: q.x + NW, y1: q.y + NH }; });
        let lines = '', boxes = '', labels = '';
        P.nodes.forEach(n => n.after.forEach(l => {
            const p = byId(P, l.id); if (!p || !pos[p.id]) return;
            const a = pos[p.id], b = pos[n.id];
            const d = routeLine(a.x + NW, a.y + NH / 2, b.x, b.y + NH / 2, obstacles.filter(o => o.id !== n.id && o.id !== p.id));
            const cut = linkCut(P, l, new Map()), isSel = W.selected && (W.selected === n.id || W.selected === p.id);
            const optCol = l.opt !== undefined ? OPT_COLORS[l.opt % OPT_COLORS.length] : null;
            lines += `<path d="${d}" fill="none" stroke="${isSel ? '#c9a227' : cut ? '#a8443d' : optCol || '#c9bfae'}" stroke-width="3" ${n.optional ? 'stroke-dasharray="5 4"' : ''} stroke-linecap="round"/>`;
            if (l.opt !== undefined) {
                const full = options(p)[l.opt] || '', txt = full.length > 20 ? full.slice(0, 19) + '…' : full, w = txt.length * 4.9 + 12;
                labels += `<g transform="translate(${b.x + 8},${b.y - 9})" pointer-events="none"><rect width="${w}" height="15" rx="7.5" fill="${cut ? '#7a2f2b' : OPT_TAG[l.opt % OPT_TAG.length]}" stroke="#000" stroke-width="2"/><text x="6" y="10.5" font-size="8.5" font-weight="800" fill="#fff">${esc(txt)}</text></g>`;
            }
        }));
        P.nodes.forEach(n => {
            const p = pos[n.id], st = status(P, n), t = title(n), short = t.length > 17 ? t.slice(0, 16) + '…' : t;
            boxes += `<g data-id="${n.id}" style="cursor:pointer" transform="translate(${p.x},${p.y})">
                ${n.id === W.selected ? `<rect x="-4" y="-4" width="${NW + 8}" height="${NH + 8}" rx="11" fill="none" stroke="#c9a227" stroke-width="3"/>` : ''}
                <rect width="${NW}" height="${NH}" rx="8" fill="${FILL[st]}" stroke="#000" stroke-width="3" ${n.optional ? 'stroke-dasharray="6 4"' : ''}/>
                <rect x="1.5" y="1.5" width="24" height="${NH - 3}" rx="6" fill="rgba(255,255,255,.12)"/>
                <line x1="26" y1="1.5" x2="26" y2="${NH - 1.5}" stroke="#000" stroke-width="3"/>
                <g transform="translate(6,${NH / 2 - 7})">${ICON.type[n.card.type] || ''}</g>
                <text x="32" y="${NH / 2 + 4}" font-size="11" font-weight="700" fill="#fff" ${st === 'locked' || st === 'missed' ? 'text-decoration="line-through"' : ''}>${esc(short)}</text></g>`;
        });
        const mapEl = W.el.querySelector('.gp-mapin'), VH = Math.max(H, 200);
        const z = W.curZ = ZOOMS[W.zoom] === 'fit' ? Math.min(1, (mapEl.clientWidth - 12) / Wd, (mapEl.clientHeight - 36) / VH) : ZOOMS[W.zoom];
        mapEl.innerHTML = P.nodes.length ? `<svg width="${Wd * z}" height="${VH * z}" viewBox="0 0 ${Wd} ${VH}">${lines}${boxes}${labels}</svg>` : '';
        zoomBtn();
        if (!opts.noScroll && W.selected && pos[W.selected]) {
            const p = pos[W.selected];
            mapEl.scrollTo({ left: Math.max(0, (p.x + NW / 2) * z - mapEl.clientWidth / 2), top: Math.max(0, (p.y + NH / 2) * z - mapEl.clientHeight / 2) });
        }
    }
    function zoomBtn() {
        const names = ['CLOSE', 'MEDIUM', 'WHOLE PATH'];
        W.el.querySelector('.gp-zoom').innerHTML = `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M10 10l4 4"/></svg>${names[W.zoom]}
            <span class="gp-dots">${ZOOMS.map((_, i) => `<i class="${i === W.zoom ? 'on' : ''}"></i>`).join('')}</span>`;
    }

    // ===== GRID: the map is the builder. Every choice option is a node of its own. =====
    // Keys: a card's id, or "<choiceId>#<option>". Grid keeps its own layout (P.gridLayout, node centres).
    function gridGraph(P) {
        const nodes = [], links = [];
        P.nodes.forEach(n => {
            nodes.push({ key: n.id, n });
            options(n).forEach((o, i) => {
                nodes.push({ key: n.id + '#' + i, choice: n, opt: i });
                links.push({ from: n.id, to: n.id + '#' + i, stem: true, choice: n, opt: i });
            });
        });
        P.nodes.forEach(n => n.after.forEach(l => {
            const p = byId(P, l.id); if (!p) return;
            links.push({ from: l.opt !== undefined && p.card.type === 'radio' ? l.id + '#' + l.opt : l.id, to: n.id, l, child: n, parent: p });
        }));
        return { nodes, links };
    }
    function gridAuto(G) {
        const parents = {}; G.links.forEach(k => (parents[k.to] = parents[k.to] || []).push(k.from));
        const depth = {}, dep = (key, seen = new Set()) => {
            if (depth[key] !== undefined) return depth[key];
            if (seen.has(key)) return 0; seen.add(key);
            const ps = parents[key] || [];
            return depth[key] = ps.length ? Math.max(...ps.map(p => dep(p, seen) + 1)) : 0;
        };
        const cols = [];
        G.nodes.forEach(nd => (cols[dep(nd.key)] = cols[dep(nd.key)] || []).push(nd.key));
        const rank = {};
        cols.forEach((col, d) => {
            if (d > 0) {
                const key = k => { const ps = (parents[k] || []).filter(p => rank[p] !== undefined); return ps.length ? ps.reduce((a, p) => a + rank[p], 0) / ps.length : 0.5; };
                const kk = new Map(col.map(k => [k, key(k)]));
                col.sort((a, b) => kk.get(a) - kk.get(b) || (a.includes('#') && b.includes('#') ? +a.split('#')[1] - +b.split('#')[1] : 0));
            }
            col.forEach((k, i) => rank[k] = (i + 0.5) / col.length);
        });
        const pos = {};
        cols.forEach((col, d) => col.forEach((k, i) => pos[k] = { x: d * COLW, y: snapG((i - (col.length - 1) / 2) * ROWH) }));
        return pos;
    }
    const tooClose = (p, pos, skip) => Object.entries(pos).some(([k, q]) => k !== skip && Math.abs(q.x - p.x) < 2 * R + 12 && Math.abs(q.y - p.y) < 2 * R + 12);
    function gridPositions(P, G = gridGraph(P)) {
        if (!P.gridLayout) return gridAuto(G);
        const pos = {};
        G.nodes.forEach(nd => { if (P.gridLayout[nd.key]) pos[nd.key] = P.gridLayout[nd.key]; });
        G.nodes.forEach(nd => {    // new nodes: right of their parent, first free row
            if (pos[nd.key]) return;
            const par = G.links.filter(k => k.to === nd.key).map(k => pos[k.from]).filter(Boolean);
            const all = Object.values(pos);
            const base = par.length ? { x: Math.max(...par.map(q => q.x)) + COLW, y: par[0].y } : { x: 0, y: all.length ? Math.max(...all.map(q => q.y)) + ROWH : 0 };
            let spot = base;
            for (let k = 0; k < 60; k++) { const t = { x: base.x, y: base.y + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * ROWH }; if (!tooClose(t, pos)) { spot = t; break; } }
            pos[nd.key] = P.gridLayout[nd.key] = spot;
        });
        return pos;
    }
    function snapshotGrid(P) { if (!P.gridLayout) P.gridLayout = { ...gridAuto(gridGraph(P)) }; }
    function drawGridMap(opts = {}) {
        const P = W.P, G = gridGraph(P), pos = gridPositions(P, G);
        const obstacles = G.nodes.filter(nd => pos[nd.key]).map(nd => { const q = pos[nd.key]; return { id: nd.key, x0: q.x - R, y0: q.y - R, x1: q.x + R, y1: q.y + R }; });
        const optState = (c, i) => { const pk = picked(c) === i, dead = lockedOut(P, c) || (picked(c) !== null && !pk); return { pk, dead }; };
        let lines = '', hits = '', boxes = '';
        G.links.forEach(k => {
            const a = pos[k.from], b = pos[k.to]; if (!a || !b) return;
            const d = routeLine(a.x + R, a.y, b.x - R, b.y, obstacles.filter(o => o.id !== k.from && o.id !== k.to));
            let col = '#c9bfae', dash = false;
            if (k.stem) {
                const s = optState(k.choice, k.opt);
                col = W.selected === k.choice.id ? '#c9a227' : s.dead ? '#a8443d' : OPT_COLORS[k.opt % OPT_COLORS.length];
            } else {
                const cut = linkCut(P, k.l, new Map()), isSel = W.selected && (W.selected === k.child.id || W.selected === k.parent.id);
                col = isSel ? '#c9a227' : cut ? '#a8443d' : k.l.opt !== undefined ? OPT_COLORS[k.l.opt % OPT_COLORS.length] : '#c9bfae';
                dash = k.child.optional;
                if (W.tool === 'cut') hits += `<path d="${d}" fill="none" stroke="rgba(122,47,43,.35)" stroke-width="18" stroke-linecap="round" data-cut="${k.child.id}|${k.l.id}|${k.l.opt === undefined ? '' : k.l.opt}" style="cursor:pointer"/>`;
            }
            lines += `<path d="${d}" fill="none" stroke="${col}" stroke-width="3" ${dash ? 'stroke-dasharray="5 4"' : ''} stroke-linecap="round"/>`;
        });
        G.nodes.forEach(nd => {
            const q = pos[nd.key]; if (!q) return;
            let ring = '', body;
            if (nd.n) {
                const n = nd.n, st = status(P, n);
                if (n.id === W.selected) ring += `<circle r="${R + 5}" fill="none" stroke="#c9a227" stroke-width="3"/>`;
                if (n.id === W.linkFrom && W.linkOpt === null) ring += `<circle r="${R + 6}" fill="none" stroke="#7d93d9" stroke-width="3" stroke-dasharray="6 4"/>`;
                body = `<circle r="${R}" fill="${FILL[st]}" stroke="#000" stroke-width="3" ${n.optional ? 'stroke-dasharray="6 4"' : ''}/><g transform="translate(-9.1,-9.1) scale(1.3)">${ICON.type[n.card.type] || ''}</g>`;
            } else {
                const s = optState(nd.choice, nd.opt);
                if (W.linkFrom === nd.choice.id && W.linkOpt === nd.opt) ring += `<circle r="${R + 6}" fill="none" stroke="#7d93d9" stroke-width="3" stroke-dasharray="6 4"/>`;
                body = `<circle r="${R}" fill="${s.pk ? '#9a6b09' : s.dead ? '#7a2f2b' : OPT_TAG[nd.opt % OPT_TAG.length]}" stroke="#000" stroke-width="3"/>
                    <circle r="${R - 6}" fill="none" stroke="${s.pk ? '#fff' : s.dead ? '#a8443d' : OPT_COLORS[nd.opt % OPT_COLORS.length]}" stroke-width="2"/>
                    <text y="5" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">${nd.opt + 1}</text>`;
            }
            boxes += `<g data-id="${nd.key}" style="cursor:pointer" transform="translate(${q.x},${q.y})">${ring}${body}</g>`;
        });
        // the dots run on forever, but you can only pan a bit past your nodes; re-renders keep the view still
        const mapEl = W.el.querySelector('.gp-mapin');
        const vw = mapEl.clientWidth, vh = mapEl.clientHeight - CTRL_H;
        let anchor = null;
        if (W.gridView && !opts.center && mapEl.querySelector('svg'))
            anchor = { x: (mapEl.scrollLeft + vw / 2) / W.gridView.z + W.gridView.ox, y: (mapEl.scrollTop + vh / 2) / W.gridView.z + W.gridView.oy };
        const ps = Object.values(pos);
        const bx0 = ps.length ? Math.min(...ps.map(p => p.x)) - R - 6 : 0, by0 = ps.length ? Math.min(...ps.map(p => p.y)) - R - 6 : 0;
        const bx1 = ps.length ? Math.max(...ps.map(p => p.x)) + R + 6 : 2 * R, by1 = ps.length ? Math.max(...ps.map(p => p.y)) + R + 6 : 2 * R;
        const z = W.curZ = ZOOMS[W.zoom] === 'fit' ? Math.min(1, (vw - 32) / (bx1 - bx0), (vh - 32) / (by1 - by0)) : ZOOMS[W.zoom];
        const mx = 0.6 * vw / z, my = 0.6 * vh / z;
        const CW = Math.max(bx1 - bx0 + 2 * mx, vw / z), CH = Math.max(by1 - by0 + 2 * my, (vh + CTRL_H) / z);
        const ox = (bx0 + bx1) / 2 - CW / 2, oy = (by0 + by1) / 2 - CH / 2;
        mapEl.innerHTML = `<svg width="${CW * z}" height="${CH * z}" viewBox="${ox} ${oy} ${CW} ${CH}">
            <defs><pattern id="gp-dots" x="${-SNAP / 2}" y="${-SNAP / 2}" width="${SNAP}" height="${SNAP}" patternUnits="userSpaceOnUse"><circle cx="${SNAP / 2}" cy="${SNAP / 2}" r="1.3" fill="#5a4e42"/></pattern></defs>
            <rect x="${ox}" y="${oy}" width="${CW}" height="${CH}" fill="url(#gp-dots)"/>${lines}${hits}${boxes}</svg>`;
        if (!anchor) anchor = { x: (bx0 + bx1) / 2, y: (by0 + by1) / 2 };
        mapEl.scrollLeft = (anchor.x - ox) * z - vw / 2;
        mapEl.scrollTop = (anchor.y - oy) * z - vh / 2;
        W.gridView = { z, ox, oy };
        zoomBtn();
    }
    const TOOLS = { select: 'SELECT', add: 'ADD', link: 'LINK', cut: 'CUT', delete: 'DELETE' };
    function drawGridUI() {
        const P = W.P, b = W.el.querySelector('.gp-build');
        drawMap();
        const hint = {
            select: 'Tap a node to edit · drag it to move · drag empty space to pan',
            link: W.linkFrom ? `Now tap the card that comes after “${esc(W.linkOpt === null ? title(byId(P, W.linkFrom)) : (options(byId(P, W.linkFrom))[W.linkOpt] || ''))}”` : 'Tap a card or a choice’s numbered option, then the card after it',
            cut: 'Tap a line to remove it',
            delete: 'Tap a node to delete it'
        };
        const sub = W.tool === 'add'
            ? NODE_TYPES.filter(t => typeDef(t)).map(t => `<div class="gp-chip ${t === W.addType ? 'on' : ''}" data-addtype="${t}">${TYPE_NAME[t]}</div>`).join('') + `<span class="gp-hx">then tap a spot</span>`
            : `<span class="gp-hx">${hint[W.tool]}</span>`;
        b.querySelector('.gp-tools').innerHTML = `<div class="gp-seg">${Object.keys(TOOLS).map(k => `<div class="${k === W.tool ? 'on' : ''}" data-tool="${k}">${TOOLS[k]}</div>`).join('')}<div class="act" data-tool="tidy">TIDY</div></div><div class="gp-tsub">${sub}</div>`;
        const sheet = b.querySelector('.gp-sheet');
        sheet.innerHTML = '';
        const n = W.selected && (W.tool === 'select' || W.tool === 'add') ? byId(P, W.selected) : null;
        if (n) sheet.appendChild(nodeBlock(n, true));
        sheet.classList.toggle('on', !!n);
    }
    function wireMapPointer(mapEl) {
        let ptr = null;
        mapEl.addEventListener('click', e => {      // LIST mode: tap a card on the map to select it
            if (W.buildMode === 'grid') return;
            const g = e.target.closest('g[data-id]'); if (!g) return;
            W.selected = g.dataset.id; W.afterOpen = false; drawBuild();
            const row = W.el.querySelector(`.gp-list .gp-node[data-id="${g.dataset.id}"]`);
            if (row) row.scrollIntoView({ block: 'start' });
        });
        mapEl.addEventListener('pointerdown', e => {
            if (W.buildMode !== 'grid') return;
            const g = e.target.closest('g[data-id]'), c = e.target.closest('[data-cut]');
            const key = g && g.dataset.id, isOpt = key && key.includes('#');
            ptr = { x: e.clientX, y: e.clientY, key, id: isOpt ? null : key, dot: isOpt ? key : null, cut: c && c.dataset.cut, moved: false, sl: mapEl.scrollLeft, st: mapEl.scrollTop };
            if (key) { const q = gridPositions(W.P)[key]; ptr.ox = q.x; ptr.oy = q.y; }
            mapEl.setPointerCapture(e.pointerId);
        });
        mapEl.addEventListener('pointermove', e => {
            if (!ptr) return;
            const dx = e.clientX - ptr.x, dy = e.clientY - ptr.y;
            if (!ptr.moved && Math.hypot(dx, dy) < 6) return;
            ptr.moved = true;
            if (ptr.key && W.tool === 'select') {
                snapshotGrid(W.P);
                W.P.gridLayout[ptr.key] = { x: ptr.ox + dx / W.curZ, y: ptr.oy + dy / W.curZ };
                drawMap({ noScroll: true });
            } else { mapEl.scrollLeft = ptr.sl - dx; mapEl.scrollTop = ptr.st - dy; }
        });
        mapEl.addEventListener('pointerup', e => {
            const p = ptr; ptr = null; if (!p) return;
            if (p.moved) {
                if (p.key && W.tool === 'select') { const q = W.P.gridLayout[p.key]; q.x = snapG(q.x); q.y = snapG(q.y); save(); drawMap({ noScroll: true }); }
                return;
            }
            W.sheetGuard = Date.now();
            gridTap(p, e);
        });
        mapEl.addEventListener('pointercancel', () => { ptr = null; });
    }
    function gridTap(p, e) {
        const P = W.P, svg = W.el.querySelector('.gp-mapin svg'); if (!svg) return;
        const r = svg.getBoundingClientRect();
        const x = (e.clientX - r.left) / W.curZ + W.gridView.ox, y = (e.clientY - r.top) / W.curZ + W.gridView.oy;
        if (p.dot && W.tool === 'delete') {      // deleting an option node removes that option from its choice
            const [cid, oi] = p.dot.split('#'), c = byId(P, cid), i = +oi, items = c.card.state.items;
            if (items.length < 2) { toast('A choice needs at least one option'); return; }
            items.splice(i, 1);
            const s = c.card.state.selectedIndex;
            if (s === i) c.card.state.selectedIndex = null; else if (s > i) c.card.state.selectedIndex = s - 1;
            P.nodes.forEach(n => n.after = n.after.filter(l => !(l.id === cid && l.opt === i)).map(l => (l.id === cid && l.opt > i) ? { id: l.id, opt: l.opt - 1 } : l));
            if (P.gridLayout) {
                const L = P.gridLayout;
                Object.keys(L).filter(k => k.startsWith(cid + '#')).map(k => +k.split('#')[1]).sort((a, b) => a - b)
                    .forEach(j => { if (j === i) delete L[cid + '#' + j]; else if (j > i) { L[cid + '#' + (j - 1)] = L[cid + '#' + j]; delete L[cid + '#' + j]; } });
            }
            save(); return drawGridUI();
        }
        if (p.dot && W.tool === 'link' && W.linkFrom) { toast('Options come from their choice'); return; }
        if (p.dot && W.tool !== 'link') p.id = p.dot.split('#')[0];
        switch (W.tool) {
            case 'select': W.selected = p.id || null; W.afterOpen = false; break;
            case 'add': {
                if (p.id) { W.selected = p.id; break; }
                const spot = { x: snapG(x), y: snapG(y) };
                snapshotGrid(P);
                if (tooClose(spot, gridPositions(P))) { toast('Too close to another node'); return; }
                const n = addNode(P, W.addType);
                if (W.addType === 'threshold') { n.card.state.items = [{ text: '', completed: false }, { text: '', completed: false }]; n.card.state.number1 = 1; n.card.state.threshold = 1; }
                if (W.addType === 'checklist') n.card.state.items = [{ text: '', completed: false }, { text: '', completed: false }];
                P.gridLayout[n.id] = spot; W.selected = n.id; W.afterOpen = false;
                break;
            }
            case 'link': {
                if (!W.linkFrom) {
                    if (p.dot) { const [cid, oi] = p.dot.split('#'); W.linkFrom = cid; W.linkOpt = +oi; }
                    else if (p.id) { W.linkFrom = p.id; W.linkOpt = null; }
                    break;
                }
                if (!p.id || p.id === W.linkFrom) { W.linkFrom = null; W.linkOpt = null; break; }
                const A = byId(P, W.linkFrom), B = byId(P, p.id), opt = W.linkOpt;
                W.linkFrom = null; W.linkOpt = null;
                if (descendants(P, B.id).has(A.id)) { toast('That would make a loop'); break; }
                if (B.after.some(l => l.id === A.id && l.opt === (opt === null ? undefined : opt))) { toast('Already linked'); break; }
                B.after = B.after.filter(l => l.id !== A.id);
                B.after.push(opt === null ? { id: A.id } : { id: A.id, opt });
                break;
            }
            case 'cut': {
                if (!p.cut) { toast('Tap a line'); return; }
                const [cid, pid, o] = p.cut.split('|'), C = byId(P, cid);
                C.after = C.after.filter(l => !(l.id === pid && String(l.opt === undefined ? '' : l.opt) === o));
                break;
            }
            case 'delete': if (!p.id) return; removeNode(P, p.id); if (W.selected === p.id) W.selected = null; break;
        }
        save(); drawGridUI();
    }

    // ===== THE PATH CARD (in a tab) =====
    window.GT50Lib.Path = {
        defaultState: function() {
            return { name: '', nodes: [], gridLayout: null, seq: 0, stampSeq: 0 };
        },
        renderBuild: function(container, state, onChange, onMove, onDelete, isDeletePending) {
            const btn = (act, glyph, bg) => `<button data-action="${act}" style="width: var(--square-section); height: 100%; background: transparent; border: none; border-left: var(--border-width) solid var(--border-color); color: var(--color-10); cursor: pointer; font-family: inherit; position: relative;">
                <div style="position:absolute; inset:0; background:${bg}; filter: brightness(0.75); z-index:-1;"></div>${glyph}</button>`;
            container.innerHTML = `<div style="background: ${state.color || 'var(--color-5)'}; border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); height: var(--card-height); display: flex; align-items: center; overflow: hidden; margin-bottom: var(--margin);">
                <div data-action="open" style="width: var(--square-section); min-width: var(--square-section); height: 100%; background: var(--blur); border-right: var(--border-width) solid var(--border-color); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--font-color-3);">${ICON.path('currentColor', 22)}</div>
                <div style="flex: 1; height: 100%; display: flex; align-items: center; min-width: 0;">
                    <input data-field="name" type="text" value="${esc(state.name || '')}" placeholder="Path" style="width: 100%; background: transparent; border: none; padding: 0 var(--text-padding-right, 8px) 0 var(--text-padding-left); font-size: 16px; font-weight: 600; color: var(--font-color-3); outline: none; font-family: inherit;"></div>
                ${onMove ? btn('move-up', '▲', 'var(--bg-4)') + btn('move-down', '▼', 'var(--bg-4)') : ''}
                ${onDelete ? btn('delete', '×', isDeletePending ? 'var(--color-1)' : 'var(--bg-4)') : ''}</div>`;
            container.querySelector('[data-field="name"]').oninput = e => { state.name = e.target.value; };
            container.querySelector('[data-action="open"]').onclick = () => open(state, 'build', null);
            const up = container.querySelector('[data-action="move-up"]'); if (up) up.onclick = () => onMove(-1);
            const dn = container.querySelector('[data-action="move-down"]'); if (dn) dn.onclick = () => onMove(1);
            const del = container.querySelector('[data-action="delete"]'); if (del) del.onclick = onDelete;
        },
        // In a tab it looks and behaves like a nest card: centered name, swipe for MOVE / EDIT / DELETE / MORE,
        // with its progress shown as a fill. Tap opens the path; EDIT opens the builder.
        renderView: function(container, state, onChange, tabColor, ctx) {
            ctx = ctx || {};
            const p = progress(state), full = p.total > 0 && p.done === p.total;
            if (GT50Lib.Nest && GT50Lib.Nest.renderView) {
                GT50Lib.Nest.renderView(container, state, ctx.depth || 0, () => open(state, 'view', tabColor),
                    ctx.onMove || null, ctx.onDelete || null, onChange, ctx.closeAllActions || (() => {}),
                    false, null, ctx.onEnterMoveMode || null, ctx.onEnterCloneMode || null);
            } else {
                container.innerHTML = `<div class="nest-view-card" data-action="navigate" style="background: ${state.color || 'var(--color-9)'}; border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); height: var(--card-height); display: flex; align-items: center; justify-content: center; margin-bottom: var(--margin); color: var(--color-10); font-size: 16px; font-weight: 600; cursor: pointer; position: relative; overflow: hidden;">${esc(state.name || 'Path')}</div>`;
                container.querySelector('[data-action="navigate"]').onclick = () => open(state, 'view', tabColor);
            }
            const card = container.querySelector('.nest-view-card');
            if (card && p.total > 0 && p.done > 0) {      // progress fill behind the name
                const fill = document.createElement('div');
                fill.style.cssText = `position:absolute; top:0; left:0; height:100%; width:${full ? 100 : (p.done / p.total * 100)}%; background:${full ? 'var(--gold)' : (tabColor || 'var(--color-4)')}; pointer-events:none; z-index:0;`;
                card.insertBefore(fill, card.firstChild);
            }
            const nav = container.querySelector('[data-action="navigate"]');
            if (nav && !state.name) nav.textContent = 'Path';
            // EDIT opens the path's builder instead of the nest settings window
            const edit = container.querySelector('[data-action="edit"]');
            if (edit) edit.onclick = (e) => {
                e.stopPropagation();
                if (state.actionState) { state.actionState.isOpen = false; state.actionState.deletePending = false; state.actionState.moreDropdownOpen = false; }
                if (state.editWindow) state.editWindow.isOpen = false;
                onChange && onChange();
                open(state, 'build', tabColor);
            };
            // EXPORT writes this one path card
            const exp = container.querySelector('[data-action="export"]');
            if (exp) exp.onclick = (e) => {
                e.stopPropagation();
                const clean = JSON.parse(JSON.stringify(state));
                delete clean.actionState; delete clean.editWindow; delete clean.ui;
                const name = state.name || 'Path';
                const pkg = { version: '1.0', timestamp: new Date().toISOString(), app: 'The Joystick Journal', type: 'path', name,
                              data: { tabs: { tabs: [], activeViewTab: 0, selectedBuildTab: 0 }, tabComponents: [[{ id: Date.now(), type: 'path', state: clean }]] } };
                if (state.actionState) { state.actionState.isOpen = false; state.actionState.moreDropdownOpen = false; state.actionState.deletePending = false; }
                if (window.state && window.state.impex && GT50Lib.ImpEx) {
                    window.state.impex.exportOverrideData = pkg;
                    window.state.impex.activeTab = 'export';
                    window.state.impex.header.title = `EXPORT: ${name.toUpperCase()}`;
                    GT50Lib.ImpEx.open(window.state.impex, onChange);
                }
                onChange && onChange();
            };
        },
        // for the summary bar: the cards that count right now (not optional, not locked out)
        countedCards: function(state) { return counted(state).map(n => n.card); },
        progress: function(state) { return progress(state); },
        isOpen: function() { return !!W; },
        open: function(state, mode, tabColor) { open(state, mode || 'view', tabColor || null); }
    };

    // ===== REGISTER WITH THE APP SHELL =====
    if (window.GT50 && window.GT50.register) {
        window.GT50.register({
            type: 'path',
            label: 'PATH',
            color: 'var(--color-5-4)',
            lib: window.GT50Lib.Path,
            about: { desc: 'Cards that unlock as you go, with choices that branch', color: 'var(--color-5)' },
            info: function(state) {
                const p = progress(state);
                return { title: state.name || '', done: p.total > 0 && p.done === p.total,
                         text: [state.name].concat((state.nodes || []).map(n => n.card && n.card.state && n.card.state.title)).join(' ') };
            }
        });
    }
})();
