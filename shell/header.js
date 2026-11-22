(function() {
    // ===== HEADER (app shell) =====
    // Row 1: tabs strip, edge to edge (plus EDIT, and + in edit mode)
    // Row 2: a slot the shell fills (sort/search bar in view, tab editor in edit)
    window.GT50 = window.GT50 || {};

    const css = `
        #header { background: var(--bg-3); border-bottom: var(--border-width) solid var(--border-color); }
        .gt-tabs { display: flex; background: var(--border-color); border-bottom: var(--border-width) solid var(--border-color); }
        .gt-tab {
            flex: 1 1 0; min-width: 0; height: 42px; padding: 0 4px;
            display: flex; align-items: center; justify-content: center;
            background: var(--bg-2); color: var(--font-color-2);
            font: 700 min(.74rem, 2.95vw) Arial, sans-serif; text-transform: uppercase;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            cursor: pointer; user-select: none;
        }
        .gt-tab + .gt-tab { border-left: var(--border-width) solid var(--border-color); }
        .gt-tab.active { background: var(--color-5); color: var(--color-10); }
        .gt-tab.ctl { flex: 0 0 auto; min-width: 56px; padding: 0 10px; background: var(--bg-4); color: var(--color-10); }
        .gt-tab.ctl.on { background: var(--color-2); }
        .gt-row2 { padding: 4px; }
        .gt-tabedit { display: flex; gap: 4px; height: 32px; }
        .gt-tabedit input {
            flex: 1; min-width: 0; height: 100%; padding: 0 10px;
            background: var(--color-10); color: #000;
            border: var(--border-width) solid var(--border-color); border-radius: 8px; outline: 0;
            font: 700 min(.74rem, 2.95vw) Arial, sans-serif; text-transform: uppercase;
        }
        .gt-tabedit button {
            flex: none; padding: 0 12px; height: 100%;
            background: var(--color-1); color: var(--color-10);
            border: var(--border-width) solid var(--border-color); border-radius: 8px;
            font: 700 min(.74rem, 2.95vw) Arial, sans-serif; cursor: pointer;
        }
        .gt-tabedit button.armed { background: var(--color-10); color: var(--color-1); }
        .gt-tabedit button:disabled { opacity: .4; cursor: default; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    window.GT50.Header = {
        // opts: { tabs:[{id,name}], activeId, mode, onTab(id), onToggleMode, onAddTab }
        // returns the row-2 slot element
        render: function(container, opts) {
            const esc = window.GT50.Utils.escapeHTML;
            const isBuild = opts.mode === 'build';

            const tabs = opts.tabs.map(t => `
                <div class="gt-tab ${t.id === opts.activeId ? 'active' : ''}" data-tab="${t.id}">${esc(t.name || 'TAB')}</div>`).join('');

            container.innerHTML = `
                <div class="gt-tabs">
                    ${tabs}
                    ${isBuild ? '<div class="gt-tab ctl" data-action="add-tab">+</div>' : ''}
                    <div class="gt-tab ctl ${isBuild ? 'on' : ''}" data-action="mode">${isBuild ? 'DONE' : 'EDIT'}</div>
                </div>
                <div class="gt-row2"></div>
            `;

            container.querySelectorAll('[data-tab]').forEach(el => {
                el.onclick = () => opts.onTab && opts.onTab(Number(el.dataset.tab));
            });
            const mode = container.querySelector('[data-action="mode"]');
            if (mode) mode.onclick = () => opts.onToggleMode && opts.onToggleMode();
            const add = container.querySelector('[data-action="add-tab"]');
            if (add) add.onclick = () => opts.onAddTab && opts.onAddTab();

            return container.querySelector('.gt-row2');
        },

        // Edit-mode row 2: rename the active tab, delete it (two taps)
        // opts: { name, canDelete, armed, onRename(name), onDelete }
        renderTabEditor: function(slot, opts) {
            const esc = window.GT50.Utils.escapeHTML;
            slot.innerHTML = `
                <div class="gt-tabedit">
                    <input type="text" value="${esc(opts.name)}" placeholder="TAB NAME" aria-label="Tab name"
                        autocomplete="off" autocorrect="off" spellcheck="false">
                    <button type="button" class="${opts.armed ? 'armed' : ''}" ${opts.canDelete ? '' : 'disabled'}>
                        ${opts.armed ? 'TAP TO CONFIRM' : 'DELETE TAB'}</button>
                </div>`;
            const input = slot.querySelector('input');
            input.oninput = () => opts.onRename && opts.onRename(input.value);
            input.onkeydown = (e) => { if (e.key === 'Enter') input.blur(); };
            slot.querySelector('button').onclick = () => opts.canDelete && opts.onDelete && opts.onDelete();
        }
    };
})();
