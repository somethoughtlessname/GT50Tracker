(function() {
    // ===== FIT AND READABLE TEXT FIELDS (app shell) =====
    // For every text field in any card or window:
    //  1. Fit: if the placeholder (or the starting text) is wider than the
    //     field, the field's font size steps down until it fits (never below
    //     9px), so hints like "Number" are never cut off.
    //  2. Readable: the placeholder takes dark ink on light backgrounds and
    //     white on dark ones, picked by contrast against the color actually
    //     behind the field, instead of the same faint white everywhere.
    // Card files need no changes; cards brought back later get this too.
    window.GT50 = window.GT50 || {};

    const MIN_PX = 9;

    // number fields: no spinner arrows eating into the field (they cut hints like "Number")
    const style = document.createElement('style');
    style.textContent = `
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; appearance: textfield; }
    `;
    document.head.appendChild(style);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    function textWidth(text, cs, px) {
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${px}px ${cs.fontFamily}`;
        const spacing = parseFloat(cs.letterSpacing) || 0;
        return ctx.measureText(text).width + spacing * text.length;
    }

    function parseRGB(str) {
        const m = str && str.match(/rgba?\(([^)]+)\)/);
        if (!m) return null;
        const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
        return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    }
    function backgroundBehind(el) {
        for (let p = el; p && p.nodeType === 1; p = p.parentElement) {
            const c = parseRGB(getComputedStyle(p).backgroundColor);
            if (c && c.a > 0.5) return c;
        }
        return parseRGB(getComputedStyle(document.body).backgroundColor) || { r: 255, g: 255, b: 255 };
    }
    function luminance(c) {
        const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
        return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
    }

    function fit(input) {
        if (!input.isConnected || input.offsetWidth === 0) return;
        const cs = getComputedStyle(input);

        // readable placeholder: whichever of ink or white contrasts more with the background
        const L = luminance(backgroundBehind(input));
        const onWhite = (1.05) / (L + 0.05), onInk = (L + 0.05) / (0.0183 + 0.05);
        input.style.setProperty('--ph-color', onWhite >= onInk ? 'rgba(255,255,255,0.72)' : 'rgba(43,38,32,0.6)');

        // fit: size the font so the placeholder (and the text it starts with) fits
        if (input.dataset.gtBaseSize === undefined) {
            input.dataset.gtBaseSize = parseFloat(cs.fontSize);
            input.dataset.gtBaseInline = input.style.fontSize || '';   // keep the card's own size setting
        }
        const base = parseFloat(input.dataset.gtBaseSize);
        const outer = input.getBoundingClientRect().width
            - (parseFloat(cs.borderLeftWidth) || 0) - (parseFloat(cs.borderRightWidth) || 0)
            - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0) - 2;
        // number fields draw their text in a narrower inner box than the field itself
        const inner = input.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0) - 2;
        const avail = input.type === 'number' ? Math.min(outer, inner) : outer;
        if (avail <= 0) return;
        // placeholder may shrink as far as needed; typed text only a little
        // (long entries still scroll inside the field as before)
        const shrinkTo = (text, floor) => {
            let px = base;
            while (text && px > floor && textWidth(text, cs, px) > avail) px -= 0.5;
            return px;
        };
        const px = Math.min(
            shrinkTo(input.placeholder || '', MIN_PX),
            shrinkTo(input.dataset.gtFitValue || '', Math.max(MIN_PX, base * 0.8))
        );
        input.style.fontSize = px === base ? input.dataset.gtBaseInline : px + 'px';
    }

    function fields(root) {
        if (root.nodeType !== 1) return [];
        const sel = 'input[type="text"], input:not([type]), input[type="number"], input[type="search"]';
        const list = root.matches && root.matches(sel) ? [root] : [];
        return list.concat([...root.querySelectorAll(sel)]);
    }

    let queued = new Set(), scheduled = false;
    function queue(els) {
        els.forEach(e => queued.add(e));
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            const batch = [...queued];
            queued = new Set();
            batch.forEach(input => {
                // the text a field starts with also counts, so it isn't clipped either
                if (input.dataset.gtFitValue === undefined) input.dataset.gtFitValue = input.value || '';
                fit(input);
            });
        });
    }

    function start() {
        queue(fields(document.body));
        new MutationObserver(list => {
            list.forEach(m => m.addedNodes.forEach(n => queue(fields(n))));
        }).observe(document.body, { childList: true, subtree: true });
        window.addEventListener('resize', () => {
            document.querySelectorAll('input').forEach(i => { delete i.dataset.gtFitValue; });
            queue(fields(document.body));
        });
    }

    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start);
})();
