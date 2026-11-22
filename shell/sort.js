(function() {
    // ===== SORT / FILTER / SEARCH (app shell) =====
    // The bar in header row 2, the Sort and Filter page, and the logic that
    // orders the cards. Card types feed it through their registry info().
    window.GT50 = window.GT50 || {};

    const FILTERS = [
        { id: 'all',  name: 'All',         desc: 'Everything on this tab' },
        { id: 'open', name: 'In progress', desc: 'Not finished yet' },
        { id: 'done', name: 'Completed',   desc: 'Finished only' }
    ];
    const SORTS = [
        { id: 'manual',  name: 'Manual order', desc: 'The order you built them in', rdesc: 'Reversed' },
        { id: 'title',   name: 'Title',        desc: 'A to Z',                      rdesc: 'Z to A' },
        { id: 'added',   name: 'Date added',   desc: 'Oldest first',                rdesc: 'Newest first' },
        { id: 'updated', name: 'Last updated', desc: 'Least recent first',          rdesc: 'Most recent first' }
    ];

    const SEARCH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3.4" stroke-linecap="round"><circle cx="10" cy="10" r="6.5"/><path d="M15 15l6 6"/></svg>';
    const CLOSE_ICON  = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    const DIR_ICON    = '<svg viewBox="0 0 40 40"><polygon points="10.4,11 29.6,11 20,27.6" fill="#000" stroke="#000" stroke-width="5" stroke-linejoin="round"/></svg>';

    const css = `
        .gt-sort {
            position: relative; height: 21px; padding: 0 27px; line-height: 15px;
            display: flex; align-items: center; justify-content: center; gap: 5px;
            background: var(--color-10); color: #000;
            border: var(--border-width) solid var(--border-color); border-radius: 8px;
            font: 700 min(.74rem, 2.95vw) Arial, sans-serif; text-transform: uppercase;
            white-space: nowrap; overflow: hidden; cursor: pointer; user-select: none;
        }
        .gt-sort .k { color: #8a8378; }
        .gt-sort .v { overflow: hidden; text-overflow: ellipsis; }
        .gt-sort .s, .gt-sort .x {
            position: absolute; top: 0; bottom: 0; width: 24px;
            display: flex; align-items: center; justify-content: center;
        }
        .gt-sort .s { left: 0; border-right: var(--border-width) solid var(--border-color); }
        .gt-sort .s:active { background: var(--bg-4); }
        .gt-sort .x { right: 0; border-left: var(--border-width) solid var(--border-color); background: var(--color-1); display: none; }
        .gt-sort .s svg, .gt-sort .x svg { width: 12px; height: 12px; display: block; }
        .gt-sort input {
            position: absolute; left: 24px; right: 24px; top: 0; bottom: 0; width: auto;
            display: none; margin: 0; padding: 0 8px; border: 0; outline: 0; background: transparent;
            font: inherit; text-transform: uppercase; color: #000; -webkit-appearance: none;
        }
        .gt-sort .dir { flex: none; width: 11px; height: 11px; }
        .gt-sort .dir svg { width: 100%; height: 100%; display: block; overflow: visible; transform: rotate(180deg); transition: transform .3s; }
        .gt-sort .dir.desc svg { transform: none; }
        .gt-sort.searching { cursor: text; }
        .gt-sort.searching .k, .gt-sort.searching .v, .gt-sort.searching .dir { visibility: hidden; }
        .gt-sort.searching .s { background: #000; }
        .gt-sort.searching .s svg { stroke: #fff; }
        .gt-sort.searching .x { display: flex; }
        .gt-sort.searching input { display: block; }

        .gt-sp {
            position: fixed; inset: 0; z-index: 2000;
            background: var(--bg-1); display: flex; flex-direction: column; overflow-y: auto;
        }
        .gt-sp-head {
            flex: none; display: flex; height: var(--card-height);
            background: var(--bg-3); border-bottom: var(--border-width) solid var(--border-color);
            position: sticky; top: 0; z-index: 1;
        }
        .gt-sp-head button {
            width: 90px; border: 0; border-right: var(--border-width) solid var(--border-color);
            background: var(--bg-4); color: var(--font-color-3);
            font: 600 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; cursor: pointer;
        }
        .gt-sp-head h2 {
            flex: 1; display: flex; align-items: center; justify-content: center; padding-right: 90px;
            color: var(--color-10); font-size: 14px; font-weight: 600;
        }
        .gt-sp-body { padding: 4px; display: flex; flex-direction: column; gap: 4px; }
        .gt-div {
            display: flex; align-items: center; gap: 8px; margin: 6px 0 2px;
            color: var(--bg-2); font: 700 12px Arial, sans-serif; text-transform: uppercase;
        }
        .gt-div::before, .gt-div::after { content: ''; flex: 1; height: var(--border-width); background: var(--border-color); }
        .gt-opt {
            position: relative; min-height: var(--card-height); padding: 6px 40px 6px 12px;
            display: flex; flex-direction: column; justify-content: center; gap: 2px; text-align: left;
            background: var(--bg-2); color: var(--color-10);
            border: var(--border-width) solid var(--border-color); border-radius: 8px; cursor: pointer;
            font-family: inherit;
        }
        .gt-opt b { font-size: 14px; font-weight: 700; }
        .gt-opt span { font-size: 11px; color: var(--font-color-2); }
        .gt-opt.on { background: var(--color-5); }
        .gt-opt.on span { color: var(--color-10); }
        .gt-opt .dir { position: absolute; right: 12px; top: 50%; width: 14px; height: 14px; margin-top: -7px; display: none; }
        .gt-opt.on .dir { display: block; }
        .gt-opt .dir svg { width: 100%; height: 100%; display: block; transform: rotate(180deg); transition: transform .3s; }
        .gt-opt .dir svg polygon { fill: #fff; stroke: #fff; }
        .gt-opt.desc .dir svg { transform: none; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    const findIn = (list, id) => list.find(x => x.id === id) || list[0];

    window.GT50.Sort = {
        FILTERS: FILTERS,
        SORTS: SORTS,

        defaultState: function() {
            return { filter: 'all', by: 'manual', desc: false };
        },

        // cards: [{ id, type, state, added, updated }]
        // info(card) -> { title, done, text }
        apply: function(cards, sort, query, info) {
            const q = (query || '').trim().toLowerCase();
            let out = cards.map((card, index) => ({ card, index, meta: info(card) }));

            if (sort.filter === 'open') out = out.filter(x => !x.meta.done);
            if (sort.filter === 'done') out = out.filter(x => x.meta.done);
            if (q) out = out.filter(x => (x.meta.text || '').toLowerCase().includes(q));

            const by = sort.by;
            out.sort((a, b) => {
                let d = 0;
                if (by === 'title') d = (a.meta.title || '').localeCompare(b.meta.title || '', undefined, { sensitivity: 'base' });
                else if (by === 'added') d = (a.card.added || a.card.id || 0) - (b.card.added || b.card.id || 0);
                else if (by === 'updated') d = (a.card.lastUpdated || a.card.updated || 0) - (b.card.lastUpdated || b.card.updated || 0);
                if (d === 0) d = a.index - b.index;
                return sort.desc ? -d : d;
            });
            return out.map(x => x.card);
        },

        // The bar in header row 2
        // opts: { sort, query, searching, onOpenPage, onSearchOpen, onSearch(q), onSearchClose }
        renderBar: function(slot, opts) {
            const esc = window.GT50.escapeHTML;
            const f = findIn(FILTERS, opts.sort.filter);
            const s = findIn(SORTS, opts.sort.by);

            slot.innerHTML = `
                <div class="gt-sort ${opts.searching ? 'searching' : ''}" role="button" aria-label="Sort and filter">
                    <span class="s" aria-label="Search">${SEARCH_ICON}</span>
                    <input type="text" value="${esc(opts.query || '')}" aria-label="Search"
                        autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="search">
                    <span class="x" aria-label="Close search">${CLOSE_ICON}</span>
                    <span class="k">Filter by:</span><span class="v">${esc(f.name)}</span>
                    <span class="k">• Sort by:</span>
                    <i class="dir ${opts.sort.desc ? 'desc' : ''}" aria-hidden="true">${DIR_ICON}</i>
                    <span class="v">${esc(s.name)}</span>
                </div>`;

            const bar = slot.querySelector('.gt-sort');
            const input = bar.querySelector('input');

            bar.onclick = () => {
                if (bar.classList.contains('searching')) { input.focus(); return; }
                opts.onOpenPage && opts.onOpenPage();
            };
            bar.querySelector('.s').onclick = (e) => {
                e.stopPropagation();
                bar.classList.add('searching');
                input.focus();
                opts.onSearchOpen && opts.onSearchOpen();
            };
            bar.querySelector('.x').onclick = (e) => {
                e.stopPropagation();
                bar.classList.remove('searching');
                input.value = '';
                input.blur();
                opts.onSearchClose && opts.onSearchClose();
            };
            input.oninput = () => opts.onSearch && opts.onSearch(input.value);
            input.onkeydown = (e) => { if (e.key === 'Enter') input.blur(); };

            if (opts.searching && opts.focus) {
                input.focus();
                const n = input.value.length;
                try { input.setSelectionRange(n, n); } catch (e) {}
            }
        },

        // The Sort and Filter page. Picking applies straight away; picking the
        // current sort again flips its direction. Back closes it.
        // opts: { sort, onChange(sort), onClose }
        openPage: function(opts) {
            const sort = Object.assign({}, opts.sort);
            const page = document.createElement('div');
            page.className = 'gt-sp';

            const draw = () => {
                page.innerHTML = `
                    <div class="gt-sp-head"><button type="button" data-action="back">BACK</button><h2>SORT AND FILTER</h2></div>
                    <div class="gt-sp-body">
                        <div class="gt-div">Filter</div>
                        ${FILTERS.map(f => `
                            <button type="button" class="gt-opt ${f.id === sort.filter ? 'on' : ''}" data-f="${f.id}">
                                <b>${f.name}</b><span>${f.desc}</span></button>`).join('')}
                        <div class="gt-div">Sort</div>
                        ${SORTS.map(s => `
                            <button type="button" class="gt-opt ${s.id === sort.by ? 'on' : ''} ${sort.desc ? 'desc' : ''}" data-s="${s.id}">
                                <b>${s.name}</b><span>${sort.desc && s.id === sort.by ? s.rdesc : s.desc}</span>
                                <i class="dir" aria-hidden="true">${DIR_ICON}</i></button>`).join('')}
                    </div>`;

                page.querySelector('[data-action="back"]').onclick = () => {
                    page.remove();
                    opts.onClose && opts.onClose();
                };
                page.querySelectorAll('[data-f]').forEach(b => b.onclick = () => {
                    sort.filter = b.dataset.f;
                    opts.onChange(Object.assign({}, sort));
                    draw();
                });
                page.querySelectorAll('[data-s]').forEach(b => b.onclick = () => {
                    if (sort.by === b.dataset.s) sort.desc = !sort.desc;
                    else sort.by = b.dataset.s;
                    opts.onChange(Object.assign({}, sort));
                    draw();
                });
            };

            draw();
            document.body.appendChild(page);
        }
    };
})();
