(function() {
    // ===== FOOTER / ADD BAR (app shell) =====
    // Shows one button per registered card type. If a comp file is removed,
    // its button disappears with it.
    window.GT50 = window.GT50 || {};

    window.GT50.Footer = {
        HEIGHT: 45,

        // opts: { types: [{ type, label, color }], onAdd(type) }
        render: function(container, opts) {
            const esc = window.GT50.Utils.escapeHTML;
            const types = opts.types || [];

            const buttons = types.length
                ? types.map((t, i) => `
                    <button data-type="${esc(t.type)}" style="
                        flex: 1;
                        height: 100%;
                        background: ${t.color};
                        border: none;
                        ${i < types.length - 1 ? 'border-right: var(--border-width) solid var(--border-color);' : ''}
                        color: var(--color-10);
                        font-family: inherit;
                        font-size: 13px;
                        font-weight: 700;
                        letter-spacing: 1px;
                        cursor: pointer;
                    ">+ ${esc(t.label)}</button>`).join('')
                : `<div style="
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: var(--color-9);
                        font-size: 12px;
                        font-weight: 700;
                    ">NO CARD TYPES INSTALLED</div>`;

            container.innerHTML = `
                <div style="
                    height: ${this.HEIGHT}px;
                    background: var(--bg-3);
                    border-top: var(--border-width) solid var(--border-color);
                    display: flex;
                ">${buttons}</div>
            `;

            container.querySelectorAll('[data-type]').forEach(btn => {
                btn.onclick = () => opts.onAdd && opts.onAdd(btn.dataset.type);
            });
        }
    };
})();
