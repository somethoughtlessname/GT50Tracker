(function() {
    // ===== HEADER (app shell) =====
    window.GT50 = window.GT50 || {};

    window.GT50.Header = {
        // opts: { title, mode: 'build' | 'view', onToggleMode }
        render: function(container, opts) {
            const esc = window.GT50.Utils.escapeHTML;
            const isBuild = opts.mode === 'build';

            container.innerHTML = `
                <div style="
                    height: var(--card-height);
                    background: var(--bg-3);
                    border-bottom: var(--border-width) solid var(--border-color);
                    display: flex;
                    align-items: center;
                ">
                    <div style="
                        flex: 1;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        padding: 0 12px;
                        color: var(--color-10);
                        font-size: 16px;
                        font-weight: 700;
                        letter-spacing: 1px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    ">${esc(opts.title)}</div>
                    <button data-action="mode" style="
                        width: 90px;
                        height: 100%;
                        background: ${isBuild ? 'var(--color-2)' : 'var(--color-5)'};
                        border: none;
                        border-left: var(--border-width) solid var(--border-color);
                        color: var(--color-10);
                        font-family: inherit;
                        font-size: 13px;
                        font-weight: 700;
                        letter-spacing: 1px;
                        cursor: pointer;
                    ">${isBuild ? 'BUILD' : 'VIEW'}</button>
                </div>
            `;

            const btn = container.querySelector('[data-action="mode"]');
            if (btn && opts.onToggleMode) btn.onclick = opts.onToggleMode;
        }
    };
})();
