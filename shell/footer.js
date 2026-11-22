(function() {
    // Static injector ID
    const INJECTOR_ID = '0013';
    
    // ===== FOOTER COMPONENT - REWRITTEN =====
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.Footer = {
        // ===== CONFIGURABLE DIMENSIONS =====
        config: {
            // Heights - change these to adjust footer layout
            FOOTER_HEIGHT: 67.5,      // Total footer height
            TOP_ROW_HEIGHT: 45,       // Height of dropdown toggle area
            BOTTOM_ROW_HEIGHT: 22.5,  // Height of component buttons
            DROPDOWN_HEIGHT: 22.5     // Height of variants dropdown
        },
        
        // ===== CARD COLOR MAPPING =====
        // Maps card types to their color variables
        // When card colors change in styles.js, these update automatically
        getCardColor: function(type) {
            // a card type's own file sets its color when it registers
            const def = window.GT50 && window.GT50.getType ? window.GT50.getType(type) : null;
            if (def && def.color) return def.color;
            const colorMap = {
                'list': '--color-1',
                'checklist': '--color-1-2',
                'radio': '--color-1-3',
                'threshold': '--color-1-4',
                'accumulation': '--color-2',
                'history': '--color-2-2',
                'progress': '--color-3',
                'tier': '--color-4',
                'divider': '--color-6',
                'text': '--color-6-2',
                'scale': '--color-6-3',
                'nest': '--color-5',
                'cycle': '--color-5-2',
                'import': '--color-5-3'
            };
            
            const varName = colorMap[type];
            if (!varName) return '#6b7280'; // Fallback gray
            
            // Get actual computed color from CSS variable
            const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
            return computed || `var(${varName})`;
        },
        
        // ===== CANONICAL SLOT ORDER =====
        // This defines the REQUIRED order - any loaded state will be corrected to match
        getCanonicalOrder: function() {
            return ['list', 'accumulation', 'progress', 'tier', 'nest', 'divider'];
        },
        
        // ===== DEFAULT STATE =====
        defaultState: function() {
            return {
                activeDropdown: null,
                slots: [
                    {
                        baseType: 'list',
                        type: 'list',
                        currentVariant: 'list',
                        variants: [
                            { type: 'list', label: 'LIST' },
                            { type: 'checklist', label: 'CHECKLIST' },
                            { type: 'radio', label: 'RADIO' },
                            { type: 'threshold', label: 'THRESHOLD' }
                        ]
                    },
                    {
                        baseType: 'accumulation',
                        type: 'accumulation',
                        currentVariant: 'accumulation',
                        variants: [
                            { type: 'accumulation', label: 'ACCUMULATION' },
                            { type: 'history', label: 'HISTORY' }
                        ]
                    },
                    {
                        baseType: 'progress',
                        type: 'progress',
                        currentVariant: 'progress',
                        variants: []
                    },
                    {
                        baseType: 'tier',
                        type: 'tier',
                        currentVariant: 'tier',
                        variants: []
                    },
                    {
                        baseType: 'nest',
                        type: 'nest',
                        currentVariant: 'nest',
                        variants: [
                            { type: 'nest', label: 'NEST' },
                            { type: 'cycle', label: 'CYCLE' },
                            { type: 'import', label: 'IMPORT' }
                        ]
                    },
                    {
                        baseType: 'divider',
                        type: 'divider',
                        currentVariant: 'divider',
                        variants: [
                            { type: 'divider', label: 'DIVIDER' },
                            { type: 'text', label: 'TEXT' },
                            { type: 'scale', label: 'SCALE' }
                        ]
                    }
                ]
            };
        },
        
        // ===== ENFORCE CANONICAL ORDER =====
        // Call this on loaded state to ensure slots are in correct order
        enforceOrder: function(state) {
            if (!state || !state.slots) return state;
            
            const canonical = this.getCanonicalOrder();
            const defaultSlots = this.defaultState().slots;
            
            // Create a map of existing slots by baseType
            const slotMap = {};
            state.slots.forEach(slot => {
                // Add baseType if missing (migration from old format)
                if (!slot.baseType) {
                    slot.baseType = slot.currentVariant || slot.type;
                }
                slotMap[slot.baseType] = slot;
            });
            
            // Rebuild slots array in canonical order
            state.slots = canonical.map(baseType => {
                // If we have this slot saved, use it
                if (slotMap[baseType]) {
                    const slot = slotMap[baseType];
                    
                    // MIGRATION: Ensure divider slot has scale variant
                    if (baseType === 'divider') {
                        const hasScale = slot.variants && slot.variants.some(v => v.type === 'scale');
                        if (!hasScale) {
                            // Add scale variant to divider slot
                            if (!slot.variants) slot.variants = [];
                            slot.variants = [
                                { type: 'divider', label: 'DIVIDER' },
                                { type: 'text', label: 'TEXT' },
                                { type: 'scale', label: 'SCALE' }
                            ];
                        }
                    }
                    
                    return slot;
                }
                // Otherwise use default
                return defaultSlots.find(s => s.baseType === baseType);
            });
            
            return state;
        },
        
        // ===== INSTALLED CARD TYPES =====
        // A card type shows only if its comp file has registered.
        // Without the registry (old setups) everything counts as installed.
        isInstalled: function(type) {
            if (!window.GT50 || typeof window.GT50.getType !== 'function') return true;
            return !!window.GT50.getType(type);
        },
        slotVariants: function(slot) {
            const all = (slot.variants && slot.variants.length) ? slot.variants : [{ type: slot.baseType || slot.type }];
            return all.filter(v => this.isInstalled(v.type));
        },
        // Real slot indexes that have at least one installed type; a slot whose
        // current pick is gone falls back to its first installed type
        visibleSlots: function(state) {
            const out = [];
            state.slots.forEach((slot, index) => {
                const vars = this.slotVariants(slot);
                if (!vars.length) return;
                if (!vars.some(v => v.type === (slot.currentVariant || slot.type))) {
                    slot.currentVariant = vars[0].type;
                    slot.type = vars[0].type;
                }
                out.push(index);
            });
            return out;
        },

        // ===== RENDER FUNCTION =====
        render: function(container, state, visible, onAddComponent) {
            const cfg = this.config;
            
            // ALWAYS enforce canonical order before rendering
            this.enforceOrder(state);
            if (state.activeDropdown !== null && this.visibleSlots(state).indexOf(state.activeDropdown) === -1) {
                state.activeDropdown = null;
            }
            
            if (!visible) {
                container.style.display = 'none';
                return;
            }
            
            container.style.display = 'block';
            container.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 1000;
            `;
            
            // Build HTML
            const dropdownHTML = this.buildDropdown(state);
            const topRowHTML = this.buildTopRow(state);
            const bottomRowHTML = this.buildBottomRow(state);
            
            container.innerHTML = `
                ${dropdownHTML}
                <div style="
                    height: ${cfg.FOOTER_HEIGHT}px;
                    background: var(--bg-3);
                    border-top: var(--border-width) solid var(--border-color);
                    border-bottom: var(--border-width) solid var(--border-color);
                    display: flex;
                    flex-direction: column;
                ">
                    <div style="
                        height: ${cfg.TOP_ROW_HEIGHT}px;
                        display: flex;
                        border-bottom: var(--border-width) solid var(--border-color);
                    ">
                        ${topRowHTML}
                    </div>
                    <div style="
                        height: ${cfg.BOTTOM_ROW_HEIGHT}px;
                        display: flex;
                    ">
                        ${bottomRowHTML}
                    </div>
                </div>
            `;
            
            this.attachEventListeners(container, state, visible, onAddComponent);
        },
        
        // ===== BUILD DROPDOWN =====
        buildDropdown: function(state) {
            if (state.activeDropdown === null) return '';
            
            const cfg = this.config;
            const slot = state.slots[state.activeDropdown];
            const installedVariants = this.slotVariants(slot);
            
            if (!slot.variants || slot.variants.length === 0 || installedVariants.length < 2) {
                const color = this.getCardColor(slot.type);
                const textColor = 'var(--color-10)';   // every card color is a dark cloth tone
                
                return `
                    <div style="
                        position: fixed;
                        bottom: ${cfg.FOOTER_HEIGHT}px;
                        left: 0;
                        right: 0;
                        height: ${cfg.DROPDOWN_HEIGHT}px;
                        background: ${color};
                        border-top: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 999;
                        color: ${textColor};
                        font-size: 8px;
                        font-weight: 700;
                    ">
                        MORE VARIATIONS COMING SOON
                    </div>
                `;
            }
            
            const variantsHTML = installedVariants.map((variant, idx) => {
                const color = this.getCardColor(variant.type);
                const textColor = 'var(--color-10)';
                const borderRight = idx < installedVariants.length - 1 
                    ? 'border-right: var(--border-width) solid var(--border-color);' 
                    : '';
                
                return `
                    <div data-variant="${variant.type}" data-slot="${state.activeDropdown}" 
                         style="
                            flex: 1;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 8px;
                            font-weight: 700;
                            cursor: pointer;
                            transition: filter 0.2s;
                            background: ${color};
                            color: ${textColor};
                            ${borderRight}
                        ">
                        ${variant.label}
                    </div>
                `;
            }).join('');
            
            return `
                <div style="
                    position: fixed;
                    bottom: ${cfg.FOOTER_HEIGHT}px;
                    left: 0;
                    right: 0;
                    height: ${cfg.DROPDOWN_HEIGHT}px;
                    background: var(--bg-3);
                    border-top: var(--border-width) solid var(--border-color);
                    display: flex;
                    align-items: center;
                    z-index: 999;
                ">
                    ${variantsHTML}
                </div>
            `;
        },
        
        // ===== BUILD TOP ROW (DROPDOWN TOGGLES) =====
        buildTopRow: function(state) {
            // The two hint sentences are spread over however many slots are
            // installed, so they still read whole with fewer card types
            const spread = (sentence, n) => {
                const words = sentence.split(' ');
                const out = [];
                for (let i = 0; i < n; i++) {
                    const from = Math.round(i * words.length / n), to = Math.round((i + 1) * words.length / n);
                    out.push(words.slice(from, to).join(' '));
                }
                return out;
            };
            const shownCount = this.visibleSlots(state).length;
            const topWords = spread('TAP HERE TO CHANGE CARD TYPES', shownCount);
            const bottomWords = spread('TAP BELOW TO ADD NEW CARD', shownCount);
            
            const shown = this.visibleSlots(state);
            return shown.map((index, pos) => {
                const slot = state.slots[index];
                const borderRight = pos < shown.length - 1 
                    ? 'border-right: var(--border-width) solid var(--border-color);' 
                    : '';
                
                return `
                    <div data-top-slot="${index}" style="
                        flex: 1;
                        height: 100%;
                        background: var(--bg-4);
                        ${borderRight}
                        cursor: pointer;
                        transition: filter 0.2s;
                        display: flex;
                        flex-direction: column;
                    ">
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 10px;
                            font-weight: 700;
                            color: var(--color-10);
                        ">${topWords[pos] || ''}</div>
                        <div style="
                            height: var(--border-width);
                            background: #4F565E;
                        "></div>
                        <div style="
                            flex: 1;
                            background: var(--bg-4);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 10px;
                            font-weight: 700;
                            color: var(--color-10);
                        ">${bottomWords[pos] || ''}</div>
                    </div>
                `;
            }).join('');
        },
        
        // ===== BUILD BOTTOM ROW (COMPONENT BUTTONS) =====
        buildBottomRow: function(state) {
            const labels = {
                'list': 'LIST',
                'checklist': 'CHECKLIST',
                'radio': 'RADIO',
                'threshold': 'THRESHOLD',
                'accumulation': 'COUNT',
                'history': 'HISTORY',
                'progress': 'PROGRESS',
                'tier': 'TIER',
                'divider': 'DIVIDER',
                'text': 'TEXT',
                'scale': 'SCALE',
                'nest': 'NEST',
                'cycle': 'CYCLE',
                'import': 'IMPORT'
            };
            
            const shown = this.visibleSlots(state);
            return shown.map((index, pos) => {
                const slot = state.slots[index];
                const color = this.getCardColor(slot.currentVariant || slot.type);
                const textColor = 'var(--color-10)';
                const borderRight = pos < shown.length - 1 
                    ? 'border-right: var(--border-width) solid var(--border-color);' 
                    : '';
                const label = labels[slot.currentVariant || slot.type] || '+';
                
                return `
                    <div data-bottom-slot="${index}" style="
                        flex: 1;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 10px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: filter 0.2s;
                        background: ${color};
                        color: ${textColor};
                        ${borderRight}
                    ">${label}</div>
                `;
            }).join('');
        },
        
        // ===== ATTACH EVENT LISTENERS =====
        attachEventListeners: function(container, state, visible, onAddComponent) {
            // Top row - toggle dropdown
            container.querySelectorAll('[data-top-slot]').forEach(div => {
                div.onclick = () => {
                    const index = parseInt(div.dataset.topSlot);
                    state.activeDropdown = state.activeDropdown === index ? null : index;
                    this.render(container, state, visible, onAddComponent);
                };
                
                div.onmouseenter = () => div.style.filter = 'brightness(1.1)';
                div.onmouseleave = () => div.style.filter = 'brightness(1)';
            });
            
            // Bottom row - add component (current variant)
            container.querySelectorAll('[data-bottom-slot]').forEach(div => {
                div.onclick = () => {
                    const index = parseInt(div.dataset.bottomSlot);
                    const slot = state.slots[index];
                    onAddComponent(slot.currentVariant);
                    state.activeDropdown = null;
                    this.render(container, state, visible, onAddComponent);
                };
                
                div.onmouseenter = () => div.style.filter = 'brightness(1.15)';
                div.onmouseleave = () => div.style.filter = 'brightness(1)';
            });
            
            // Variant selection in dropdown
            container.querySelectorAll('[data-variant]').forEach(div => {
                div.onclick = () => {
                    const variant = div.dataset.variant;
                    const slotIndex = parseInt(div.dataset.slot);
                    const slot = state.slots[slotIndex];
                    
                    slot.currentVariant = variant;
                    slot.type = variant;
                    
                    state.activeDropdown = null;
                    this.render(container, state, visible, onAddComponent);
                };
                
                div.onmouseenter = () => div.style.filter = 'brightness(1.15)';
                div.onmouseleave = () => div.style.filter = 'brightness(1)';
            });
        },
        
        // ===== RENDER PREVIEW MODE FOOTER =====
        // Special footer for Import Preview mode and Move mode
        // Shows placement instructions and action/CANCEL buttons
        renderPreview: function(container, state, onInsert, onCancel, options = {}) {
            const hasInsertionPoint = state && state.insertionPoint;
            
            // Allow customization of text for different modes
            const prefix = options.prefix || 'INSERT AT';
            const defaultText = options.defaultText || 'USE INSERT ON LEFT TO CHOOSE PLACEMENT';
            const buttonText = options.buttonText || 'INSERT';
            
            const insertionText = hasInsertionPoint 
                ? `${prefix}: ${state.insertionPoint.description}` 
                : defaultText;
            
            container.style.display = 'block';
            container.style.cssText = `
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 1000;
            `;
            
            container.innerHTML = `
                <div style="
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-3);
                    border-top: var(--border-width) solid var(--border-color);
                ">
                    <!-- Instructions -->
                    <div style="
                        height: calc(var(--card-height) * 0.8);
                        background: var(--bg-4);
                        border-bottom: var(--border-width) solid var(--border-color);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0 12px;
                    ">
                        <div style="
                            font-size: 11px;
                            font-weight: 700;
                            color: ${hasInsertionPoint ? 'var(--color-4)' : 'var(--color-10)'};
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            text-align: center;
                        ">${insertionText}</div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div style="
                        height: var(--card-height);
                        display: flex;
                    ">
                        <button data-action="cancel-preview" style="
                            flex: 1;
                            background: var(--bg-3);
                            border: none;
                            border-right: var(--border-width) solid var(--border-color);
                            color: var(--color-10);
                            font-size: 14px;
                            font-weight: 700;
                            cursor: pointer;
                            font-family: inherit;
                            transition: filter 0.2s;
                        ">CANCEL</button>
                        
                        <button data-action="insert-preview" style="
                            flex: 1;
                            background: ${hasInsertionPoint ? 'var(--accent)' : 'var(--bg-4)'};
                            border: none;
                            color: ${hasInsertionPoint ? 'var(--color-10)' : 'var(--color-9)'};
                            font-size: 14px;
                            font-weight: 700;
                            cursor: ${hasInsertionPoint ? 'pointer' : 'not-allowed'};
                            font-family: inherit;
                            transition: filter 0.2s;
                        " ${!hasInsertionPoint ? 'disabled' : ''}>${buttonText}</button>
                    </div>
                </div>
            `;
            
            // ===== EVENT LISTENERS =====
            const cancelBtn = container.querySelector('[data-action="cancel-preview"]');
            if (cancelBtn && onCancel) {
                cancelBtn.onclick = onCancel;
                cancelBtn.onmouseover = () => cancelBtn.style.filter = 'brightness(1.2)';
                cancelBtn.onmouseout = () => cancelBtn.style.filter = 'brightness(1)';
            }
            
            const insertBtn = container.querySelector('[data-action="insert-preview"]');
            if (insertBtn && onInsert && hasInsertionPoint) {
                insertBtn.onclick = onInsert;
                insertBtn.onmouseover = () => {
                    if (!insertBtn.disabled) {
                        insertBtn.style.filter = 'brightness(1.2)';
                    }
                };
                insertBtn.onmouseout = () => insertBtn.style.filter = 'brightness(1)';
            }
        }
    };
})();