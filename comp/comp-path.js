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
    // Locked out = every way in is cut. Closing cascades down the path and stops at the first card
    // that still has an open way in (a card fed by rival branches survives either choice)
    function lockedOut(P, n, memo = new Map()) {
        if (memo.has(n.id)) return memo.get(n.id);
        memo.set(n.id, false);
        const v = n.after.length > 0 && (isGate(n)
            ? n.after.filter(l => !linkCut(P, l, memo)).length < gateNeed(n)
            : n.after.every(l => linkCut(P, l, memo)));
        memo.set(n.id, v); return v;
    }
    // ===== OPTION CARDS =====
    // A choice's options are cards. By default an option is a plain LIST card (just its text, nothing stored);
    // an option can instead hold a real card (checklist, progress, another choice...) marked slot: true and linked
    // to that option. Doing an option's card picks that option, which closes the others.
    const slotOf = (P, cid, i) => P.nodes.find(n => n.slot && n.after[0] && n.after[0].id === cid && n.after[0].opt === i);
    const slotHome = (P, n) => n.slot && n.after[0] ? { c: byId(P, n.after[0].id), i: n.after[0].opt } : null;
    function syncPicks(P) {
        for (let pass = 0; pass < 6; pass++) {
            let changed = false;
            P.nodes.forEach(c => {          // an option with a card counts as picked only while that card is done
                const st = c.card.state;
                if (c.card.type !== 'radio' || picked(c) === null) return;
                const sl = slotOf(P, c.id, picked(c));
                if (sl && !cardDone(sl)) { st.selectedIndex = null; st.autoPick = false; changed = true; }
            });
            P.nodes.filter(n => n.slot).forEach(n => {
                const h = slotHome(P, n); if (!h || !h.c) return;
                if (cardDone(n) && picked(h.c) === null) { h.c.card.state.selectedIndex = h.i; h.c.card.state.autoPick = true; changed = true; }
            });
            if (!changed) break;
        }
    }
    // ===== THRESHOLD GATES =====
    // A THRESHOLD card in a path counts the cards linked into it: it's done once at least
    // its required number of them are done. Its items mirror those links and fill in by themselves.
    const isGate = n => n.card.type === 'threshold';
    const gateNeed = n => Math.max(1, Math.min(Number(n.card.state.number1) || n.after.length, n.after.length || 1));
    function optText(P, l) { const p = byId(P, l.id); const o = p ? options(p)[l.opt] : null; return o ? ' → ' + o : ''; }
    function syncGates(P) {
        syncPicks(P);
        ordered(P).filter(isGate).forEach(n => {
            const st = n.card.state, old = st.items || [];
            st.items = n.after.map((l, i) => {
                const p = byId(P, l.id);
                return Object.assign({}, old[i] || {}, { text: (p ? title(p) : '?') + (l.opt !== undefined ? optText(P, l) : ''), completed: linkMet(P, l) });
            });
            st.threshold = n.after.length || null;
            st.number1 = n.after.length ? gateNeed(n) : (Number(st.number1) || null);
            st.manuallyChecked = false;
        });
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
        const h = slotHome(P, n);
        if (h && h.c && picked(h.c) === null) return status(P, h.c) === 'available' ? 'available' : 'later';
        const live = n.after.filter(l => !linkCut(P, l, new Map()));
        if (isGate(n)) return live.some(l => linkMet(P, l)) ? 'available' : 'later';
        return live.every(l => linkMet(P, l)) ? 'available' : 'later';
    }
    // Spare = an unfinished card that only feeds threshold gates which are already met: it no longer counts
    function isSpare(P, n) {
        if (cardDone(n)) return false;
        const kids = P.nodes.filter(c => c.after.some(l => l.id === n.id));
        return kids.length > 0 && kids.every(c => isGate(c) && cardDone(c));
    }
    const counted = P => P.nodes.filter(n => !n.optional && !lockedOut(P, n) && !isSpare(P, n));
    function progress(P) { syncGates(P); const c = counted(P); return { done: c.filter(cardDone).length, total: c.length }; }
    function stamp(P) {
        syncGates(P);
        P.nodes.forEach(n => { const c = cardDone(n); if (c && !n.doneAt) n.doneAt = ++P.stampSeq; if (!c) n.doneAt = null; });
    }
    function depthOf(P, n, seen = new Set()) {
        if (!n.after.length || seen.has(n.id)) return 0;
        seen.add(n.id);
        return 1 + Math.max(...n.after.map(l => { const p = byId(P, l.id); return p ? depthOf(P, p, new Set(seen)) : -1; }));
    }
    function ancestors(P, id, acc = new Set()) {
        const n = byId(P, id); if (!n) return acc;
        n.after.forEach(l => { if (!acc.has(l.id)) { acc.add(l.id); ancestors(P, l.id, acc); } });
        return acc;
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
        .gp-gate [data-action="toggle-item"], .gp-gate [data-action="toggle-all"], .gp-gate input[data-field="threshold"] { pointer-events: none; }
        .gp-gate input[data-field="threshold"] { opacity: .6; }
        .gp-gate div:has(> input[data-idx]), .gp-gate [data-action="add"] { display: none !important; }
        .gp-choice { border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); background: var(--bg-2); margin-bottom: var(--margin); overflow: hidden; }
        .gp-choice .gp-choice { margin: 0 0 var(--margin); }
        .gp-ch { display: flex; align-items: center; justify-content: center; min-height: 34px; padding: 4px 10px; background: var(--color-1-3); color: var(--color-10); font-weight: 800; font-size: 13px; text-align: center; border-bottom: var(--border-width) solid var(--border-color); }
        .gp-cn { font-size: 10px; font-weight: 700; color: #e9d9b8; text-align: center; padding: 5px 8px 0; }
        .gp-cb { padding: var(--margin) var(--margin) 0; }
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
        .gp-sub .gt-top { border-bottom: var(--border-width) solid var(--border-color); }
        .gp-startbar { margin-bottom: var(--margin); }
        .gp-startbar .gp-btn { margin: 0; }
        .gp-list { flex: 1; overflow-y: auto; padding: var(--margin); min-height: 0; }
        .gp-node { border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); overflow: hidden; margin-bottom: var(--margin); background: var(--color-5); }
        .gp-node.optional { border-style: dashed; }
        .gp-bn { display: flex; height: 39px; cursor: pointer; }
        .gp-bn .gp-ico { width: var(--square-section); min-width: var(--square-section); border-right: var(--border-width) solid var(--border-color); display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,.12); }
        .gp-bn .gp-nm { flex: 1; display: flex; align-items: center; padding: 0 8px; color: var(--color-10); font-weight: 700; font-size: 13px; min-width: 0; }
        .gp-bn .gp-nm span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        /* right third: AFTER on top, BEFORE underneath, each up to two lines */
        .gp-bn .gp-ab { flex: none; width: 33.333%; display: flex; flex-direction: column; gap: 2px; border-left: var(--border-width) solid var(--border-color); background: rgba(0,0,0,.55); }
        .gp-bn .gp-ab > div { flex: 1 1 0; min-height: 0; display: flex; align-items: center; gap: 4px; padding: 0 5px; overflow: hidden; background: #283252; }
        .gp-bn .gp-ab small { flex: none; width: 27px; font-size: 6.5px; font-weight: 800; letter-spacing: .05em; color: rgba(255,255,255,.55); }
        .gp-bn .gp-ab span { flex: 1; min-width: 0; font-size: 7.5px; line-height: 8.2px; font-weight: 700; color: var(--color-10); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
        .gp-bn .gp-ab span.fit { display: block; -webkit-line-clamp: none; }
        .gp-bn .gp-ab .gp-startpill { font-size: 6.5px; padding: 0 4px 0 3px; border-width: 1.5px; border-radius: 3px; gap: 3px; }
        .gp-bn .gp-ab .gp-startpill::before { border-left-width: 4px; border-top-width: 3px; border-bottom-width: 3px; }
        .gp-bn .gp-ab .gp-endpill::before { width: 4px; height: 4px; border: none; }
        .gp-bn .gp-af { font-size: 9px; font-weight: 700; color: rgba(255,255,255,.7); padding-right: 8px; display: flex; align-items: center; white-space: nowrap; max-width: 45%; overflow: hidden; }
        .gp-slotinfo { display: flex; align-items: center; gap: 8px; border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); background: var(--bg-5); padding: 5px 6px 5px 8px; color: var(--color-10); }
        .gp-slotinfo b { flex: none; width: 22px; height: 22px; border: 2px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; }
        .gp-slotinfo span { flex: 1; min-width: 0; font-size: 11px; font-weight: 800; letter-spacing: .03em; display: flex; flex-direction: column; }
        .gp-slotinfo small { font-size: 9px; font-weight: 600; opacity: .75; letter-spacing: 0; }
        .gp-slotinfo .gp-btn { height: 26px; font-size: 10px; flex: none; }
        .gp-optnum { color: var(--color-10); font-size: 12px; font-weight: 800; }
        .gp-optrow { display: flex; height: var(--card-height); border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); overflow: hidden; background: var(--color-1-3); }
        .gp-optin { flex: 1; min-width: 0; background: transparent; border: none; outline: none; color: var(--color-10); font: 600 16px inherit; font-family: inherit; padding: 0 10px; }
        .gp-optsheet .gp-row { margin-bottom: 4px; }
        .gp-optsheet .gp-btns + .gp-btns { margin-top: 4px; }
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
        .gp-after > .gp-ad { display: none; background: var(--bg-1); border-top: var(--border-width) solid var(--border-color); padding: 4px; }
        .gp-after.open > .gp-ad { display: block; }
        .gp-row { display: flex; height: 30px; border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); overflow: hidden; margin-bottom: 4px; background: var(--bg-4); cursor: pointer; }
        .gp-row.on { background: var(--accent); }
        .gp-row.sub { margin-left: 16px; }
        .gp-row .gp-sq { width: 30px; min-width: 30px; background: var(--color-10); border-right: var(--border-width) solid var(--border-color); display: flex; align-items: center; justify-content: center; }
        .gp-row.on .gp-sq { background: var(--accent); }
        .gp-row .gp-rn { flex: 1; display: flex; align-items: center; padding: 0 8px; color: var(--color-10); font-size: 12px; font-weight: 600; min-width: 0; }
        .gp-row .gp-rn span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .gp-ed .gt-dd { background: var(--bg-1) !important; }
        .gp-startpill { display: inline-flex; align-items: center; gap: 4px; background: var(--color-10); color: #000; border: 2px solid #000; border-radius: 5px; padding: 1px 6px 1px 5px; font-size: 9px; font-weight: 800; letter-spacing: .08em; line-height: 1.3; }
        .gp-startpill::before { content: ''; border-left: 6px solid #000; border-top: 4px solid transparent; border-bottom: 4px solid transparent; }
        .gp-row.gp-startrow { background: var(--color-10); margin-bottom: 8px; }
        .gp-row.gp-startrow .gp-rn { color: #000; font-weight: 800; letter-spacing: .06em; font-size: 11px; gap: 6px; }
        .gp-row.gp-startrow .gp-rn::before { content: ''; border-left: 8px solid #000; border-top: 5px solid transparent; border-bottom: 5px solid transparent; }
        .gp-row.gp-startrow .gp-sq { background: var(--bg-1); }
        .gp-row.gp-startrow.on .gp-sq { background: var(--accent); }
        .gp-before { margin-top: var(--margin); }
        .gp-row.gp-orow { cursor: default; }
        .gp-row.gp-orow .gp-rn { padding-left: 10px; }
        .gp-opts { display: flex; flex: none; border-left: var(--border-width) solid var(--border-color); }
        .gp-opts i { font-style: normal; width: 30px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #000; background: var(--color-10); cursor: pointer; }
        .gp-opts i:first-child { width: 38px; font-size: 9px; letter-spacing: .04em; }
        .gp-opts i + i { border-left: var(--border-width) solid var(--border-color); }
        .gp-opts i.on { background: var(--oc, var(--accent)); color: var(--color-10); }
        .gp-endpill::before { border: none; width: 6px; height: 6px; background: #000; border-radius: 1px; }
        .gp-row.gp-endrow .gp-rn::before { border: none; width: 8px; height: 8px; background: #000; border-radius: 1px; }
        .gp-row.dis { opacity: .45; cursor: default; }
        .gp-row.dis .gp-sq { background: var(--bg-5); }
        .gp-subhead svg * { stroke: var(--bg-3); }
        .gp-subhead { display: flex; align-items: center; gap: 6px; color: var(--bg-3); font-size: 10px; font-weight: 800; letter-spacing: .04em; margin: 6px 2px 4px; }
        .gp-hint { font-size: 10px; font-weight: 600; color: var(--color-10); background: var(--bg-3); border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); padding: 6px 8px; margin-top: 4px; }
        .gp-tog { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: var(--color-10); cursor: pointer; margin-top: 4px; }
        .gp-tog .gp-box { width: 22px; height: 22px; min-width: 22px; border: var(--border-width) solid var(--border-color); border-radius: 6px; background: var(--color-10); display: flex; align-items: center; justify-content: center; }
        .gp-tog.on .gp-box { background: var(--accent); }
        .gp-btns { display: flex; gap: 4px; margin-top: 8px; }
        .gp-btn { height: 32px; border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); background: var(--bg-4); color: var(--color-10); font-weight: 800; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0 10px; }
        .gp-btn.green { background: var(--color-4); flex: 1; } .gp-btn.red { background: var(--color-1); } .gp-btn.wide { flex: 1; }
        .gp-cardwrap { margin-top: 2px; }
        .gp-cardwrap div:has(> [data-action="move-up-card"]), .gp-cardwrap [data-action$="-card"] { display: none !important; }
        /* the ▲ ▼ × buttons are hidden here, so give their reserved room back to the card */
        .gp-cardwrap [style*="padding-right: 102px"]:not([data-idx]) { padding-right: 0 !important; }
        .gp-cardwrap [style*="padding-right: 145px"]:not([data-idx]), .gp-cardwrap [style*="padding-right: 193px"]:not([data-idx]) { padding-right: var(--text-padding-right, 8px) !important; }
        .gp-cardwrap [style*="padding-right: calc(var(--square-section) * 3"] { padding-right: 0 !important; }
        /* THRESHOLD: its XX of YY box sits in the right third */
        .gp-cardwrap [style*="right: 84px"] { right: 0 !important; width: calc((100% - var(--square-section)) / 3 + var(--border-width)) !important; border-right: none !important; box-sizing: border-box !important; }
        .gp-cardwrap [style*="padding-right: 193px"]:not([data-idx]) { padding-right: calc((100% - var(--square-section)) / 3 + 8px) !important; }
        .gp-cardwrap input[data-field="title"] { height: 100% !important; }
        /* PROGRESS: title takes two thirds, the number the right third */
        .gp-cardwrap input[data-field="title"][placeholder="Progress"] { flex: 0 0 66.667% !important; }
        .gp-cardwrap input[data-field="total"] { flex: 1 1 0 !important; text-align: center; padding: 0 !important; }
        .gp-map { --mh: max(34vh, 200px); height: var(--mh); border-top: var(--border-width) solid var(--border-color); background: var(--bg-2); position: relative; flex: none; overflow: hidden;
            transition: height .38s cubic-bezier(.4, 0, .2, 1), border-top-width .38s step-start; }
        .gp-map.off { height: 0; border-top-width: 0; transition: height .38s cubic-bezier(.4, 0, .2, 1), border-top-width .38s step-end; }
        .gp-mapwrap { position: absolute; left: 0; right: 0; top: 0; height: var(--mh); }
        .gp-build.grid .gp-mapwrap { height: auto; bottom: 0; }
        .gp-hide { position: absolute; top: 8px; left: 6px; z-index: 3; height: 28px; display: flex; align-items: center; gap: 6px; padding: 0 9px 0 7px; background: var(--bg-4); border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); cursor: pointer; color: var(--color-10); font-size: 10px; font-weight: 800; letter-spacing: .05em; }
        .gp-build.grid .gp-hide, .gp-build.grid .gp-showtab { display: none; }
        .gp-showtab { position: absolute; left: 50%; bottom: -12px; z-index: 6; height: 42px; padding: 0 16px 12px 13px; display: flex; align-items: center; gap: 7px;
            background: var(--bg-4); color: var(--color-10); font-size: 11px; font-weight: 800; letter-spacing: .06em; cursor: pointer;
            border: var(--border-width) solid var(--border-color); border-bottom: none; border-radius: var(--card-radius) var(--card-radius) 0 0;
            box-shadow: 0 -4px 12px rgba(0,0,0,.32); transform: translate(-50%, 110%); visibility: hidden;
            transition: transform .22s cubic-bezier(.4, 0, 1, 1), visibility 0s .22s; }
        .gp-showtab.on { transform: translate(-50%, 0); visibility: visible; transition: transform .34s cubic-bezier(.34, 1.56, .64, 1), visibility 0s; }
        .gp-build.grid .gp-list { display: none; }
        .gp-build.grid .gp-map, .gp-build.grid .gp-map.off { flex: 1; height: auto; border-top-width: 0; transition: none; }
        .gp-mapin { position: absolute; inset: 0; overflow: auto; display: flex; padding-bottom: 30px; }
        .gp-mapin svg { display: block; margin: auto; flex: none; }
        .gp-build.grid .gp-mapin { touch-action: none; padding-bottom: 0; }
        .gp-build.grid .gp-mapin svg { margin: 0; }
        .gp-undo { display: none; position: absolute; top: 8px; right: 6px; z-index: 3; height: 32px; border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); overflow: hidden; background: var(--bg-4); }
        .gp-build.grid .gp-undo { display: flex; }
        .gp-undo > div { width: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .gp-undo > div + div { border-left: var(--border-width) solid var(--border-color); }
        .gp-undo > div.off { opacity: .35; cursor: default; }
        .gp-zoom { position: absolute; bottom: 8px; left: 6px; z-index: 3; height: 28px; display: flex; align-items: center; gap: 6px; padding: 0 8px 0 6px; background: var(--bg-4); border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius); cursor: pointer; color: var(--color-10); font-size: 10px; font-weight: 800; letter-spacing: .05em; }
        .gp-zoom .gp-dots { display: flex; gap: 3px; } .gp-zoom .gp-dots i { width: 7px; height: 7px; border-radius: 50%; border: 2px solid #000; background: #fff; } .gp-zoom .gp-dots i.on { background: var(--gold); }
        .gp-key { position: absolute; right: 6px; bottom: 12px; display: flex; gap: 7px; font-size: 9px; font-weight: 700; color: #c9bfae; z-index: 3; background: rgba(43,38,32,.85); padding: 3px 6px; border-radius: 6px; }
        .gp-key span::before { content: ''; display: inline-block; width: 8px; height: 8px; border-radius: 2px; margin-right: 3px; vertical-align: -1px; background: var(--c); }
        .gp-tools { display: none; flex: none; background: var(--bg-3); border-top: var(--border-width) solid var(--border-color); padding: var(--margin); }
        .gp-build.grid .gp-tools { display: block; }
        .gp-tools .gp-seg { height: 34px; } .gp-tools .gp-seg > div { font-size: 9.5px; } .gp-tools .gp-seg > div.act { background: var(--bg-4); color: var(--color-10); }
        .gp-tools .gp-seg + .gp-seg { margin-top: var(--margin); }
        .gp-tools .gp-info > div { flex: 1 1 0; min-width: 0; cursor: default; font-size: 10px; font-weight: 700; letter-spacing: 0; padding: 0 8px; text-align: center; line-height: 1.2; }
        .gp-tools .gp-types2 > div { flex: 1 1 0; min-width: 0; font-size: 8.5px; letter-spacing: 0; cursor: pointer; }
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
    // ===== UNDO / REDO =====
    // every save records what the path looked like before it (cards, links, grid spots); up to 60 steps back
    const snap = P => JSON.stringify({ nodes: P.nodes, gridLayout: P.gridLayout, seq: P.seq, name: P.name });
    function record() {
        if (!W || !W.P) return;
        const cur = snap(W.P);
        if (W.last === undefined) { W.last = cur; return; }
        if (cur === W.last) return;
        W.undo.push(W.last); if (W.undo.length > 60) W.undo.shift();
        W.redo = []; W.last = cur;
        syncUndo();
    }
    function syncUndo() {
        const b = W && W.el && W.el.querySelector('.gp-undo'); if (!b) return;
        b.querySelector('[data-u="undo"]').classList.toggle('off', !W.undo.length);
        b.querySelector('[data-u="redo"]').classList.toggle('off', !W.redo.length);
    }
    function step(back) {
        const from = back ? W.undo : W.redo, to = back ? W.redo : W.undo;
        if (!from.length) return;
        to.push(W.last); W.last = from.pop();
        const d = JSON.parse(W.last);
        W.P.nodes = d.nodes; W.P.gridLayout = d.gridLayout; W.P.seq = d.seq; W.P.name = d.name;
        if (W.selected && !byId(W.P, W.selected)) W.selected = null;
        if (W.selOpt) { const [c, i] = W.selOpt.split('#'), n = byId(W.P, c); if (!n || !options(n)[+i] === undefined || +i >= options(n).length) W.selOpt = null; }
        W.linkFrom = null; W.linkOpt = null;
        if (typeof window.render === 'function') window.render(true);
        drawBuild();
        toast(back ? 'Undone' : 'Redone');
    }
    const save = () => { record(); if (typeof window.render === 'function') { const y = W && W.el ? W.el.querySelector('.gp-play, .gp-list') : null; const top = y ? y.scrollTop : 0; window.render(true); if (y) y.scrollTop = top; } };

    function open(P, mode, tabColor) {
        injectStyles();
        close(false);
        W = { P, mode, tabColor, buildMode: (P.ui && P.ui.buildMode) || 'list', tool: 'select', addType: 'list', linkFrom: null, linkOpt: null,
              selected: null, afterOpen: false, zoom: 0, gridView: null, mapHidden: !!(P.ui && P.ui.mapHidden), undo: [], redo: [], last: undefined, optOpen: true, missOpen: false, sheetGuard: 0 };
        const el = document.createElement('div');
        el.className = 'gp-ov';
        el.innerHTML = `<div class="gp-band"><div class="gp-nbar"></div><div class="gp-sub"></div></div>
            <div class="gp-main" style="flex:1; display:flex; flex-direction:column; min-height:0"></div>`;
        document.body.appendChild(el);
        document.body.style.overflow = 'hidden';
        W.el = el;
        if (W.mode === 'build' && W.buildMode === 'grid') enterGrid();
        record();
        drawHeader();
        draw();
    }
    // the grid opens where you left it: its centre point and zoom are kept with the path
    function saveGridSpot() {
        if (!W || W.buildMode !== 'grid' || !W.gridView) return;
        const m = W.el.querySelector('.gp-mapin'); if (!m || !m.querySelector('svg')) return;
        const v = W.gridView, vh = m.clientHeight - CTRL_H;
        W.P.ui = W.P.ui || {};
        W.P.ui.grid = { x: (m.scrollLeft + m.clientWidth / 2) / v.z + v.ox, y: (m.scrollTop + vh / 2) / v.z + v.oy, zoom: W.zoom };
    }
    function enterGrid() {
        const g = W.P.ui && W.P.ui.grid;
        W.gridView = null;
        W.zoom = g ? g.zoom : 0;
        W.gridAnchor = g ? { x: g.x, y: g.y } : null;
    }
    function close(doSave) {
        if (!W) return;
        saveGridSpot();
        if (W.P) { W.P.ui = W.P.ui || {}; W.P.ui.buildMode = W.buildMode; W.P.ui.mapHidden = !!W.mapHidden; }
        if (W.el) W.el.remove();
        document.body.style.overflow = '';
        W = null;
        if (doSave) save();
    }
    // the same bar nests use: back on the left, the name in the middle, home (view) or save-and-exit (edit) on the right
    function drawHeader() {
        const band = W.el.querySelector(".gp-nbar");
        // second header in build mode: LIST / GRID as tab cards, like the tab bands elsewhere in the app
        const sub = W.el.querySelector('.gp-sub');
        sub.innerHTML = W.mode === 'build' ? `<div class="gt-top">
            <div class="gt-tab" data-b="list" style="--tab-color: var(--color-5-2)"><span>LIST</span></div>
            <div class="gt-tab" data-b="grid" style="--tab-color: var(--color-5-2)"><span>GRID</span></div></div>` : '';
        sub.onclick = e => {
            const d = e.target.closest('[data-b]'); if (!d || d.dataset.b === W.buildMode) return;
            saveGridSpot();
            W.buildMode = d.dataset.b; W.selected = null; W.linkFrom = null; W.linkOpt = null; W.afterOpen = false;
            if (W.buildMode === 'grid') enterGrid();
            const t = W.el.querySelector('.gp-toast'); if (t) t.classList.remove('on');
            drawBuild();
        };
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
        wrap.className = (mini ? 'gp-mini' : '') + (isGate(n) ? ' gp-gate' : '');
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
    function choiceBlock(host, c) {
        const P = W.P, box = document.createElement('div');
        box.className = 'gp-choice';
        const branches = P.nodes.some(k => k.after.some(l => l.id === c.id && l.opt !== undefined));
        box.innerHTML = `<div class="gp-ch"><span>${esc(title(c))}</span></div>
            <div class="gp-cn">${branches ? 'Do one: it closes the other paths' : 'Do one: the story continues either way'}</div><div class="gp-cb"></div>`;
        host.appendChild(box);
        const body = box.querySelector('.gp-cb');
        options(c).forEach((o, i) => {
            const sl = slotOf(P, c.id, i);
            if (sl && sl.card.type === 'radio' && picked(sl) === null) return choiceBlock(body, sl);
            if (sl) return mountCard(body, sl, false);
            // a plain option: a list card whose tick is the pick
            const d = typeDef('list'); if (!d) return;
            const wrap = document.createElement('div'); body.appendChild(wrap);
            const tmp = Object.assign(d.lib.defaultState(), { title: o || 'Option ' + (i + 1), completed: picked(c) === i });
            d.lib.renderView(wrap, tmp, () => {
                if (tmp.completed) { c.card.state.selectedIndex = i; c.card.state.autoPick = false; }
                else if (picked(c) === i) c.card.state.selectedIndex = null;
                stamp(P); save(); drawPlay();
            }, W.tabColor);
        });
    }
    function drawPlay() {
        const P = W.P, main = W.el.querySelector('.gp-main');
        const keep = main.querySelector('.gp-play'); const top = keep ? keep.scrollTop : 0;
        stamp(P);
        const st = new Map(P.nodes.map(n => [n.id, status(P, n)]));
        // option cards of an undecided choice are shown inside that choice's block
        const inBlock = n => { const h = slotHome(P, n); return h && h.c && picked(h.c) === null; };
        const availAll = P.nodes.filter(n => st.get(n.id) === 'available' && !inBlock(n));
        const spare = n => n.optional || isSpare(P, n);
        const avail = availAll.filter(n => !spare(n)), extra = availAll.filter(spare);
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
            // an undecided choice: its options as cards; doing one picks it
            if (n.card.type === 'radio' && picked(n) === null) return choiceBlock(slot('avail'), n);
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
    // AFTER / BEFORE text always fits its two lines: the full list at 8.5px down to 6.5px; if that's too long,
    // the first few cards and "+N more"; last resort, the first card cut with "…"
    function fitAB(root) {
        root.querySelectorAll('.gp-ab span[data-items]').forEach(sp => {
            const items = JSON.parse(sp.dataset.items || '[]'), pre = sp.dataset.pre || '', box = sp.parentElement;
            const set = (txt, fs) => { sp.textContent = txt; sp.style.fontSize = fs + 'px'; sp.style.lineHeight = (fs * 1.12) + 'px'; };
            // starts at the largest size two lines can take in this box
            const fits = fs => sp.scrollHeight <= Math.min(box.clientHeight, 2 * fs * 1.12 + 0.5) && sp.scrollWidth <= sp.clientWidth + 1;
            sp.classList.add('fit');
            let ok = false;
            for (let k = items.length; k >= 1 && !ok; k--) {
                const txt = pre + items.slice(0, k).join(' + ') + (k < items.length ? ' +' + (items.length - k) + ' more' : '');
                for (let fs = Math.min(8.5, box.clientHeight / 2.3); fs >= 6.5 && !ok; fs -= 0.5) { set(txt, fs); ok = fits(fs); }
            }
            sp.classList.remove('fit');
            if (!ok) set(pre + items[0] + (items.length > 1 ? ' +' + (items.length - 1) + ' more' : ''), 6.5);   // clamps to two lines with …
            sp.title = pre + items.join(' + ');
        });
    }
    // the cards that wait for this one (with the option that leads there, for a choice)
    function beforeItems(P, n) {
        return P.nodes.filter(c => c.after.some(l => l.id === n.id)).map(c => {
            const l = c.after.find(x => x.id === n.id);
            return title(c) + (l.opt !== undefined ? ' (' + (options(n)[l.opt] || '?') + ')' : '');
        });
    }
    function afterItems(P, n) {
        return n.after.map(l => { const p = byId(P, l.id); return p ? (l.opt !== undefined ? (options(p)[l.opt] || '?') : title(p)) : '?'; });
    }
    const abSpan = (items, pre) => `<span data-items="${esc(JSON.stringify(items))}" data-pre="${esc(pre)}">${esc(pre + items.join(' + '))}</span>`;
    function afterLabel(P, n) {
        if (!n.after.length) return 'START';
        const list = n.after.map(l => { const p = byId(P, l.id); return p ? (l.opt !== undefined ? (options(p)[l.opt] || '?') : title(p)) : '?'; });
        return isGate(n) ? gateNeed(n) + ' of: ' + list.join(', ') : list.join(' + ');
    }
    function drawBuild() {
        const main = W.el.querySelector('.gp-main');
        if (!main.querySelector('.gp-build')) {
            main.innerHTML = `<div class="gp-build">
                <div class="gp-list"></div>
                <div class="gp-map ${W.mapHidden ? 'off' : ''}"><div class="gp-mapwrap"><div class="gp-mapin"></div><div class="gp-zoom"></div>
                    <div class="gp-undo"><div data-u="undo" aria-label="Undo"><svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4L3 8l4 4"/><path d="M3 8h9a5 5 0 0 1 0 10H8"/></svg></div><div data-u="redo" aria-label="Redo"><svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4l4 4-4 4"/><path d="M17 8H8a5 5 0 0 0 0 10h4"/></svg></div></div>
                    <div class="gp-hide" data-gp="hidemap"><svg viewBox="0 0 12 12" width="10" height="10"><path d="M1.5 3.5h9L6 9z" fill="#fff" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>HIDE</div>
                    <div class="gp-key"><span style="--c:#c9a227">done</span><span style="--c:#8f7658">available</span><span style="--c:#4a3f35">later</span><span style="--c:#7a2f2b">locked / missed</span></div></div></div>
                <div class="gp-showtab ${W.mapHidden ? 'on' : ''}" data-gp="showmap"><svg viewBox="0 0 12 12" width="10" height="10"><path d="M1.5 8.5h9L6 3z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>SHOW</div>
                <div class="gp-tools"></div><div class="gp-sheet"></div><div class="gp-toast"></div></div>`;
            wireBuild(main.querySelector('.gp-build'));
        }
        const b = main.querySelector('.gp-build');
        b.classList.toggle('grid', W.buildMode === 'grid');
        W.el.querySelectorAll('.gp-sub [data-b]').forEach(d => d.classList.toggle('active', d.dataset.b === W.buildMode));
        if (W.buildMode === 'grid') return drawGridUI();
        b.querySelector('.gp-sheet').classList.remove('on');
        const list = b.querySelector('.gp-list'), keep = list.scrollTop, P = W.P;
        list.innerHTML = '';
        // the add button leads the list and scrolls with the cards
        const add = document.createElement('div');
        add.className = 'gp-startbar';
        add.innerHTML = `<div class="gp-btn green" data-gp="addstart">+ NEW STARTING CARD</div>`;
        list.appendChild(add);
        ordered(P).forEach(n => list.appendChild(nodeBlock(n, false)));
        fitAB(list);
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
            ${inSheet ? `<div class="gp-x">×</div>` : `<div class="gp-ab">
                <div><small>AFTER</small>${n.after.length ? abSpan(afterItems(P, n), isGate(n) ? gateNeed(n) + ' of: ' : '') : `<b class="gp-startpill">START</b>`}</div>
                <div><small>BEFORE</small>${beforeItems(P, n).length ? abSpan(beforeItems(P, n), '') : `<b class="gp-startpill gp-endpill">END</b>`}</div></div>`}</div>`;
        if (sel) el.appendChild(editor(n));
        return el;
    }
    function editor(n) {
        const P = W.P, ed = document.createElement('div');
        ed.className = 'gp-ed';
        const banned = descendants(P, n.id); banned.add(n.id);
        const rows = [];
        // START: no cards before it, so it's open from the beginning
        const isStart = !n.after.length;
        rows.push(`<div class="gp-row gp-startrow ${isStart ? 'on' : ''}" data-gp="tostart"><div class="gp-sq">${isStart ? ICON.check() : ''}</div><div class="gp-rn"><span>START OF THE PATH</span></div></div>`);
        P.nodes.filter(p => !banned.has(p.id)).forEach(p => {
            if (p.card.type === 'radio') {
                // a choice: one row, with ANY and a numbered button per option (same numbers and colours as the grid)
                const lk = n.after.find(l => l.id === p.id), on = !!lk;
                const segs = [`<i class="${on && lk.opt === undefined ? 'on' : ''}" data-gp="link" data-p="${p.id}">ANY</i>`]
                    .concat(options(p).map((o, i) => `<i class="${on && lk.opt === i ? 'on' : ''}" data-gp="link" data-p="${p.id}" data-o="${i}" style="--oc:${OPT_TAG[i % OPT_TAG.length]}">${i + 1}</i>`));
                const which = on && lk.opt !== undefined ? ' → ' + (options(p)[lk.opt] || 'Option ' + (lk.opt + 1)) : '';
                rows.push(`<div class="gp-row gp-orow ${on ? 'on' : ''}"><div class="gp-rn"><span>${esc(title(p) + which)}</span></div><div class="gp-opts">${segs.join('')}</div></div>`);
            } else {
                const on = n.after.some(l => l.id === p.id);
                rows.push(`<div class="gp-row ${on ? 'on' : ''}" data-gp="link" data-p="${p.id}"><div class="gp-sq">${on ? ICON.check() : ''}</div><div class="gp-rn"><span>${esc(title(p))}</span></div></div>`);
            }
        });
        // cards that already come after this one can't come before it too (that would be a loop): listed, but locked
        const later = P.nodes.filter(p => banned.has(p.id) && p.id !== n.id);
        if (later.length) {
            rows.push(`<div class="gp-subhead">ALREADY AFTER THIS CARD</div>`);
            later.forEach(p => rows.push(`<div class="gp-row dis"><div class="gp-sq"></div><div class="gp-rn"><span>${esc(title(p))}</span></div></div>`));
        }
        // ===== COMES BEFORE: the cards that wait for this one =====
        const kids = P.nodes.filter(c => c.after.some(l => l.id === n.id));
        const earlier = ancestors(P, n.id);
        const brows = [];
        const isEnd = !kids.length;
        brows.push(`<div class="gp-row gp-startrow gp-endrow ${isEnd ? 'on' : ''}" data-gp="toend"><div class="gp-sq">${isEnd ? ICON.check() : ''}</div><div class="gp-rn"><span>END OF THE PATH</span></div></div>`);
        P.nodes.filter(c => c.id !== n.id && !earlier.has(c.id)).forEach(c => {
            const lk = c.after.find(l => l.id === n.id), on = !!lk;
            if (n.card.type === 'radio') {
                // this card is a choice: one row per card, with a numbered button per option (same numbers and colours as the grid)
                const opts = options(n);
                const segs = [`<i class="${on && lk.opt === undefined ? 'on' : ''}" data-gp="blink" data-c="${c.id}">ANY</i>`]
                    .concat(opts.map((o, i) => `<i class="${on && lk.opt === i ? 'on' : ''}" data-gp="blink" data-c="${c.id}" data-o="${i}" style="--oc:${OPT_TAG[i % OPT_TAG.length]}">${i + 1}</i>`));
                brows.push(`<div class="gp-row gp-orow ${on ? 'on' : ''}"><div class="gp-rn"><span>${esc(title(c))}</span></div><div class="gp-opts">${segs.join('')}</div></div>`);
            } else {
                brows.push(`<div class="gp-row ${on ? 'on' : ''}" data-gp="blink" data-c="${c.id}"><div class="gp-sq">${on ? ICON.check() : ''}</div><div class="gp-rn"><span>${esc(title(c))}</span></div></div>`);
            }
        });
        const before = P.nodes.filter(c => earlier.has(c.id));
        if (before.length) {
            brows.push(`<div class="gp-subhead">ALREADY BEFORE THIS CARD</div>`);
            before.forEach(c => brows.push(`<div class="gp-row dis"><div class="gp-sq"></div><div class="gp-rn"><span>${esc(title(c))}</span></div></div>`));
        }
        const kidLabel = kids.map(c => { const l = c.after.find(x => x.id === n.id); return title(c) + (l && l.opt !== undefined ? ' (' + (options(n)[l.opt] || '?') + ')' : ''); }).join(' + ');
        ed.innerHTML = `
            <div class="gp-lbl">CARD TYPE</div>
            <div class="gp-types">${NODE_TYPES.filter(t => typeDef(t)).map(t => `<div class="${t === n.card.type ? 'on' : ''}" data-gp="type" data-t="${t}">${TYPE_NAME[t]}</div>`).join('')}</div>
            <div class="gp-lbl">CARD</div><div class="gp-cardwrap"></div>
            <div class="gp-lbl">PATH</div>
            ${slotHome(P, n) ? `<div class="gp-slotinfo"><b style="background:${OPT_TAG[slotHome(P, n).i % OPT_TAG.length]}">${slotHome(P, n).i + 1}</b><span>OPTION ${slotHome(P, n).i + 1} OF ${esc(title(slotHome(P, n).c))}<small>Doing this card picks this option</small></span><div class="gp-btn" data-gp="unslot">PLAIN OPTION</div></div>` : ''}
            <div class="gp-after ${W.afterOpen ? 'open' : ''}" ${slotHome(P, n) ? 'style="display:none"' : ''}><div class="gp-ah" data-gp="afteropen">
                <div class="gp-ak"><small>COMES AFTER</small>${n.after.length ? `<span>${esc(afterLabel(P, n))}</span>` : `<span><b class="gp-startpill">START</b></span>`}</div>
                <div class="gp-ac">${n.after.length || ''}</div><div class="gp-aa">${ICON.down}</div></div>
                <div class="gp-ad">${rows.join('') || '<div class="gp-hint">No other cards yet</div>'}
                <div class="gp-hint">${isGate(n) ? `Threshold: needs ${n.after.length ? gateNeed(n) + ' of these ' + n.after.length : 'some of the'} cards done. Set the number in the card above.` : 'Needs every card ticked here.'} A choice's option means "only if this was picked".</div></div></div>
            <div class="gp-after gp-before ${W.beforeOpen ? 'open' : ''}"><div class="gp-ah" data-gp="beforeopen">
                <div class="gp-ak"><small>COMES BEFORE</small>${kids.length ? `<span>${esc(kidLabel)}</span>` : `<span><b class="gp-startpill gp-endpill">END</b></span>`}</div>
                <div class="gp-ac">${kids.length || ''}</div><div class="gp-aa">${ICON.down}</div></div>
                <div class="gp-ad">${brows.join('')}
                <div class="gp-hint">Each card ticked here waits for this one.${n.card.type === 'radio' ? ' Tap the option that leads to it: ' + options(n).map((o, i) => (i + 1) + ' = ' + (o || 'Option ' + (i + 1))).join(', ') + '.' : ''}</div></div></div>
            <div class="gp-lbl">EXTRA</div>
            <div class="gp-tog ${n.optional ? 'on' : ''}" data-gp="optional"><div class="gp-box">${n.optional ? ICON.check() : ''}</div>Optional: shown on the path, doesn't count toward progress</div>
            ${n.optional ? `<div class="gp-tog ${n.missable ? 'on' : ''}" data-gp="missable"><div class="gp-box">${n.missable ? ICON.check() : ''}</div>Missable: drops off once you move past this point</div>` : ''}
            <div class="gp-btns"><div class="gp-btn green" data-gp="addafter">+ ADD CARD AFTER THIS</div><div class="gp-btn red" data-gp="delete">DELETE</div></div>`;
        // the real card's own edit card
        const d = typeDef(n.card.type), host = ed.querySelector('.gp-cardwrap');
        host.classList.toggle('gp-gate', isGate(n));
        if (isGate(n)) syncGates(P);
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
                const h = slotHome(P, n); if (h && h.c && h.c.card.state.items[h.i]) h.c.card.state.items[h.i].text = n.card.state.title || '';
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
            case 'select': W.selected = W.selected === n.id ? null : n.id; W.afterOpen = false; W.beforeOpen = false; break;
            case 'afteropen': W.afterOpen = !W.afterOpen; break;
            case 'tostart': n.after = []; break;
            case 'unslot': {        // back to a plain list option: its links move onto the option itself
                const h = slotHome(P, n);
                P.nodes.forEach(k => k.after = k.after.map(l => l.id === n.id ? { id: h.c.id, opt: h.i } : l));
                P.nodes = P.nodes.filter(k => k !== n); W.selected = null; W.selOpt = h.c.id + '#' + h.i;
                break;
            }
            case 'beforeopen': W.beforeOpen = !W.beforeOpen; break;
            case 'toend': P.nodes.forEach(c => c.after = c.after.filter(l => l.id !== n.id)); break;
            case 'blink': {
                const c = byId(P, t.dataset.c), opt = t.dataset.o === undefined ? undefined : +t.dataset.o;
                const i = c.after.findIndex(l => l.id === n.id && l.opt === opt);
                if (i >= 0) c.after.splice(i, 1);
                else { c.after = c.after.filter(l => l.id !== n.id); c.after.push(opt === undefined ? { id: n.id } : { id: n.id, opt }); }
                break;
            }
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
        // the map under the list slides off the bottom; a SHOW tab pops up in its place
        const map = b.querySelector('.gp-map'), tab = b.querySelector('.gp-showtab');
        b.querySelector('.gp-hide').onclick = e => {
            e.stopPropagation(); if (W.mapHidden) return;
            W.mapHidden = true; map.classList.add('off');
            const done = ev => { if (ev && ev.target !== map) return; map.removeEventListener('transitionend', done); clearTimeout(t1); if (W && W.mapHidden) tab.classList.add('on'); };
            map.addEventListener('transitionend', done); const t1 = setTimeout(done, 450);
        };
        tab.onclick = () => {
            if (!W.mapHidden) return;
            tab.classList.remove('on');
            setTimeout(() => { if (!W) return; W.mapHidden = false; map.classList.remove('off'); }, 180);
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
        b.querySelector('.gp-undo').onclick = e => { const u = e.target.closest('[data-u]'); if (u) step(u.dataset.u === 'undo'); };
        b.querySelector('.gp-zoom').onclick = () => { W.zoom = (W.zoom + 1) % ZOOMS.length; drawMap({ noScroll: true, center: ZOOMS[W.zoom] === 'fit' }); };
        b.querySelector('.gp-tools').addEventListener('click', e => {
            const at = e.target.closest('[data-addtype]'); if (at) { W.addType = at.dataset.addtype; return drawGridUI(); }
            const d = e.target.closest('[data-tool]'); if (!d) return;
            if (d.dataset.tool === 'tidy') { W.P.gridLayout = null; toast('Back to the automatic layout'); save(); drawGridUI(); return drawMap({ center: true }); }
            W.tool = d.dataset.tool; W.linkFrom = null; W.linkOpt = null; W.selOpt = null;
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
    // GRID: nodes go anywhere, so each line is one smooth curve from edge to edge. It leaves and arrives across
    // the main direction of travel: sideways when the next node is mostly to the right, up/down when it's mostly above/below
    function gridShape(a, b, obs) {
        const dx = b.x - a.x, dy = b.y - a.y, sg = Math.sign(dy) || 1;
        // each shape: a start point plus pieces (C = curve, L = straight); sampled to check it misses other nodes
        const C = (x1, y1, x2, y2, x3, y3) => ['C', x1, y1, x2, y2, x3, y3];
        const side = () => { const x1 = a.x + R, x2 = b.x - R, k = Math.max(14, Math.abs(x2 - x1) / 2);
            return [x1, a.y, C(x1 + k, a.y, x2 - k, b.y, x2, b.y)]; };
        const vert = () => { const y1 = a.y + sg * R, y2 = b.y - sg * R, k = Math.max(14, Math.abs(y2 - y1) / 2);
            return [a.x, y1, C(a.x, y1 + sg * k, b.x, y2 - sg * k, b.x, y2)]; };
        const arc = u => { const y1 = a.y + u * R, y2 = b.y + u * R, dip = (u > 0 ? Math.max(y1, y2) : Math.min(y1, y2)) + u * 34;
            return [a.x, y1, C(a.x, dip, b.x, dip, b.x, y2)]; };
        // level first, then one bend into the node (or bend first, then level): the bend is as wide as the height it covers
        const late = () => { const x1 = a.x + R, x2 = b.x - R, w = Math.min(x2 - x1, Math.max(40, Math.abs(dy) * 1.1));
            return [x1, a.y, ['L', x2 - w, a.y], C(x2 - w / 2, a.y, x2 - w / 2, b.y, x2, b.y)]; };
        const early = () => { const x1 = a.x + R, x2 = b.x - R, w = Math.min(x2 - x1, Math.max(40, Math.abs(dy) * 1.1));
            return [x1, a.y, C(x1 + w / 2, a.y, x1 + w / 2, b.y, x1 + w, b.y), ['L', x2, b.y]]; };
        const right = dx > 0;
        const order = right && dx >= Math.abs(dy) * 0.6 ? [side, late, early, vert] : Math.abs(dy) > 2 * R ? [vert, side, late, early] : [() => arc(1), () => arc(-1)];
        const shapes = order.filter(f => right || (f !== side && f !== late && f !== early)).map(f => f());
        const bz = (t, p0, p1, p2, p3) => { const u = 1 - t; return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3; };
        const pts = sh => { const out = []; let x = sh[0], y = sh[1];
            sh.slice(2).forEach(sg2 => {
                if (sg2[0] === 'L') { for (let i = 1; i <= 12; i++) out.push([x + (sg2[1] - x) * i / 12, y + (sg2[2] - y) * i / 12]); x = sg2[1]; y = sg2[2]; }
                else { for (let i = 1; i <= 24; i++) { const t = i / 24; out.push([bz(t, x, sg2[1], sg2[3], sg2[5]), bz(t, y, sg2[2], sg2[4], sg2[6])]); } x = sg2[5]; y = sg2[6]; }
            });
            return out; };
        const clear = sh => pts(sh).every(([x, y]) => !(obs || []).some(o => Math.hypot(x - o.x, y - o.y) < R + 5));
        const sh = shapes.find(clear) || shapes[0];       // a line that has to cross a node takes the preferred shape
        return { sh, pts: [[sh[0], sh[1]]].concat(pts(sh)) };
    }
    function gridCurve(a, b, obs) {
        const { sh } = gridShape(a, b, obs);
        return `M${sh[0]} ${sh[1]} ` + sh.slice(2).map(g => g[0] === 'L' ? `L${g[1]} ${g[2]}` : `C${g.slice(1).join(' ')}`).join(' ');
    }
    function routeLine(x1, y1, x2, y2, obs) {
        // the card after sits to the left (or right on top of it): leave to the right, loop round on a level halfway between, come in from the left
        if (x2 < x1 + 24) {
            const r = 26, dy = y2 - y1;
            const ym = Math.abs(dy) >= 2 * r + 10 ? y1 + dy / 2 : Math.max(y1, y2) + 2 * r;
            const sx = x1 + r, ex = x2 - r;
            return `M${x1} ${y1} C${sx + r * .6} ${y1} ${sx + r * .6} ${ym} ${sx} ${ym} L${ex} ${ym} C${ex - r * .6} ${ym} ${ex - r * .6} ${y2} ${x2} ${y2}`;
        }
        const bend = Math.max(30, Math.abs(x2 - x1) / 2);
        const plain = `M${x1} ${y1} C${x1 + bend} ${y1} ${x2 - bend} ${y2} ${x2} ${y2}`;
        const M = 7;
        const hits = (x, y) => obs.some(o => x > o.x0 - M && x < o.x1 + M && y > o.y0 - M && y < o.y1 + M);
        const bez = (t, a, b, c, d) => { const u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; };
        let clear = true;
        for (let i = 1; i < 40 && clear; i++) { const t = i / 40; if (hits(bez(t, x1, x1 + bend, x2 - bend, x2), bez(t, y1, y1, y2, y2))) clear = false; }
        if (clear || x2 <= x1 + 40) return plain;
        // next try one smooth bend: drop (or rise) near the start then run level into the card, or run level then bend near the end.
        // The bend is as wide as the height it covers, so it stays a gentle curve
        const dy = Math.abs(y2 - y1), dx = x2 - x1;
        const segClear = (pts) => { for (let i = 1; i < 30; i++) { const t = i / 30; if (hits(bez(t, pts[0], pts[2], pts[4], pts[6]), bez(t, pts[1], pts[3], pts[5], pts[7]))) return false; } return true; };
        const lineClear = (xa, xb, y) => { for (let x = Math.min(xa, xb); x <= Math.max(xa, xb); x += 5) if (hits(x, y)) return false; return true; };
        for (const f of [1, 0.75, 0.5]) {
            const w = Math.min(dx, Math.max(40, dy * f));
            // bend first, then level at y2
            const A = [x1, y1, x1 + w / 2, y1, x1 + w / 2, y2, x1 + w, y2];
            if (segClear(A) && lineClear(x1 + w, x2, y2)) return `M${x1} ${y1} C${A[2]} ${A[3]} ${A[4]} ${A[5]} ${A[6]} ${A[7]} L${x2} ${y2}`;
            // level at y1, then bend
            const B = [x2 - w, y1, x2 - w / 2, y1, x2 - w / 2, y2, x2, y2];
            if (lineClear(x1, x2 - w, y1) && segClear(B)) return `M${x1} ${y1} L${x2 - w} ${y1} C${B[2]} ${B[3]} ${B[4]} ${B[5]} ${x2} ${y2}`;
        }
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
        // the S-bends into and out of the lane: as wide as the gaps allow, using the full gap when the drop is steep
        const g1 = Math.min(Math.min(...inWay.map(o => o.x0)) - x1 - 4, Math.max(tw1, Math.abs(lane - y1)));
        const g2 = Math.min(x2 - Math.max(...inWay.map(o => o.x1)) - 4, Math.max(tw2, Math.abs(lane - y2)));
        const w1 = Math.max(tw1, g1), w2 = Math.max(tw2, g2);
        return `M${x1} ${y1} C${x1 + w1 / 2} ${y1} ${x1 + w1 / 2} ${lane} ${x1 + w1} ${lane} L${x2 - w2} ${lane} C${x2 - w2 / 2} ${lane} ${x2 - w2 / 2} ${y2} ${x2} ${y2}`;
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
        if (W && W.P) syncGates(W.P);
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
                ${n.id === W.selected ? `<rect x="-3" y="-3" width="${NW + 6}" height="${NH + 6}" rx="11" fill="none" stroke="#c9a227" stroke-width="3"/>` : ''}
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
        const keyOf = id => { const n = byId(P, id), h = n && slotHome(P, n); return h && h.c ? h.c.id + '#' + h.i : id; };
        P.nodes.forEach(n => {
            const inSpot = n.slot && slotHome(P, n).c;        // an option card is drawn in its option's spot
            if (!inSpot) nodes.push({ key: n.id, n });
            options(n).forEach((o, i) => {
                nodes.push({ key: n.id + '#' + i, choice: n, opt: i });
                links.push({ from: keyOf(n.id), to: n.id + '#' + i, stem: true, choice: n, opt: i });
            });
        });
        P.nodes.forEach(n => n.after.forEach(l => {
            const p = byId(P, l.id); if (!p) return;
            if (n.slot && n.after[0] === l) return;           // an option card's own tie to its option
            links.push({ from: l.opt !== undefined && p.card.type === 'radio' ? l.id + '#' + l.opt : keyOf(l.id), to: keyOf(n.id), l, child: n, parent: p });
        }));
        return { nodes, links };
    }
    // how messy a node's lines are: crossings with other lines, plus nodes they pass through
    function cost(G, pos, key) {
        const lineOf = k => { const a = pos[k.from], b = pos[k.to]; return a && b ? { k, p: gridShape(a, b, []).pts } : null; };
        const mine = G.links.filter(k => k.from === key || k.to === key).map(lineOf).filter(Boolean);
        const others = G.links.filter(k => k.from !== key && k.to !== key).map(lineOf).filter(Boolean);
        const X = (p, q, r, t) => { const d = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
            return d(p, q, r) * d(p, q, t) < 0 && d(r, t, p) * d(r, t, q) < 0; };
        let c = 0;
        mine.forEach(m => {
            // lines that meet at the same node only join there; they don't cross
            others.filter(o => o.k.from !== m.k.from && o.k.to !== m.k.to && o.k.from !== m.k.to && o.k.to !== m.k.from).forEach(o => {
                let hit = false;
                for (let i = 1; i < m.p.length && !hit; i++) for (let j = 1; j < o.p.length && !hit; j++) if (X(m.p[i - 1], m.p[i], o.p[j - 1], o.p[j])) hit = true;
                if (hit) c++;
            });
            Object.entries(pos).forEach(([k2, q]) => { if (k2 !== m.k.from && k2 !== m.k.to && m.p.some(([x, y]) => Math.hypot(x - q.x, y - q.y) < R + 4)) c += 3; });
        });
        return c;
    }
    function gridAuto(G) {
        const parents = {}; G.links.forEach(k => (parents[k.to] = parents[k.to] || []).push(k.from));
        const depth = {}, dep = (key, seen = new Set()) => {
            if (depth[key] !== undefined) return depth[key];
            if (seen.has(key)) return 0; seen.add(key);
            const ps = parents[key] || [];
            return depth[key] = ps.length ? Math.max(...ps.map(p => dep(p, seen) + 1)) : 0;
        };
        G.nodes.forEach(nd => dep(nd.key));
        // an optional card that leads on to a later card sits between the two, not right after its own card
        const kids = {}; G.links.forEach(k => (kids[k.from] = kids[k.from] || []).push(k.to));
        // (in a lane of its own just below the cards it skips past, so its lines don't run through them)
        const lifted = {};
        G.nodes.filter(nd => nd.n && nd.n.optional && (kids[nd.key] || []).length).forEach(nd => {
            const next = Math.min(...kids[nd.key].map(k => depth[k]));
            if (next - depth[nd.key] > 1) { lifted[nd.key] = [depth[nd.key], next]; depth[nd.key] = Math.floor((depth[nd.key] + next) / 2); }
        });
        const cols = [];
        G.nodes.filter(nd => !lifted[nd.key]).forEach(nd => (cols[depth[nd.key]] = cols[depth[nd.key]] || []).push(nd.key));
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
        // the lane goes above or below the cards it skips, whichever side its lines cross fewer lines and nodes on (a tie goes above)
        Object.entries(lifted).forEach(([k, [from, to]]) => {
            let low = 0, high = 0;
            Object.entries(pos).forEach(([k2, q]) => { if (q.x >= from * COLW && q.x <= to * COLW) { low = Math.max(low, q.y); high = Math.min(high, q.y); } });
            const above = { x: depth[k] * COLW, y: snapG(high - ROWH) }, below = { x: depth[k] * COLW, y: snapG(low + ROWH) };
            pos[k] = cost(G, { ...pos, [k]: above }, k) <= cost(G, { ...pos, [k]: below }, k) ? above : below;
        });
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
        if (W && W.P) syncGates(W.P);
        const P = W.P, G = gridGraph(P), pos = gridPositions(P, G);
        const obstacles = G.nodes.filter(nd => pos[nd.key]).map(nd => { const q = pos[nd.key]; return { id: nd.key, x0: q.x - R, y0: q.y - R, x1: q.x + R, y1: q.y + R }; });
        const optState = (c, i) => { const pk = picked(c) === i, dead = lockedOut(P, c) || (picked(c) !== null && !pk); return { pk, dead }; };
        let lines = '', hits = '', boxes = '';
        G.links.forEach(k => {
            const a = pos[k.from], b = pos[k.to]; if (!a || !b) return;
            const d = gridCurve(a, b, Object.entries(pos).filter(([k2]) => k2 !== k.from && k2 !== k.to).map(([, q]) => q));
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
                if (n.id === W.selected) ring += `<circle r="${R + 3}" fill="none" stroke="#c9a227" stroke-width="3"/>`;
                if (n.id === W.linkFrom && W.linkOpt === null) ring += `<circle r="${R + 6}" fill="none" stroke="#7d93d9" stroke-width="3" stroke-dasharray="6 4"/>`;
                body = `<circle r="${R}" fill="${FILL[st]}" stroke="#000" stroke-width="3" ${n.optional ? 'stroke-dasharray="6 4"' : ''}/><g transform="translate(-9.1,-9.1) scale(1.3)">${ICON.type[n.card.type] || ''}</g>`;
            } else {
                const s = optState(nd.choice, nd.opt), sl = slotOf(P, nd.choice.id, nd.opt);
                if (sl) {       // an option holding a card: the card's own node, with the option's number badge
                    const st = status(P, sl);
                    if (sl.id === W.selected) ring += `<circle r="${R + 3}" fill="none" stroke="#c9a227" stroke-width="3"/>`;
                    body = `<circle r="${R}" fill="${FILL[st]}" stroke="${OPT_COLORS[nd.opt % OPT_COLORS.length]}" stroke-width="3" ${sl.optional ? 'stroke-dasharray="6 4"' : ''}/>
                        <circle r="${R + 1.5}" fill="none" stroke="#000" stroke-width="1"/>
                        <g transform="translate(-9.1,-9.1) scale(1.3)">${ICON.type[sl.card.type] || ''}</g>
                        <g transform="translate(${R * 0.78},${-R * 0.78})"><circle r="8" fill="${OPT_TAG[nd.opt % OPT_TAG.length]}" stroke="#000" stroke-width="2"/><text y="3.6" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">${nd.opt + 1}</text></g>`;
                    boxes += `<g data-id="${nd.key}" style="cursor:pointer" transform="translate(${q.x},${q.y})">${ring}${body}</g>`;
                    return;
                }
                if (nd.key === W.selOpt) ring += `<circle r="${R + 3}" fill="none" stroke="#c9a227" stroke-width="3"/>`;
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
        if (!anchor && W.gridAnchor && !opts.center) anchor = W.gridAnchor;
        W.gridAnchor = null;
        if (!anchor) anchor = { x: (bx0 + bx1) / 2, y: (by0 + by1) / 2 };
        mapEl.scrollLeft = (anchor.x - ox) * z - vw / 2;
        mapEl.scrollTop = (anchor.y - oy) * z - vh / 2;
        W.gridView = { z, ox, oy };
        zoomBtn();
    }
    const TOOLS = { select: 'SELECT', add: 'ADD', link: 'LINK', cut: 'CUT', delete: 'DELETE' };
    function drawGridUI() {
        const P = W.P, b = W.el.querySelector('.gp-build');
        const hint = {
            select: 'Tap a node to edit · drag it to move · drag empty space to pan',
            link: W.linkFrom ? `Now tap the card that comes after “${esc(W.linkOpt === null ? title(byId(P, W.linkFrom)) : (options(byId(P, W.linkFrom))[W.linkOpt] || ''))}”` : 'Tap a card or a choice’s numbered option, then the card after it',
            cut: 'Tap a line to remove it',
            delete: 'Tap a node to delete it'
        };
        // second card under the tools: the hint, or in ADD the card types split into equal parts
        const addTypes = NODE_TYPES.filter(t => typeDef(t)).map(t => [t, TYPE_NAME[t]]).concat([['optional', 'OPTIONAL']]);
        const sub = W.tool === 'add'
            ? `<div class="gp-seg gp-types2">${addTypes.map(([t, nm]) => `<div class="${t === W.addType ? 'on' : ''}" data-addtype="${t}">${nm}</div>`).join('')}</div>`
            : `<div class="gp-seg gp-info"><div>${hint[W.tool]}</div></div>`;
        b.querySelector('.gp-tools').innerHTML = `<div class="gp-seg">${Object.keys(TOOLS).map(k => `<div class="${k === W.tool ? 'on' : ''}" data-tool="${k}">${TOOLS[k]}</div>`).join('')}<div class="act" data-tool="tidy">TIDY</div></div>${sub}`;
        drawMap();      // after the tool bar is in, so the map knows its real height
        syncUndo();
        const sheet = b.querySelector('.gp-sheet');
        sheet.innerHTML = '';
        const n = W.selected && (W.tool === 'select' || W.tool === 'add') ? byId(P, W.selected) : null;
        const os = !n && W.selOpt && W.tool === 'select' ? optionSheet(W.selOpt) : null;
        if (n) sheet.appendChild(nodeBlock(n, true));
        if (os) sheet.appendChild(os);
        sheet.classList.toggle('on', !!(n || os));
    }
    // A dropped node snaps to the grid; if that spot is too close to another node it glides to the nearest free spot
    function settleNode(key) {
        const P = W.P, q = P.gridLayout[key], from = { x: q.x, y: q.y };
        let to = { x: snapG(q.x), y: snapG(q.y) };
        const pos = gridPositions(P);
        if (tooClose(to, pos, key)) {
            const cands = [];
            for (let i = -12; i <= 12; i++) for (let j = -12; j <= 12; j++) cands.push({ x: to.x + i * SNAP, y: to.y + j * SNAP });
            cands.sort((a, b) => Math.hypot(a.x - from.x, a.y - from.y) - Math.hypot(b.x - from.x, b.y - from.y));
            to = cands.find(c => !tooClose(c, pos, key)) || to;
        }
        const t0 = performance.now(), dur = Math.min(220, 90 + Math.hypot(to.x - from.x, to.y - from.y) * 1.2);
        const step = now => {
            if (!W || !P.gridLayout || !P.gridLayout[key]) return;
            const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
            P.gridLayout[key] = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
            drawMap({ noScroll: true });
            if (k < 1) requestAnimationFrame(step); else { P.gridLayout[key] = to; save(); drawMap({ noScroll: true }); }
        };
        requestAnimationFrame(step);
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
                if (p.key && W.tool === 'select') settleNode(p.key);
                return;
            }
            W.sheetGuard = Date.now();
            gridTap(p, e);
        });
        mapEl.addEventListener('pointercancel', () => { ptr = null; });
    }
    function deleteOption(key) {
        const P = W.P, [cid, oi] = key.split('#'), c = byId(P, cid), i = +oi, items = c.card.state.items;
        if (items.length < 2) { toast('A choice needs at least one option'); return; }
        const sl = slotOf(P, cid, i); if (sl) removeNode(P, sl.id);
        items.splice(i, 1);
        const s = c.card.state.selectedIndex;
        if (s === i) c.card.state.selectedIndex = null; else if (s > i) c.card.state.selectedIndex = s - 1;
        P.nodes.forEach(n => n.after = n.after.filter(l => !(l.id === cid && l.opt === i)).map(l => (l.id === cid && l.opt > i) ? { id: l.id, opt: l.opt - 1 } : l));
        if (P.gridLayout) {
            const L = P.gridLayout;
            Object.keys(L).filter(k => k.startsWith(cid + '#')).map(k => +k.split('#')[1]).sort((a, b) => a - b)
                .forEach(j => { if (j === i) delete L[cid + '#' + j]; else if (j > i) { L[cid + '#' + (j - 1)] = L[cid + '#' + j]; delete L[cid + '#' + j]; } });
        }
        W.selOpt = null; save(); drawGridUI();
    }
    // nearest spot on the grid to `want` that isn't too close to another node
    function freeSpot(pos, want) {
        const base = { x: snapG(want.x), y: snapG(want.y) };
        if (!tooClose(base, pos)) return base;
        const c = [];
        for (let i = -10; i <= 10; i++) for (let j = -10; j <= 10; j++) c.push({ x: base.x + i * SNAP, y: base.y + j * SNAP });
        c.sort((a, b) => Math.hypot(a.x - want.x, a.y - want.y) - Math.hypot(b.x - want.x, b.y - want.y));
        return c.find(q => !tooClose(q, pos)) || base;
    }
    function addAfterOption(key, type) {
        const P = W.P, [cid, oi] = key.split('#');
        snapshotGrid(P);
        const from = gridPositions(P)[key] || { x: 0, y: 0 };
        const n = type === 'optional' ? addNode(P, 'list', { optional: true, after: [{ id: cid, opt: +oi }] }) : addNode(P, type, { after: [{ id: cid, opt: +oi }] });
        if (type === 'threshold') { n.card.state.number1 = 1; }
        if (type === 'checklist') n.card.state.items = [{ text: '', completed: false }, { text: '', completed: false }];
        P.gridLayout[n.id] = freeSpot(gridPositions(P), { x: from.x + COLW, y: from.y });
        W.selOpt = null; W.selected = n.id; W.afterOpen = false;
        save(); drawGridUI();
    }
    function optionSheet(key) {
        const P = W.P, [cid, oi] = key.split('#'), c = byId(P, cid), i = +oi;
        if (!c || !options(c)[i] === undefined) return null;
        const el = document.createElement('div');
        el.className = 'gp-node sel gp-optsheet';
        const after = P.nodes.filter(n => n.after.some(l => l.id === cid && l.opt === i));
        el.innerHTML = `<div class="gp-bn" data-go="close"><div class="gp-ico gp-optnum" style="background:${OPT_TAG[i % OPT_TAG.length]}">${i + 1}</div>
                <div class="gp-nm"><span>Option ${i + 1} · ${esc(title(c))}</span></div><div class="gp-x">×</div></div>
            <div class="gp-ed">
                <div class="gp-lbl">OPTION CARD</div>
                <div class="gp-types">${['list', 'checklist', 'progress', 'radio'].filter(t => typeDef(t)).map(t => `<div class="${t === 'list' ? 'on' : ''}" data-go="type" data-t="${t}">${t === 'radio' ? 'CHOICE' : TYPE_NAME[t]}</div>`).join('')}</div>
                <div class="gp-lbl">OPTION</div>
                <div class="gp-optrow"><input class="gp-optin" value="${esc(options(c)[i] || '')}" placeholder="Option ${i + 1}"></div>
                <div class="gp-hint">Ticking this option picks it and closes the others. Give it a card type to make doing that card the pick.</div>
                <div class="gp-lbl">LEADS TO</div>
                ${after.length ? after.map(n => `<div class="gp-row" data-go="pick" data-id="${n.id}"><div class="gp-sq">${ICON.type[n.card.type] ? ICON.type[n.card.type].replace(/#fff/g, '#000') : ''}</div><div class="gp-rn"><span>${esc(title(n))}</span></div></div>`).join('')
                    : '<div class="gp-hint">Nothing yet. Picking this option leads nowhere.</div>'}
                <div class="gp-btns"><div class="gp-btn green" data-go="add" style="flex:1">+ ADD CARD AFTER THIS OPTION</div></div>
                <div class="gp-btns"><div class="gp-btn" data-go="link" style="flex:1">LINK A CARD AFTER IT</div><div class="gp-btn red" data-go="del">DELETE OPTION</div></div>
            </div>`;
        el.querySelector('.gp-optin').addEventListener('input', e => { c.card.state.items[i].text = e.target.value; });
        el.querySelector('.gp-optin').addEventListener('change', () => save());
        el.addEventListener('click', e => {
            const t = e.target.closest('[data-go]'); if (!t) return;
            const a = t.dataset.go;
            if (a === 'close') { W.selOpt = null; return drawGridUI(); }
            if (a === 'pick') { W.selOpt = null; W.selected = t.dataset.id; return drawGridUI(); }
            if (a === 'add') return addAfterOption(key, 'list');
            if (a === 'link') { W.selOpt = null; W.tool = 'link'; W.linkFrom = cid; W.linkOpt = i; return drawGridUI(); }
            if (a === 'del') return deleteOption(key);
            if (a === 'type' && t.dataset.t !== 'list') {
                const n = addNode(P, t.dataset.t, { slot: true, after: [{ id: cid, opt: i }] });
                n.card.state.title = options(c)[i] || '';
                if (t.dataset.t === 'checklist') n.card.state.items = [{ text: '', completed: false }, { text: '', completed: false }];
                if (t.dataset.t === 'radio') n.card.state.items = [{ text: '' }, { text: '' }];
                W.selOpt = null; W.selected = n.id; save(); return drawGridUI();
            }
        });
        return el;
    }
    function gridTap(p, e) {
        const P = W.P, svg = W.el.querySelector('.gp-mapin svg'); if (!svg) return;
        const r = svg.getBoundingClientRect();
        const x = (e.clientX - r.left) / W.curZ + W.gridView.ox, y = (e.clientY - r.top) / W.curZ + W.gridView.oy;
        if (p.dot && W.tool === 'delete') { deleteOption(p.dot); return; }   // deleting an option node removes that option from its choice
        if (p.dot && W.tool === 'link' && W.linkFrom) { toast('Options come from their choice'); return; }
        // SELECT on an option: its own sheet (add a card after it, link one, rename, delete)
        if (p.dot && W.tool === 'select') {
            const [cid, oi] = p.dot.split('#'), sl = slotOf(P, cid, +oi);
            if (sl) { W.selOpt = null; W.selected = sl.id; W.afterOpen = false; } else { W.selected = null; W.selOpt = p.dot; }
            return drawGridUI();
        }
        // ADD on an option: the new card comes straight after that option
        if (p.dot && W.tool === 'add') { addAfterOption(p.dot, W.addType); return; }
        if (p.dot && W.tool !== 'link') p.id = p.dot.split('#')[0];
        switch (W.tool) {
            case 'select': W.selected = p.id || null; W.selOpt = null; W.afterOpen = false; break;
            case 'add': {
                if (p.id) { W.selected = p.id; break; }
                const spot = { x: snapG(x), y: snapG(y) };
                snapshotGrid(P);
                if (tooClose(spot, gridPositions(P))) { toast('Too close to another node'); return; }
                const n = W.addType === 'optional' ? addNode(P, 'list', { optional: true }) : addNode(P, W.addType);
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
        countedCards: function(state) { syncGates(state); return counted(state).map(n => n.card); },
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
