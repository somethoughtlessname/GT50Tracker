(function() {
    // Static injector ID
    const INJECTOR_ID = '0011';
    
    // ===== HEADER SYSTEM =====
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.HeaderSystem = {
        headers: [],
        
        // Register a header at a specific position
        register: function(config) {
            /*
            config = {
                position: 0,  // Stack order (0 = top, 1 = second, etc.)
                id: 'main-header',
                visible: function() { return true; },  // Function that returns visibility
                render: function(container) { ... }     // Function that renders to container
            }
            */
            this.headers.push(config);
            this.headers.sort((a, b) => a.position - b.position);
        },
        
        // Clear all registered headers
        clear: function() {
            this.headers = [];
        },
        
        // Render all visible headers and update body padding
        renderAll: function() {
            const visibleHeaders = this.headers.filter(h => h.visible());
            
            // Render each visible header
            visibleHeaders.forEach((header, index) => {
                const container = document.getElementById(header.id);
                if (!container) return;
                
                // Position the container
                container.style.position = 'fixed';
                container.style.top = `calc(var(--card-height) * ${header.position})`;
                container.style.left = '0';
                container.style.right = '0';
                container.style.zIndex = 1000 + (100 - header.position);
                
                // Show/hide based on visibility
                container.style.display = header.visible() ? 'block' : 'none';
                
                // Render content
                if (header.visible()) {
                    header.render(container);
                }
            });
            
            // Update body padding based on visible headers count
            this.updatePadding();
        },
        
        // Calculate and apply body padding
        updatePadding: function() {
            const visibleCount = this.headers.filter(h => h.visible()).length;
            document.body.style.paddingTop = `calc((var(--card-height) * ${visibleCount}) + 4px)`;
        }
    };
    
    // ===== LEGACY HEADER COMPONENT (for nested headers) =====
    window.GT50Lib.Header = {
        // Add property to track edit button visibility
        editSectionVisible: false,
        
        // ===== STATE FACTORY =====
        defaultState: function() {
            return { title: '', isMain: true };
        },
        
        // ===== BUILD MODE RENDERER =====
        renderBuild: function(container, state, onChange, onBack, onHome, onToggleMode, activeMode, onDataOpen, onSettingsOpen, onNewOpen, isImportMode, isNested) {
            // IMPORT MODE - Shows back button ONLY when in nested levels
            if (isImportMode) {
                if (isNested) {
                    // NESTED IMPORT MODE - Back button + Title
                    container.innerHTML = `
                        <div style="
                            height: var(--card-height);
                            background: var(--bg-3);
                            border-bottom: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                        ">
                            <div data-action="back" style="
                                width: var(--square-section);
                                min-width: var(--square-section);
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                background: var(--color-1);
                                padding: 0;
                                font-size: 18px;
                                border-right: var(--border-width) solid var(--border-color);
                                cursor: pointer;
                                color: var(--color-10);
                                transition: filter 0.2s;
                            ">◀</div>
                            <div style="
                                flex: 1;
                                height: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                padding: 0 var(--margin);
                                background: var(--color-5-3);
                            ">
                                <div style="
                                    width: 100%;
                                    color: var(--color-10);
                                    font-size: 14px;
                                    font-weight: 700;
                                    font-family: inherit;
                                    text-align: center;
                                ">${state.title || 'IMPORT MODE'}</div>
                            </div>
                        </div>
                    `;
                    
                    // Add back button listener
                    const backBtn = container.querySelector('[data-action="back"]');
                    if (backBtn && onBack) {
                        backBtn.onclick = () => onBack();
                        backBtn.onmouseover = () => backBtn.style.filter = 'brightness(1.2)';
                        backBtn.onmouseout = () => backBtn.style.filter = 'brightness(1)';
                    }
                } else {
                    // ROOT IMPORT MODE - Just title, no buttons
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
                                background: var(--color-5-3);
                            ">
                                <div style="
                                    width: 100%;
                                    color: var(--color-10);
                                    font-size: 14px;
                                    font-weight: 700;
                                    font-family: inherit;
                                    text-align: center;
                                ">${state.title || 'IMPORT MODE'}</div>
                            </div>
                        </div>
                    `;
                }
                return;
            }
            
            if (state.isMain) {
                // ===== MAIN WINDOW HEADER =====
                const modeButtonText = activeMode === 'build' ? 'VIEW' : 'EDIT';
                
                container.innerHTML = `
                    <div style="
                        height: var(--card-height);
                        background: var(--bg-3);
                        border-bottom: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                    ">
                        <div data-action="open-create-new" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">NEW</div>
                        <div data-action="toggle-mode" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">${modeButtonText}</div>
                        <div data-action="open-settings" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">SETTINGS</div>
                        <div data-action="open-data" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">DATA</div>
                    </div>
                `;
                
                // ===== EVENT LISTENERS =====
                const newBtn = container.querySelector('[data-action="open-create-new"]');
                if (newBtn && onNewOpen) {
                    newBtn.onclick = onNewOpen;
                    newBtn.onmouseover = () => newBtn.style.filter = 'brightness(1.2)';
                    newBtn.onmouseout = () => newBtn.style.filter = 'brightness(1)';
                }
                
                const toggleBtn = container.querySelector('[data-action="toggle-mode"]');
                if (toggleBtn && onToggleMode) {
                    toggleBtn.onclick = onToggleMode;
                    toggleBtn.onmouseover = () => toggleBtn.style.filter = 'brightness(1.2)';
                    toggleBtn.onmouseout = () => toggleBtn.style.filter = 'brightness(1)';
                }
                
                const settingsBtn = container.querySelector('[data-action="open-settings"]');
                if (settingsBtn && onSettingsOpen) {
                    settingsBtn.onclick = onSettingsOpen;
                    settingsBtn.onmouseover = () => settingsBtn.style.filter = 'brightness(1.2)';
                    settingsBtn.onmouseout = () => settingsBtn.style.filter = 'brightness(1)';
                }
                
                const dataBtn = container.querySelector('[data-action="open-data"]');
                if (dataBtn && onDataOpen) {
                    dataBtn.onclick = onDataOpen;
                    dataBtn.onmouseover = () => dataBtn.style.filter = 'brightness(1.2)';
                    dataBtn.onmouseout = () => dataBtn.style.filter = 'brightness(1)';
                }
            } else {
                // ===== NESTED WINDOW HEADER (BUILD MODE) =====
                this.renderNestBar(container, state.title, 'build', onBack, onHome);
            }
        },
        
        // ===== VIEW MODE RENDERER =====
        renderView: function(container, state, onChange, onBack, onHome, onToggleMode, activeMode, onDataOpen, onSettingsOpen, onNewOpen) {
            if (state.isMain) {
                // ===== MAIN WINDOW HEADER =====
                const modeButtonText = activeMode === 'build' ? 'VIEW' : 'EDIT';
                
                container.innerHTML = `
                    <div style="
                        height: var(--card-height);
                        background: var(--bg-3);
                        border-bottom: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                    ">
                        <div data-action="open-create-new" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">NEW</div>
                        <div data-action="toggle-mode" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: ${GT50Lib.Header.editSectionVisible ? 'flex' : 'none'};
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">${modeButtonText}</div>
                        <div data-action="open-settings" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            border-right: var(--border-width) solid var(--border-color);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">SETTINGS</div>
                        <div data-action="open-data" style="
                            flex: 1;
                            height: 100%;
                            background: var(--bg-4);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            font-weight: 600;
                            color: var(--font-color-3);
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">DATA</div>
                    </div>
                `;
                
                // ===== EVENT LISTENERS =====
                const newBtn = container.querySelector('[data-action="open-create-new"]');
                if (newBtn && onNewOpen) {
                    // Horizontal swipe detection variables
                    let touchStartX = 0;
                    let touchStartY = 0;
                    let touchCurrentX = 0;
                    let touchCurrentY = 0;
                    let swipeDetected = false;
                    let scrollDetected = false;
                    
                    // Touch start
                    const handleTouchStart = (e) => {
                        touchStartX = e.touches[0].clientX;
                        touchStartY = e.touches[0].clientY;
                        touchCurrentX = touchStartX;
                        touchCurrentY = touchStartY;
                        swipeDetected = false;
                        scrollDetected = false;
                    };
                    
                    // Touch move - detect horizontal swipe
                    const handleTouchMove = (e) => {
                        if (scrollDetected) return;
                        
                        touchCurrentX = e.touches[0].clientX;
                        touchCurrentY = e.touches[0].clientY;
                        
                        const deltaX = Math.abs(touchCurrentX - touchStartX);
                        const deltaY = Math.abs(touchCurrentY - touchStartY);
                        
                        // Check once we have meaningful movement
                        if (deltaX > 5 || deltaY > 5) {
                            // Strict horizontal: vertical movement must be < 30% of horizontal
                            if (deltaY > deltaX * 0.3) {
                                // Too much vertical - this is a scroll
                                scrollDetected = true;
                            } else if (deltaX > 30) {
                                // Enough horizontal, minimal vertical - this is a swipe
                                swipeDetected = true;
                                e.preventDefault();
                            }
                        }
                    };
                    
                    // Touch end - execute action
                    const handleTouchEnd = (e) => {
                        if (scrollDetected) {
                            scrollDetected = false;
                            return;
                        }
                        
                        const deltaX = touchCurrentX - touchStartX;
                        const deltaY = Math.abs(touchCurrentY - touchStartY);
                        const absDeltaX = Math.abs(deltaX);
                        
                        const threshold = 50;
                        
                        // Horizontal swipe = toggle edit button visibility
                        if (swipeDetected && absDeltaX > threshold && deltaY < absDeltaX * 0.3) {
                            GT50Lib.Header.editSectionVisible = !GT50Lib.Header.editSectionVisible;
                            if (onChange) onChange();
                        } else if (!swipeDetected) {
                            // Regular tap = open new window
                            onNewOpen();
                        }
                        
                        swipeDetected = false;
                        scrollDetected = false;
                    };
                    
                    // Regular click for mouse users
                    newBtn.addEventListener('click', (e) => {
                        // Only handle mouse clicks, not touch events
                        if (e.pointerType !== 'touch' && !e.touches) {
                            onNewOpen();
                        }
                    });
                    
                    // Touch event listeners
                    newBtn.addEventListener('touchstart', handleTouchStart, { passive: true });
                    newBtn.addEventListener('touchmove', handleTouchMove);
                    newBtn.addEventListener('touchend', handleTouchEnd);
                    
                    // Hover effects
                    newBtn.onmouseover = () => newBtn.style.filter = 'brightness(1.2)';
                    newBtn.onmouseout = () => newBtn.style.filter = 'brightness(1)';
                }
                
                const toggleBtn = container.querySelector('[data-action="toggle-mode"]');
                if (toggleBtn && onToggleMode) {
                    toggleBtn.onclick = onToggleMode;
                    toggleBtn.onmouseover = () => toggleBtn.style.filter = 'brightness(1.2)';
                    toggleBtn.onmouseout = () => toggleBtn.style.filter = 'brightness(1)';
                }
                
                const settingsBtn = container.querySelector('[data-action="open-settings"]');
                if (settingsBtn && onSettingsOpen) {
                    settingsBtn.onclick = onSettingsOpen;
                    settingsBtn.onmouseover = () => settingsBtn.style.filter = 'brightness(1.2)';
                    settingsBtn.onmouseout = () => settingsBtn.style.filter = 'brightness(1)';
                }
                
                const dataBtn = container.querySelector('[data-action="open-data"]');
                if (dataBtn && onDataOpen) {
                    dataBtn.onclick = onDataOpen;
                    dataBtn.onmouseover = () => dataBtn.style.filter = 'brightness(1.2)';
                    dataBtn.onmouseout = () => dataBtn.style.filter = 'brightness(1)';
                }
            } else {
                // ===== NESTED WINDOW HEADER =====
                this.renderNestBar(container, state.title, 'view', onBack, onHome);
            }
        },

        // ===== NEST WINDOW BAR =====
        // Matches row 1 of the main window: walnut band with a black line above
        // and below, a 42px row split into sections by 3px black lines. Back card on the left, the title
        // card in the middle, and Home (build) or the home square (view) on the right.
        renderNestBar: function(container, title, mode, onBack, onHome) {
            if (!document.getElementById('jj-nestbar-css')) {
                const st = document.createElement('style');
                st.id = 'jj-nestbar-css';
                st.textContent = `
                    .jj-nb { display: flex; background: var(--bg-3);
                        border-top: var(--border-width) solid var(--border-color);
                        border-bottom: var(--border-width) solid var(--border-color); }
                    .jj-nb .c { height: 42px; min-width: 0; padding: 0 10px; background: var(--cbg, var(--color-10));
                        display: flex; align-items: center; justify-content: center;
                        color: #000; font: 700 min(.74rem, 2.95vw) Arial, sans-serif; text-transform: uppercase;
                        white-space: nowrap; user-select: none; -webkit-user-select: none; }
                    .jj-nb .c + .c { border-left: var(--border-width) solid var(--border-color); }
                    .jj-nb .t { flex: 1 1 auto; }
                    .jj-nb .t span { overflow: hidden; text-overflow: ellipsis; }
                    .jj-nb .b { flex: 0 0 48px; box-sizing: border-box; cursor: pointer; }
                    .jj-nb .b:active { filter: brightness(.9); }
                    .jj-nb .b svg { width: 26px; height: 26px; display: block; overflow: visible; }
                    .jj-nb .sq { width: 14px; height: 14px; border: 2.5px solid #fff; border-radius: 3px;
                        box-sizing: border-box; display: flex; align-items: center; justify-content: center; }
                    .jj-nb .sq::after { content: ''; width: 4px; height: 4px; border-radius: 50%; background: #fff; }
                `;
                document.head.appendChild(st);
            }
            const esc = (window.GT50 && GT50.escapeHTML) ? GT50.escapeHTML : (x) => String(x);
            const tri = (pts) => `<svg viewBox="0 0 40 40"><polygon points="${pts}" fill="#fff" stroke="#fff" stroke-width="5" stroke-linejoin="round"/></svg>`;
            const left = tri('27,10.4 27,29.6 10.4,20');
            const right = mode === 'build' ? tri('13,10.4 13,29.6 29.6,20') : '<i class="sq"></i>';
            container.innerHTML = `
                <div class="jj-nb">
                    <div class="c b" data-action="back" role="button" aria-label="Back" style="--cbg: var(--color-1)">${left}</div>
                    <div class="c t"><span>${esc(title || 'Untitled')}</span></div>
                    <div class="c b" data-action="home" role="button" aria-label="Home" style="--cbg: ${mode === 'build' ? 'var(--color-4)' : 'var(--bg-4)'}">${right}</div>
                </div>`;
            const backBtn = container.querySelector('[data-action="back"]');
            if (backBtn && onBack) backBtn.onclick = () => onBack();
            const homeBtn = container.querySelector('[data-action="home"]');
            if (homeBtn && onHome) homeBtn.onclick = () => onHome();
        }
    };
    
    // =====================================================
    // INJECT RIGHT SECTION (for plugin UI)
    // =====================================================
    setTimeout(() => {
        const container = document.getElementById('cards-plugins');
        if (container) {
            const cards = container.children;
            for (let card of cards) {
                const filename = card.querySelector('div:last-child');
                if (filename && filename.textContent === 'comp-header.js') {
                    const rightSection = document.createElement('div');
                    rightSection.style.cssText = `
                        width: 60px;
                        height: 100%;
                        background: var(--primary);
                        border-left: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--color-10);
                    `;
                    rightSection.textContent = INJECTOR_ID;
                    card.appendChild(rightSection);
                    break;
                }
            }
        }
    }, 100);
})();