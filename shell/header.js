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
                        justify-content: center;
                        padding: 0 var(--margin);
                        background: var(--bg-3);
                        overflow: hidden;
                    ">
                        <div style="
                            width: 100%;
                            color: var(--color-10);
                            font-size: 14px;
                            font-weight: 600;
                            font-family: inherit;
                            text-align: center;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        ">${esc(opts.title)}</div>
                    </div>
                    <button data-action="mode" style="
                        width: 90px;
                        height: 100%;
                        background: var(--bg-4);
                        border: none;
                        border-left: var(--border-width) solid var(--border-color);
                        color: var(--font-color-3);
                        font-family: inherit;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                    ">${isBuild ? 'VIEW' : 'EDIT'}</button>
                </div>
            `;

            const btn = container.querySelector('[data-action="mode"]');
            if (btn && opts.onToggleMode) btn.onclick = opts.onToggleMode;
        }
    };
})();
