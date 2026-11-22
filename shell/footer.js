(function() {
    // ===== FOOTER: ADD NEW CARD (app shell) =====
    // One card type installed: tapping adds it straight away.
    // More than one: tapping opens a row of types above the button.
    // A removed comp file simply drops out of that row.
    window.GT50 = window.GT50 || {};

    const css = `
        #footer { background: var(--bg-3); border-top: var(--border-width) solid var(--border-color); padding: 4px; }
        .gt-add {
            width: 100%; height: 45px; display: flex; align-items: center; justify-content: center;
            background: var(--color-4); color: var(--color-10);
            border: var(--border-width) solid var(--border-color); border-radius: 8px;
            font: 700 min(1rem, 4vw)/1 Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase;
            cursor: pointer;
        }
        .gt-add:active { filter: brightness(.9); }
        .gt-add:disabled { background: var(--bg-4); cursor: default; }
        .gt-picks { display: flex; gap: 4px; margin-bottom: 4px; }
        .gt-picks button {
            flex: 1; min-width: 0; height: 36px;
            border: var(--border-width) solid var(--border-color); border-radius: 8px;
            color: var(--color-10); font: 700 min(.74rem, 2.95vw) Arial, sans-serif; text-transform: uppercase;
            cursor: pointer;
        }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    let picking = false;

    window.GT50.Footer = {
        // opts: { types: [{ type, label, color }], onAdd(type) }
        render: function(container, opts) {
            const esc = window.GT50.Utils.escapeHTML;
            const types = opts.types || [];
            if (types.length < 2) picking = false;

            container.innerHTML = `
                ${picking ? `<div class="gt-picks">${types.map(t => `
                    <button type="button" data-type="${esc(t.type)}" style="background:${t.color}">${esc(t.label)}</button>`).join('')}
                </div>` : ''}
                <button type="button" class="gt-add" ${types.length ? '' : 'disabled'}>
                    ${types.length ? (picking ? 'Cancel' : '+ Add New Card') : 'No card types installed'}
                </button>`;

            const rerender = () => this.render(container, opts);

            container.querySelector('.gt-add').onclick = () => {
                if (!types.length) return;
                if (types.length === 1) { opts.onAdd && opts.onAdd(types[0].type); return; }
                picking = !picking;
                rerender();
            };
            container.querySelectorAll('[data-type]').forEach(btn => {
                btn.onclick = () => {
                    picking = false;
                    opts.onAdd && opts.onAdd(btn.dataset.type);
                };
            });
        }
    };
})();
