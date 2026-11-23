(function() {
    // ===== INSERTION SELECTOR COMPONENT =====
    
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Insert = {
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { selectedIndex: 0 };
        },
        
        // ===== RENDER FUNCTION =====
        render: function(container, componentCount, selectedIndex, onSelect) {
            const numSections = componentCount + 1;
            
            // Special value: -1 means no selection
            if (selectedIndex === -1) {
                // Keep as -1 to indicate no selection
            }
            // If selectedIndex is not provided or invalid, default to bottom
            else if (selectedIndex === undefined || selectedIndex === null || selectedIndex < -1) {
                selectedIndex = componentCount; // Bottom position
            }
            // Ensure selectedIndex doesn't exceed available sections
            else if (selectedIndex > componentCount) {
                selectedIndex = componentCount;
            }
            
            // ===== HEIGHT CALCULATIONS =====
            const firstHeight = 22.5;
            const lastHeight = 22.5;
            const middleHeight = 49;
            const totalHeight = firstHeight + (middleHeight * (numSections - 2)) + lastHeight;
            
            // ===== CONTAINER STRUCTURE =====
            container.innerHTML = `
                <div style="
                    width: 20px;
                    background: var(--bg-2);
                    border: var(--border-width) solid var(--border-color);
                    border-radius: var(--card-radius);
                    height: ${totalHeight}px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    flex-shrink: 0;
                ">
                    ${Array.from({ length: numSections }, (_, i) => {
                        let height;
                        if (i === 0) height = firstHeight;
                        else if (i === numSections - 1) height = lastHeight;
                        else height = middleHeight;
                        
                        const isSelected = i === selectedIndex;
                        const bgColor = isSelected ? 'var(--color-4)' : 'var(--bg-4)';
                        
                        return `
                            <div data-selector-index="${i}" style="
                                background: ${bgColor};
                                ${i < numSections - 1 ? 'border-bottom: var(--border-width) solid var(--border-color);' : ''}
                                height: ${height}px;
                                min-height: ${height}px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                transition: background 0.2s;
                            "></div>
                        `;
                    }).join('')}
                </div>
            `;
            
            // ===== LINE UP WITH THE CARDS =====
            // The fixed heights above assume every card is closed. Once the cards
            // beside the selector are on screen, each section is resized so its
            // edges sit at the middle of the cards next to it: open dropdowns,
            // taller cards and newly added cards all stay lined up.
            requestAnimationFrame(() => this.sync(container));

            // ===== EVENT LISTENERS =====
            container.querySelectorAll('[data-selector-index]').forEach(section => {
                const index = parseInt(section.dataset.selectorIndex);
                
                section.onclick = () => {
                    if (onSelect) onSelect(index);
                };
                
                section.onmouseover = () => {
                    if (index !== selectedIndex) {
                        section.style.background = 'var(--primary)';
                    }
                };
                
                section.onmouseout = () => {
                    if (index !== selectedIndex) {
                        section.style.background = 'var(--bg-4)';
                    }
                };
            });
        },

        // ===== SYNC SECTION HEIGHTS TO THE CARD COLUMN =====
        sync: function(container) {
            const bar = container.firstElementChild;
            const cards = container.nextElementSibling;
            if (!bar || !cards || !container.isConnected) return;
            const sections = [...bar.querySelectorAll('[data-selector-index]')];
            const items = [...cards.children].filter(el => el.getBoundingClientRect().height > 0);
            if (sections.length < 2 || items.length !== sections.length - 1) return;

            const top = cards.getBoundingClientRect().top;
            const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--margin')) || 4;
            const border = parseFloat(getComputedStyle(bar).borderTopWidth) || 0;
            // middle of each card (its wrapper's own bottom margin left out)
            const mids = items.map(el => {
                const r = el.getBoundingClientRect();
                return (r.top + r.bottom - gap) / 2 - top;
            });
            const last = items[items.length - 1].getBoundingClientRect().bottom - gap - top;

            const heights = sections.map((_, i) => {
                const from = i === 0 ? 0 : mids[i - 1];
                const to = i === sections.length - 1 ? last : mids[i];
                return to - from;
            });
            heights[0] -= border;
            heights[heights.length - 1] -= border;

            bar.style.height = last + 'px';
            sections.forEach((sec, i) => {
                const h = Math.max(6, heights[i]);
                sec.style.height = h + 'px';
                sec.style.minHeight = h + 'px';
            });

            // keep lined up while card sizes settle (fonts, text fitting, etc.)
            if (!container._gtObserver && window.ResizeObserver) {
                container._gtObserver = new ResizeObserver(() => this.sync(container));
                container._gtObserver.observe(cards);
            }
        }
    };
})();