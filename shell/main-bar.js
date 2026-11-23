(function() {
    // ===== MAIN WINDOW BARS (Stack Tracker style) =====
    // Used only on the main window in view mode. Everywhere else the
    // original header, tabs and footer render as before.
    //   renderTop: three equal tab cards edge to edge: MAIN, DATA, SETTINGS
    //   renderAdd: footer ADD NEW card (tap = Create New window,
    //              swipe sideways = show/hide EDIT, like the original NEW button)
    window.GT50 = window.GT50 || {};

    const css = `
        /* Header band (Stack Tracker layout): tab cards sit inside the band,
           a black line under them, then row 2; a soft shadow below */
        #frozenHeader.gt-band { background: var(--bg-3); border-top: var(--border-width) solid var(--border-color); }
        .gt-top {
            display: flex; padding: 0 2px; background: var(--bg-3);
            border-bottom: var(--border-width) solid var(--border-color);
        }
        .gt-tab {
            position: relative; flex: 1 1 0; min-width: 0; height: 42px; padding: 0 4px;
            display: flex; align-items: center; justify-content: center;
            color: #000; background: transparent;
            font: 700 min(.74rem, 2.95vw) Arial, sans-serif; text-transform: uppercase;
            white-space: nowrap; cursor: pointer; user-select: none; -webkit-user-select: none;
        }
        /* the card itself: inset in the cell, black edge, rounded */
        .gt-tab::before {
            content: ''; position: absolute; inset: 4px 2px;
            border: 2.5px solid var(--border-color); border-radius: 6px;
            background: var(--color-10);
        }
        /* plain cards (no book texture); the picked one takes its own color, like Stack Tracker */
        .gt-tab.active { color: var(--color-10); }
        .gt-tab.active::before { background: var(--tab-color, var(--color-1)); }
        .gt-tab > span { position: relative; overflow: hidden; text-overflow: ellipsis; }
        /* Row 2 matches row 1 exactly: a 42px row plus its black line (45px in
           all), with the card inset 4px top and bottom, so both cards are the
           same height and the band spacing is the same above and below */
        .gt-row2 {
            position: relative; background: var(--bg-3); padding: 4px;
            height: calc(42px + var(--border-width));
            border-bottom: var(--border-width) solid var(--border-color);
        }
        .gt-row2 .gt-sort { height: 100%; border-width: 2.5px; border-radius: 6px; }
        /* the two rows are separate fixed bars; on phones their edges can round
           to different screen pixels and leave a hairline of page showing
           between them. Row 2 reaches 2px up under row 1's black line to close it. */
        #frozenTabs:has(> .gt-row2) { box-shadow: 0 -2px 0 var(--border-color); }
        .gt-row2::after, .gt-foot::before {
            content: ''; position: absolute; left: 0; right: 0; height: 14px; pointer-events: none;
        }
        .gt-row2::after { top: 100%; margin-top: 3px; background: linear-gradient(180deg, rgba(0,0,0,.32), rgba(0,0,0,.12) 40%, rgba(0,0,0,0)); }

        /* Footer band */
        .gt-foot {
            position: relative; background: var(--bg-3); border-top: var(--border-width) solid var(--border-color);
            padding: 4px; display: flex; gap: 4px;
        }
        .gt-foot::before { bottom: 100%; margin-bottom: 3px; background: linear-gradient(0deg, rgba(0,0,0,.32), rgba(0,0,0,.12) 40%, rgba(0,0,0,0)); }
        .gt-add, .gt-edit {
            position: relative; height: 45px; padding: 0 16px;
            display: flex; align-items: center; justify-content: center;
            border: var(--border-width) solid var(--border-color); border-radius: var(--card-radius);
            color: var(--color-10); cursor: pointer; user-select: none; -webkit-user-select: none;
            font: 700 min(1rem, 4vw)/1 Georgia, 'Times New Roman', serif; letter-spacing: .14em; text-transform: uppercase;
        }
        /* spine lines near each end, like Stack Tracker's book-cloth buttons */
        .gt-add::before, .gt-add::after {
            content: ''; position: absolute; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,.35);
        }
        .gt-add::before { left: 10px; } .gt-add::after { right: 10px; }
        .gt-add { flex: 1; background: var(--color-4); }
        .gt-edit { flex: 0 0 30%; background: var(--bg-4); }
        .gt-add:active, .gt-edit:active { filter: brightness(.92); }

        /* DATA / SETTINGS as tabs: the original windows sit under the tab strip
           (which stays on top) and their own back/title header is hidden */
        body.gt-tab-data #impexWindow,
        body.gt-tab-settings #settingsWindow { z-index: 1000 !important; }
        body.gt-tab-data #impex-header,
        body.gt-tab-settings #settings-header { display: none !important; }
        body.gt-tab-data #impex-tabs {
            top: calc(42px + var(--border-width) * 2) !important;
            box-shadow: 0 -2px 0 var(--border-color);   /* same hairline fix as the sort row */
        }
        body.gt-tab-data #impex-content { padding-top: calc(42px + var(--border-width) * 2 + var(--card-height) + var(--margin)) !important; }
        body.gt-tab-settings #settingsWindow { padding-top: calc(42px + var(--border-width) * 2 + 4px) !important; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    window.GT50.MainBar = {
        // Three tab cards, equal widths: MAIN, DATA, SETTINGS
        // opts: { active: 'main' | 'data' | 'settings', onTab(id) }
        renderTop: function(container, opts) {
            container.classList.add('gt-band');
            const tabs = [['main', 'MAIN', 'var(--color-1)'], ['data', 'DATA', '#8a6a3f'], ['settings', 'SETTINGS', '#2b5752']];
            container.innerHTML = `
                <div class="gt-top">
                    ${tabs.map(([id, label, color]) => `
                        <div class="gt-tab ${id === opts.active ? 'active' : ''}" data-tab="${id}" style="--tab-color:${color}"><span>${label}</span></div>`).join('')}
                </div>`;
            container.querySelectorAll('[data-tab]').forEach(el => {
                el.onclick = () => opts.onTab && opts.onTab(el.dataset.tab);
            });
        },

        // opts: { editVisible, onNew, onToggleEdit, onEdit }
        renderAdd: function(container, opts) {
            container.innerHTML = `
                <div class="gt-foot">
                    <div class="gt-add" role="button">+ Add New</div>
                    ${opts.editVisible ? '<div class="gt-edit" role="button">Edit</div>' : ''}
                </div>`;

            const add = container.querySelector('.gt-add');
            const edit = container.querySelector('.gt-edit');
            if (edit) edit.onclick = () => opts.onEdit && opts.onEdit();

            // Same gesture rules as the original NEW button:
            // tap opens Create New, a clear sideways swipe shows/hides EDIT
            let sx = 0, sy = 0, cx = 0, cy = 0, swipe = false, scroll = false, touched = false;
            add.addEventListener('touchstart', (e) => {
                touched = true;
                sx = cx = e.touches[0].clientX;
                sy = cy = e.touches[0].clientY;
                swipe = scroll = false;
            }, { passive: true });
            add.addEventListener('touchmove', (e) => {
                if (scroll) return;
                cx = e.touches[0].clientX;
                cy = e.touches[0].clientY;
                const dx = Math.abs(cx - sx), dy = Math.abs(cy - sy);
                if (dx > 5 || dy > 5) {
                    if (dy > dx * 0.3) scroll = true;
                    else if (dx > 30) { swipe = true; e.preventDefault(); }
                }
            });
            add.addEventListener('touchend', (e) => {
                if (scroll) { scroll = false; return; }
                const dx = Math.abs(cx - sx), dy = Math.abs(cy - sy);
                if (swipe && dx > 50 && dy < dx * 0.3) opts.onToggleEdit && opts.onToggleEdit();
                else if (!swipe) opts.onNew && opts.onNew();
                swipe = false;
                e.preventDefault();   // no extra click after a touch
            });
            add.addEventListener('click', () => {
                if (touched) { touched = false; return; }
                opts.onNew && opts.onNew();
            });
        }
    };
})();
