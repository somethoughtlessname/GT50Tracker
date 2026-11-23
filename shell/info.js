(function() {
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.CardInfo = {
        defaultState: function() {
            return {
                isOpen: false,
                header: {
                    isMain: false,
                    title: 'CARD INFO'
                }
            };
        },
        
        open: function(state, cardType, onChange) {
            state.isOpen = true;
            state.header.title = 'CARD INFO';
            onChange();
        },
        
        close: function(state, onChange) {
            state.isOpen = false;
            onChange();
        },
        
        renderSettingsCard: function(container, state, onChange) {
            const card = document.createElement('div');
            card.style.cssText = `
                margin: var(--margin);
                background: var(--bg-2);
                border: var(--border-width) solid var(--border-color);
                border-radius: var(--card-radius);
                height: var(--card-height);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: filter 0.2s;
            `;
            card.innerHTML = `
                <div style="
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--color-10);
                    text-align: center;
                ">CARD INFO</div>
            `;
            
            card.onmouseover = () => card.style.filter = 'brightness(1.2)';
            card.onmouseout = () => card.style.filter = 'brightness(1)';
            card.onclick = () => this.open(state, 'list', onChange);
            
            container.appendChild(card);
        },
        
        render: function(container, state, onChangeOrClose, onClose) {
            const actualOnChange = onClose ? onChangeOrClose : null;
            const actualOnClose = onClose || onChangeOrClose;
            
            const internalRender = () => {
                this.renderContent(container, state, internalRender, actualOnClose);
            };
            
            internalRender();
        },
        
        renderContent: function(container, state, onChange, onClose) {
            if (!state.isOpen) {
                container.style.display = 'none';
                return;
            }
            
            container.style.display = 'block';
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: var(--bg-1);
                z-index: 2000;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            `;
            
            container.innerHTML = `
                <div id="cardinfo-header" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: var(--card-height);
                    z-index: 2001;
                "></div>
                <div id="cardinfo-content" style="
                    padding-top: calc(var(--card-height) + var(--margin));
                    padding-bottom: var(--margin);
                    padding-left: var(--margin);
                    padding-right: var(--margin);
                "></div>
            `;
            
            const headerContainer = container.querySelector('#cardinfo-header');
            GT50Lib.Header.renderBuild(
                headerContainer,
                state.header,
                onChange,
                onClose,
                onClose,
                null,
                null
            );
            
            const contentContainer = container.querySelector('#cardinfo-content');
            this.renderCardList(contentContainer);
        },
        
        // App parts that are always there (part of the shell, not plug-ins)
        appParts: [
            { label: 'TABS', color: 'var(--color-7)', desc: 'Split your cards into separate pages' },
            { label: 'FOOTER', color: 'var(--color-7-2)', desc: 'The menu at the bottom for adding cards' },
            { label: 'IMPORT/EXPORT', color: 'var(--color-7-3)', desc: 'Save or load your entire workspace' },
            { label: 'SELECTOR', color: 'var(--color-7-4)', desc: 'Choose where new cards get placed' }
        ],

        // Card entries come from the card files themselves: each comp file puts
        // its description in its GT50.register() call (about: { desc, color }).
        // Only installed card types appear; remove a file and its entry goes too.
        installedCards: function() {
            if (!window.GT50 || typeof window.GT50.listTypes !== 'function') return [];
            return window.GT50.listTypes()
                .filter(t => t.about)
                .map(t => ({ label: t.label, color: t.about.color || t.color, desc: t.about.desc || '' }));
        },

        renderCardList: function(contentContainer) {
            const esc = (window.GT50 && window.GT50.escapeHTML) || (v => String(v));
            const entry = (card, last) => `
                <div style="
                    width: 100%;
                    height: var(--card-height);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: var(--card-radius);
                    margin-bottom: ${last ? '0' : 'var(--margin)'};
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 4px 8px;
                    text-align: center;
                    background: ${card.color};
                ">
                    <div style="
                        font-size: 12px;
                        font-weight: 700;
                        letter-spacing: 0.5px;
                        margin-bottom: 2px;
                        color: var(--font-color-3);
                    ">${esc(card.label)}</div>
                    <div style="
                        font-size: 9px;
                        font-weight: 600;
                        opacity: 0.9;
                        line-height: 1.1;
                        color: var(--font-color-3);
                    ">${esc(card.desc)}</div>
                </div>`;
            const divider = (label) => `
                <div style="display: flex; align-items: center; gap: 12px; margin: 8px 0 6px;">
                    <div style="flex: 1; height: var(--border-width); background: var(--border-color);"></div>
                    <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.5px; color: var(--bg-2);">${label}</div>
                    <div style="flex: 1; height: var(--border-width); background: var(--border-color);"></div>
                </div>`;

            const cards = this.installedCards();
            const app = this.appParts;
            contentContainer.innerHTML =
                divider('CARDS') +
                (cards.length
                    ? cards.map((c, i) => entry(c, i === cards.length - 1)).join('')
                    : '<div style="text-align:center; padding:12px; color: var(--font-color-2); font-size: 12px; font-weight: 700;">NO CARD TYPES INSTALLED</div>') +
                divider('APP') +
                app.map((c, i) => entry(c, i === app.length - 1)).join('');
        }
    };
})();
