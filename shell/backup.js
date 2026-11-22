(function() {
    // ===== BACKUP (app shell) =====
    // Works the way Stack Tracker and Pod Tracer do:
    //  - A BACKUP tab in DATA: when you last backed up, when the next one is due,
    //    a Daily / Weekly (pick the day) / Never schedule, where backups go, and
    //    Back Up Now.
    //  - Where: a folder you pick once (where the browser allows it; kept for next
    //    time). Without one, Back Up Now hands the file to the share sheet (Save
    //    to Files / Drive / email), or downloads it.
    //  - With a folder, backups run by themselves the first time the app is
    //    opened once one is due, and the newest 10 are kept there. Without one,
    //    a reminder pops up when one is due (Later = ask again tomorrow).
    //  - Restore: the newest 3 backups in the folder are listed with what's in
    //    them; tapping one loads it into the IMPORT tab, ready to import.
    // Backups are the app's standard JSON export, so IMPORT reads them as usual.
    window.GT50 = window.GT50 || {};

    const APP = 'The Joystick Journal';
    const FILE_RE = /^joystick-journal-\d{4}-\d{2}-\d{2}\.json$/;
    const KEEP = 10;
    const PREFS_KEY = 'joystick-journal-backup';
    const DAY = 864e5;
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // ---------- preferences ----------
    const load = () => { try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; } catch (e) { return {}; } };
    const prefs = Object.assign({ every: 'week', day: 0, since: Date.now(), last: 0, snooze: 0, log: [] }, load());
    const savePrefs = () => { try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) {} };
    savePrefs();

    const sod = t => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
    const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const esc = s => (window.GT50.escapeHTML ? window.GT50.escapeHTML(s) : String(s));

    function dueAt() {
        if (prefs.every === 'never') return null;
        const d = new Date(prefs.last || prefs.since);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 1);
        if (prefs.every === 'week') while (d.getDay() !== prefs.day) d.setDate(d.getDate() + 1);
        return Math.max(d.getTime(), prefs.snooze || 0);
    }
    function markBackedUp() {
        prefs.last = Date.now();
        prefs.snooze = 0;
        const seen = new Set();
        prefs.log = [prefs.last].concat(prefs.log || []).sort((a, b) => b - a)
            .filter(t => { const k = sod(t); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 40);
        savePrefs();
    }

    // ---------- what a backup holds ----------
    function appState() { return window.state || null; }
    function hasData() {
        const s = appState();
        return !!(s && Array.isArray(s.tabComponents) && s.tabComponents.some(t => Array.isArray(t) && t.length));
    }
    function exportJSON() {
        const s = appState();
        const lib = window.GT50Lib && window.GT50Lib.ImpEx;
        const cleaned = lib && lib.cleanState ? lib.cleanState(s) : s;
        return JSON.stringify({
            version: '1.0',
            timestamp: new Date().toISOString(),
            app: APP,
            data: { tabs: cleaned.tabs, tabComponents: cleaned.tabComponents }
        }, null, 2);
    }
    function summary(txt) {
        const data = JSON.parse(txt).data || {};
        let trackers = 0, cards = 0;
        const walk = (tabComponents, top) => (tabComponents || []).forEach(list => (list || []).forEach(c => {
            if (c.type === 'nest' || c.type === 'cycle') {
                if (top) trackers++;
                walk(c.state && c.state.tabComponents, false);
            } else cards++;
        }));
        walk(data.tabComponents, true);
        return { trackers, cards };
    }

    // ---------- the backup folder (kept in IndexedDB for next time) ----------
    const FS_OK = typeof window.showDirectoryPicker === 'function';
    const db = () => new Promise((res, rej) => {
        const r = indexedDB.open('joystick-journal-fs', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('kv');
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
    });
    const kvGet = async k => { const d = await db(); return new Promise((res, rej) => { const q = d.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); };
    const kvPut = async (k, v) => { const d = await db(); return new Promise((res, rej) => { const t = d.transaction('kv', 'readwrite'); v === undefined ? t.objectStore('kv').delete(k) : t.objectStore('kv').put(v, k); t.oncomplete = () => res(); t.onerror = () => rej(t.error); }); };

    let dir = null;
    let ready = Promise.resolve();
    try { if (FS_OK) ready = kvGet('backupDir').then(h => { dir = h || null; }).catch(() => {}); } catch (e) {}

    async function toFolder(name, json) {
        if (!dir) return false;
        try {
            let perm = await dir.queryPermission({ mode: 'readwrite' });
            if (perm !== 'granted') perm = await dir.requestPermission({ mode: 'readwrite' });
            if (perm !== 'granted') return false;
            const fh = await dir.getFileHandle(name, { create: true });
            const w = await fh.createWritable();
            await w.write(new Blob([json], { type: 'application/json' }));
            await w.close();
            try {   // keep the newest 10 (only the app's own dated backup files are touched)
                const ours = [];
                for await (const [n, e] of dir.entries()) if (e.kind === 'file' && FILE_RE.test(n)) ours.push(n);
                ours.sort().reverse().slice(KEEP).forEach(n => dir.removeEntry(n).catch(() => {}));
            } catch (e) {}
            return true;
        } catch (e) { return false; }
    }

    // ---------- back up now: folder, else share sheet, else download ----------
    async function backupNow() {
        const name = `joystick-journal-${todayKey()}.json`, json = exportJSON();
        if (await toFolder(name, json)) { markBackedUp(); return 'Saved to folder'; }
        try {
            const file = new File([json], name, { type: 'application/json' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: APP + ' backup' });
                markBackedUp(); return 'Saved';
            }
        } catch (err) {
            if (err && err.name === 'AbortError') return null;   // share sheet closed
        }
        try {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
            a.download = name;
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(a.href), 4000);
            markBackedUp(); return 'Downloaded';
        } catch (e) { return 'Use Export → Copy'; }
    }

    // ---------- automatic backup + reminder ----------
    async function autoBackup() {
        await ready;
        const due = dueAt();
        if (!dir || !hasData() || due === null || Date.now() < due) return false;
        try { if (await dir.queryPermission({ mode: 'readwrite' }) !== 'granted') return false; } catch (e) { return false; }
        if (!(await toFolder(`joystick-journal-${todayKey()}.json`, exportJSON()))) return false;
        markBackedUp();
        closeReminder();
        return true;
    }

    const css = `
        .jj-bk { display: flex; flex-direction: column; gap: var(--margin); padding-bottom: calc(var(--card-height) + 8px); }
        .jj-div { display: flex; align-items: center; gap: 8px; margin: 6px 0 2px; color: var(--bg-2);
            font: 700 12px Arial, sans-serif; text-transform: uppercase; letter-spacing: .5px; }
        .jj-div::before, .jj-div::after { content: ''; flex: 1; height: var(--border-width); background: var(--border-color); }
        .jj-card { display: flex; min-height: var(--card-height); background: var(--bg-2); color: var(--color-10);
            border: var(--border-width) solid var(--border-color); border-radius: 8px; overflow: hidden; }
        .jj-half { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 6px; }
        .jj-half + .jj-half { border-left: var(--border-width) solid var(--border-color); }
        .jj-half small { font: 700 10px Arial, sans-serif; text-transform: uppercase; opacity: .7; letter-spacing: .5px; }
        .jj-half b { font-size: 16px; }
        .jj-seg { display: flex; height: var(--card-height); border: var(--border-width) solid var(--border-color); border-radius: 8px; overflow: hidden; }
        .jj-seg button { flex: 1 1 0; min-width: 0; border: 0; background: var(--bg-4); color: var(--color-10);
            font: 700 13px Arial, sans-serif; text-transform: uppercase; cursor: pointer; display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 3px; }
        .jj-seg button + button { border-left: var(--border-width) solid var(--border-color); }
        .jj-seg button.on { background: var(--color-4); }
        .jj-days { display: flex; gap: 2px; }
        .jj-days i { font: 700 10px Arial, sans-serif; font-style: normal; width: 14px; height: 14px; line-height: 14px; border-radius: 3px; text-align: center; opacity: .55; }
        .jj-days i.on { background: var(--color-10); color: var(--color-4); opacity: 1; }
        .jj-loc { display: flex; height: var(--card-height); border: var(--border-width) solid var(--border-color); border-radius: 8px; overflow: hidden; }
        .jj-loc button { border: 0; cursor: pointer; color: var(--color-10); font-family: inherit; }
        .jj-loc .pick { flex: 1; min-width: 0; background: var(--bg-2); text-align: left; padding: 0 12px; display: flex; flex-direction: column; justify-content: center; }
        .jj-loc .pick small { font: 700 10px Arial, sans-serif; text-transform: uppercase; opacity: .7; }
        .jj-loc .pick span { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .jj-loc .clear { width: 45px; background: var(--color-1); border-left: var(--border-width) solid var(--border-color); font-size: 18px; font-weight: 700; }
        .jj-how { text-align: center; color: var(--bg-2); font-size: 12px; line-height: 1.4; padding: 2px 8px; }
        .jj-rs { display: flex; width: 100%; min-height: var(--card-height); padding: 0; background: var(--bg-2); color: var(--color-10); text-align: left;
            border: var(--border-width) solid var(--border-color); border-radius: 8px; overflow: hidden; cursor: pointer; font-family: inherit; }
        .jj-rs.on { background: var(--color-5); }
        .jj-rs span { flex: 1 1 0; min-width: 0; padding: 6px 8px; display: flex; flex-direction: column; justify-content: center; font-size: 12px; }
        .jj-rs span + span { border-left: var(--border-width) solid var(--border-color); }
        .jj-rs b { font-size: 13px; }
        .jj-empty { text-align: center; color: var(--font-color-2); font-size: 12px; font-weight: 700; padding: 8px; }
        .jj-now { position: fixed; left: 0; right: 0; bottom: 0; z-index: 1000; display: flex; height: var(--card-height);
            background: var(--bg-3); border-top: var(--border-width) solid var(--border-color); }
        .jj-now button { flex: 1; border: 0; background: var(--color-4); color: var(--color-10); font: 600 14px inherit; cursor: pointer; }

        #jj-remind { position: fixed; inset: 0; z-index: 5000; display: flex; align-items: center; justify-content: center;
            background: rgba(43,38,32,.45); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); padding: 16px; }
        #jj-remind .box { width: 100%; max-width: 360px; background: var(--bg-1); border: var(--border-width) solid var(--border-color); border-radius: 8px; overflow: hidden; }
        #jj-remind h3 { background: var(--bg-3); color: var(--color-10); text-align: center; font-size: 15px; padding: 12px; border-bottom: var(--border-width) solid var(--border-color); }
        #jj-remind p { color: var(--bg-2); padding: 16px 14px; text-align: center; font-size: 14px; line-height: 1.4; }
        #jj-remind .row { display: flex; border-top: var(--border-width) solid var(--border-color); height: var(--card-height); }
        #jj-remind .row button { flex: 1; border: 0; color: var(--color-10); font: 600 14px inherit; cursor: pointer; }
        #jj-remind .row .later { background: var(--bg-4); border-right: var(--border-width) solid var(--border-color); }
        #jj-remind .row .go { background: var(--color-4); }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    function closeReminder() {
        const m = document.getElementById('jj-remind');
        if (m) m.remove();
    }
    function checkReminder() {
        const due = dueAt();
        if (due === null || !hasData() || Date.now() < due || document.getElementById('jj-remind')) return;
        const days = prefs.last ? Math.floor((Date.now() - prefs.last) / DAY) : null;
        const m = document.createElement('div');
        m.id = 'jj-remind';
        m.innerHTML = `<div class="box">
            <h3>TIME TO BACK UP</h3>
            <p>${days === null ? "You haven't backed up your journal yet. Save a copy so your trackers are safe."
                : `It's been ${days === 0 ? 'less than a day' : days === 1 ? '1 day' : days + ' days'} since your last backup.`}</p>
            <div class="row"><button type="button" class="later">LATER</button><button type="button" class="go">BACK UP</button></div>
        </div>`;
        document.body.appendChild(m);
        m.querySelector('.later').onclick = () => {
            const t = new Date(); t.setHours(0, 0, 0, 0); t.setDate(t.getDate() + 1);
            prefs.snooze = t.getTime(); savePrefs(); closeReminder(); repaint();
        };
        m.querySelector('.go').onclick = async () => {
            const r = await backupNow();
            if (r) { closeReminder(); repaint(); }
        };
    }
    const autoThenRemind = async () => { try { await autoBackup(); } catch (e) {} checkReminder(); repaint(); };
    setTimeout(autoThenRemind, 1500);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') setTimeout(autoThenRemind, 600); });

    // ---------- the BACKUP tab ----------
    let lastContainer = null;
    function repaint() { if (lastContainer && lastContainer.isConnected) window.GT50.Backup.renderTab(lastContainer); }

    window.GT50.Backup = {
        backupNow, exportJSON, dueAt, prefs,

        renderTab: function(container) {
            lastContainer = container;
            const today = sod(Date.now());
            const ago = prefs.last ? Math.round((today - sod(prefs.last)) / DAY) : null;
            const lastTxt = ago === null ? 'Never' : ago <= 0 ? 'Today' : ago === 1 ? 'Yesterday' : ago + ' days ago';
            const due = dueAt();
            const nextTxt = due === null ? 'Off' : due <= Date.now() ? 'Now' : new Date(due).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            const locTxt = dir ? dir.name : (FS_OK ? 'Share sheet or Downloads · tap to pick a folder' : 'Share sheet or Downloads');
            const day = DAYS[prefs.day];
            const [howA, howB] = prefs.every === 'never' ? ['Backups are switched off.', 'Turn them on above, or back up by hand below.']
                : dir ? [prefs.every === 'day' ? 'Backups run daily.' : `Backups run every ${day}.`, 'Tap one of your last 3 below to restore it.']
                : [prefs.every === 'day' ? "You'll be reminded to back up daily." : `You'll be reminded to back up every ${day}.`, 'Pick a backup folder to back up by itself and restore from here.'];

            container.innerHTML = `
                <div class="jj-bk">
                    <div class="jj-card">
                        <div class="jj-half"><small>Last backup</small><b>${lastTxt}</b></div>
                        <div class="jj-half"><small>Next backup</small><b>${nextTxt}</b></div>
                    </div>
                    <div class="jj-div">Schedule</div>
                    <div class="jj-seg">
                        <button type="button" data-every="day" class="${prefs.every === 'day' ? 'on' : ''}">Daily</button>
                        <button type="button" data-every="week" class="${prefs.every === 'week' ? 'on' : ''}"><span>Weekly</span>
                            ${prefs.every === 'week' ? `<span class="jj-days">${'SMTWTFS'.split('').map((l, i) => `<i data-wd="${i}" class="${i === prefs.day ? 'on' : ''}">${l}</i>`).join('')}</span>` : ''}</button>
                        <button type="button" data-every="never" class="${prefs.every === 'never' ? 'on' : ''}">Never</button>
                    </div>
                    <div class="jj-div">Backup folder</div>
                    <div class="jj-loc">
                        <button type="button" class="pick"><small>Save backups to</small><span>${esc(locTxt)}</span></button>
                        ${dir ? '<button type="button" class="clear" aria-label="Forget folder">×</button>' : ''}
                    </div>
                    <div class="jj-how"><div>${howA}</div><div>${howB}</div></div>
                    <div class="jj-div">Restore</div>
                    <div class="jj-restore"><div class="jj-empty">${dir ? 'Looking for backups…' : 'Pick a backup folder to see your backups here'}</div></div>
                </div>
                <div class="jj-now"><button type="button">BACK UP NOW</button></div>`;

            container.querySelectorAll('[data-every]').forEach(b => b.onclick = (e) => {
                const wd = e.target.closest('[data-wd]');
                if (wd && prefs.every === 'week') prefs.day = +wd.dataset.wd;
                prefs.every = b.dataset.every;
                prefs.snooze = 0;
                savePrefs(); repaint();
            });
            container.querySelector('.jj-loc .pick').onclick = async () => {
                if (!FS_OK) { flash(container.querySelector('.jj-loc .pick span'), "This browser can't save to a chosen folder"); return; }
                try {
                    dir = await window.showDirectoryPicker({ id: 'joystick-journal-backups', mode: 'readwrite' });
                    await kvPut('backupDir', dir); repaint();
                } catch (err) {
                    if (!err || err.name !== 'AbortError') flash(container.querySelector('.jj-loc .pick span'), "Couldn't use that folder");
                }
            };
            const clear = container.querySelector('.jj-loc .clear');
            if (clear) clear.onclick = async () => { dir = null; try { await kvPut('backupDir', undefined); } catch (e) {} repaint(); };
            const nowBtn = container.querySelector('.jj-now button');
            nowBtn.onclick = async () => {
                nowBtn.textContent = 'BACKING UP…';
                const r = await backupNow();
                if (r) { closeReminder(); repaint(); const b = container.querySelector('.jj-now button'); if (b) { b.textContent = r.toUpperCase(); setTimeout(() => { if (b.isConnected) b.textContent = 'BACK UP NOW'; }, 1800); } }
                else nowBtn.textContent = 'BACK UP NOW';
            };
            this.paintRestore(container.querySelector('.jj-restore'));
        },

        paintRestore: async function(box) {
            await ready;
            if (!dir || !box) return;
            let perm = 'denied';
            try { perm = await dir.queryPermission({ mode: 'read' }); } catch (e) {}
            if (perm !== 'granted') {
                box.innerHTML = `<button type="button" class="jj-rs"><span><b>Show backups</b>Tap to allow the ${esc(dir.name)} folder</span></button>`;
                box.firstChild.onclick = async () => { try { if (await dir.requestPermission({ mode: 'readwrite' }) === 'granted') this.paintRestore(box); } catch (e) {} };
                return;
            }
            const files = [];
            try { for await (const [n, e] of dir.entries()) if (e.kind === 'file' && FILE_RE.test(n)) files.push([n, e]); } catch (e) { return; }
            files.sort((a, b) => a[0] < b[0] ? 1 : -1);
            box.innerHTML = files.length ? '' : '<div class="jj-empty">No backups in this folder yet</div>';
            for (const [n, e] of files.slice(0, 3)) {
                let txt, sum;
                try { txt = await (await e.getFile()).text(); sum = summary(txt); } catch (err) { continue; }
                const [, y, mo, d] = n.match(/(\d{4})-(\d{2})-(\d{2})/);
                const when = new Date(+y, +mo - 1, +d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                const c = document.createElement('button');
                c.type = 'button'; c.className = 'jj-rs';
                c.innerHTML = `<span>Backup date<b>${when}</b></span><span>Trackers<b>${sum.trackers}</b></span><span>Cards<b>${sum.cards}</b></span>`;
                c.onclick = () => window.GT50.Backup.restoreText(txt);
                box.appendChild(c);
            }
        },

        // open IMPORT with the backup filled in, ready to import
        restoreText: function(txt) {
            const s = appState();
            if (!s || !s.impex) return;
            s.impex.activeTab = 'import';
            s.impex.isOpen = true;
            if (window.render) window.render(true);
            const ta = document.getElementById('import-textarea');
            if (ta) { ta.value = txt; ta.dispatchEvent(new Event('input', { bubbles: true })); }
        }
    };

    function flash(el, msg) {
        if (!el) return;
        const old = el.textContent;
        el.textContent = msg;
        setTimeout(() => { if (el.isConnected) el.textContent = old; }, 2600);
    }
})();
