(function() {
    // Static injector ID
    const INJECTOR_ID = '0001';
    
    // CSS content - STYLES ONLY, NO FUNCTIONS
    const cssContent = `
        :root {
            /* ========================================= */
            /* CARD DIMENSIONS */
            /* ========================================= */
            --margin: 4px;
            --card-height: 45px;
            --square-section: 28px;
            --half-square: 14px;
            --border-width: 3px;
            --border-color: #000000;

            /* ========================================= */
            /* CARD ANATOMY - every card type uses these */
            /* ========================================= */
            --card-radius: 8px;          /* corners of every card and dropdown */
            --item-height: 32px;         /* a row inside a card's dropdown */
            --item-section: 32px;        /* the square buttons on such a row */
            --item-text-size: 12px;      /* text typed on such a row */
            --accent: var(--color-4);    /* fill for checked/done when a tab has no color */
            --gold: #9a6b09;             /* complete */
            --check-off: var(--color-10);/* an unchecked square */
            
            /* ========================================= */
            /* PRIMARY COLORS */
            /* ========================================= */
            --primary: #2b5752;
            --secondary: #303d66;
            --accent: #5b6633;
            
            /* ========================================= */
            /* BACKGROUND COLORS */
            /* ========================================= */
            --bg-1: #efeadf;
            --bg-2: #2b2620;
            --bg-3: #6b4a32;
            --bg-4: #8f7658;
            --bg-5: #4a3f35;
            --bg-9: #2b2620;
            
            /* ========================================= */
            /* RAINBOW COLORS - BASE */
            /* ========================================= */
            --color-1: #7a2f2b;      /* Red (brick) */
            --color-2: #9a5b2e;      /* Orange (rust) */
            --color-3: #8a710f;      /* Yellow (mustard) */
            --color-4: #5b6633;      /* Green (olive) */
            --color-5: #303d66;      /* Blue (navy) */
            --color-6: #66304c;      /* Purple (plum) */
            --color-7: #8c4f66;      /* Pink (rose) */
            --color-8: #000000;      /* Black */
            --color-9: #7a746a;      /* Gray (taupe) */
            --color-10: #ffffff;     /* White */
            
            /* ========================================= */
            /* RAINBOW COLORS - RED VARIATIONS */
            /* ========================================= */
            --color-1-2: #622622;    /* -20% brightness */
            --color-1-3: #491c1a;    /* -40% brightness */
            --color-1-4: #311311;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - ORANGE VARIATIONS */
            /* ========================================= */
            --color-2-2: #7b4925;    /* -20% brightness */
            --color-2-3: #5c371c;    /* -40% brightness */
            --color-2-4: #3e2412;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - YELLOW VARIATIONS */
            /* ========================================= */
            --color-3-2: #6e5a0c;    /* -20% brightness */
            --color-3-3: #534409;    /* -40% brightness */
            --color-3-4: #372d06;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - GREEN VARIATIONS */
            /* ========================================= */
            --color-4-2: #495229;    /* -20% brightness */
            --color-4-3: #373d1f;    /* -40% brightness */
            --color-4-4: #242914;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - BLUE VARIATIONS */
            /* ========================================= */
            --color-5-2: #263152;    /* -20% brightness */
            --color-5-3: #1d253d;    /* -40% brightness */
            --color-5-4: #131829;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - PURPLE VARIATIONS */
            /* ========================================= */
            --color-6-2: #52263d;    /* -20% brightness */
            --color-6-3: #3d1d2e;    /* -40% brightness */
            --color-6-4: #29131e;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - PINK VARIATIONS */
            /* ========================================= */
            --color-7-2: #703f52;    /* -20% brightness */
            --color-7-3: #542f3d;    /* -40% brightness */
            --color-7-4: #382029;    /* -60% brightness */
            
            /* ========================================= */
            /* RAINBOW COLORS - GRAY VARIATIONS */
            /* ========================================= */
            --color-9-2: #625d55;    /* -20% brightness */
            --color-9-3: #494640;    /* -40% brightness */
            --color-9-4: #312e2a;    /* -60% brightness */
            
            /* ========================================= */
            /* FONT COLORS */
            /* ========================================= */
            --font-color-1: #000000;
            --font-color-2: #8a8378;
            --font-color-3: #ffffff;
            
            /* ========================================= */
            /* TEXT SIZING & PADDING */
            /* ========================================= */
            --dropdown-text-size: 10px;
            --dropdown-text-weight: 600;
            --text-padding-left: 4px;
            --text-padding-right: 16px;
            --text-padding-small: 12px;
            
            /* ========================================= */
            /* CONTROL BUTTONS */
            /* ========================================= */
            --control-button-color: var(--color-10);
            --control-button-brightness: 0.75;
            --delete-pending-bg: var(--color-10);
            --delete-pending-color: var(--color-1);
            
            /* ========================================= */
            /* TRANSITIONS & EFFECTS */
            /* ========================================= */
            --transition-speed: 0.2s;
            --hover-brightness: 1.2;
            
            /* ========================================= */
            /* DROPDOWN STYLING */
            /* ========================================= */
            --dropdown-bg: var(--bg-2);
            --dropdown-radius: 0 0 8px 8px;
            --dropdown-item-radius: 8px;
            --dropdown-item-height: 32px;
            --dropdown-text-bg: var(--bg-3);
            --dropdown-text-display-size: 10px;
            --dropdown-text-display-weight: 600;
            --dropdown-arrow-size: 6px;
            --dropdown-arrow-height: 8px;
            
            /* ========================================= */
            /* EMPTY STATES */
            /* ========================================= */
            --empty-state-bg: var(--bg-3);
            --empty-state-height: 80px;
            --empty-state-gap: 8px;
            --empty-state-opacity: 0.6;
            --empty-state-icon-size: 32px;
            --empty-state-text-size: 12px;
            --empty-state-text-weight: 600;
            
            /* ========================================= */
            /* ERROR STATES */
            /* ========================================= */
            --error-bg: #3f1f1f;
            --error-border: #8b0000;
            --error-color: #ff6b6b;
            
            /* ========================================= */
            /* SYMBOLS: CHECKMARK */
            /* ========================================= */
            --check-size: 25px;
            --check-weight: 900;
            --check-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: CHECKMARK BOLD */
            /* ========================================= */
            --check-bold-size: 45px;
            --check-bold-weight: 700;
            --check-bold-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: DELETE */
            /* ========================================= */
            --delete-size: 35px;
            --delete-weight: 700;
            --delete-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: DELETE SUB */
            /* ========================================= */
            --delete-sub-size: 25px;
            --delete-sub-weight: 700;
            --delete-sub-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: MINUS */
            /* ========================================= */
            --minus-size: 35px;
            --minus-weight: 700;
            --minus-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: PLUS */
            /* ========================================= */
            --plus-size: 45px;
            --plus-weight: 700;
            --plus-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: UP ARROW */
            /* ========================================= */
            --up-size: 25px;
            --up-weight: 700;
            --up-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: UP ARROW SUB */
            /* ========================================= */
            --up-sub-size: 22px;
            --up-sub-weight: 700;
            --up-sub-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: DOWN ARROW */
            /* ========================================= */
            --down-size: 25px;
            --down-weight: 700;
            --down-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: DOWN ARROW SUB */
            /* ========================================= */
            --down-sub-size: 22px;
            --down-sub-weight: 700;
            --down-sub-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: CIRCLE */
            /* ========================================= */
            --circle-size: 8px;
            --circle-weight: 400;
            --circle-position: 0px;
            
            /* ========================================= */
            /* SYMBOLS: ASTERISK */
            /* ========================================= */
            --asterisk-size: 45px;
            --asterisk-weight: 900;
            --asterisk-position: 20px;
            
            /* ========================================= */
            /* SYMBOLS: COUNT */
            /* ========================================= */
            --count-size: 20px;
            --count-weight: 900;
            --count-position: 0px;
        }
        
        /* ========================================= */
        /* PLACEHOLDER STYLING */
        /* ========================================= */
        ::placeholder {
            color: var(--ph-color, rgba(255,255,255,0.6));
            opacity: var(--ph-opacity, 1);
        }

        ::-webkit-input-placeholder {
            color: var(--ph-color, rgba(255,255,255,0.6));
            opacity: var(--ph-opacity, 1);
        }

        ::-moz-placeholder {
            color: var(--ph-color, rgba(255,255,255,0.6));
            opacity: var(--ph-opacity, 1);
        }

        :-ms-input-placeholder {
            color: var(--ph-color, rgba(255,255,255,0.6));
            opacity: var(--ph-opacity, 1);
        }
        
        /* ========================================= */
        /* FOCUS INDICATORS */
        /* ========================================= */
        input:focus,
        textarea:focus,
        button:focus,
        select:focus {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
        }
        
        /* ========================================= */
        /* SMOOTH SCROLLING */
        /* ========================================= */
        html {
            scroll-behavior: smooth;
        }
        
        /* ========================================= */
        /* NO SCROLL BARS */
        /* ========================================= */
        /* Every window still scrolls; only the bar on the right is hidden */
        html, body, * { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar, *::-webkit-scrollbar { display: none; width: 0; height: 0; }

        /* ========================================= */
        /* EDIT-MODE CARDS: SHARED LAYOUT */
        /* ========================================= */
        /* Every card's header row works the same way: a fixed square on the
           left, a title that gives up space first, and fixed ▲ ▼ × squares on
           the right that never get pushed off the card. */
        #cards-main input[data-field="title"],
        #cards-main div:has(> input[data-field="title"]) { min-width: 0; }
        #cards-main [data-action="toggle"][style*="--square-section"],
        #cards-main [data-action="move-up-card"],
        #cards-main [data-action="move-down-card"],
        #cards-main [data-action="delete-card"] { flex-shrink: 0; }

        /* ========================================= */
        /* SELECTION STYLING */
        /* ========================================= */
        ::selection {
            background: var(--primary);
            color: var(--color-10);
        }
        
        ::-moz-selection {
            background: var(--primary);
            color: var(--color-10);
        }
        
        /* ========================================= */
        /* DISABLE CONTEXT MENU FOR PWA FEEL */
        /* ========================================= */
        * {
            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none;   /* Safari */
            user-select: none;           /* Standard */
            -webkit-tap-highlight-color: transparent; /* Remove tap highlight */
        }
        
        /* Re-enable text selection for inputs */
        input,
        textarea {
            -webkit-user-select: text;
            user-select: text;
        }
        /* ========================================= */
        /* CARD PARTS (shell/parts.js)               */
        /* ========================================= */
        .gt-ictl { position: absolute; top: 0; right: 0; display: flex; height: var(--item-height);
            border-left: var(--border-width) solid var(--border-color); }
        .gt-ictl button { position: relative; isolation: isolate; width: var(--item-section); height: 100%;
            padding: 0; border: none; background: transparent; color: var(--color-10);
            font: inherit; font-weight: 700; cursor: pointer; }
        .gt-ictl button + button { border-left: var(--border-width) solid var(--border-color); }
        .gt-ictl button::before { content: ''; position: absolute; inset: 0; z-index: -1;
            background: var(--ictl); filter: brightness(var(--control-button-brightness)); }
    `;
    
    // Inject CSS into document head
    const style = document.createElement('style');
    style.id = `injector-${INJECTOR_ID}`;
    style.textContent = cssContent;
    document.head.appendChild(style);
})();