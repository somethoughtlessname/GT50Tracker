(function() {
    // ===== ROUNDED ICONS (app shell) =====
    // Card files draw their move, delete and open/close buttons with the text
    // glyphs ▲ ▼ × + −. Only a glyph standing alone is swapped, so labels like
    // "+ Add Objective" keep their text.
    // This swaps every such glyph, in any card or window, for a drawn icon with
    // rounded ends. Up, down and × come out the same size within a button, sized
    // from the button's height. Card files need no changes, and a card brought
    // back from parked/ gets the same icons automatically.
    window.GT50 = window.GT50 || {};

    // All of them are drawn to the same outer width (19 of 24 units, counting the
    // line ends), so ▲ ▼ × + − match side by side
    const ICONS = {
        '▲': '<path d="M12 5.5 L19.75 18.5 H4.25 Z" fill="currentColor" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>',
        '▼': '<path d="M12 18.5 L19.75 5.5 H4.25 Z" fill="currentColor" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>',
        '×': '<path d="M4.75 4.75 L19.25 19.25 M19.25 4.75 L4.75 19.25" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>',
        // + and − use the same line weight and round ends as ×, so they read as one set
        '+': '<path d="M12 4.75 V19.25 M4.75 12 H19.25" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>',
        '−': '<path d="M4.75 12 H19.25" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>',
        // the checkbox marks: * (partly done) and ✓ (done), same width, weight and round ends
        '*': '<path d="M4.75 12 H19.25 M8.4 5.7 L15.6 18.3 M15.6 5.7 L8.4 18.3" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>',
        '✓': '<path d="M4.75 12.5 L9.75 17.5 L19.25 6.5" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>'
    };
    const GLYPHS = Object.keys(ICONS);

    // Size from the part of the button you can see, so the open/close square,
    // ▲ ▼ and × in one row all get the same icon size
    function sizeFor(el) {
        let target = el;
        while (target && target !== document.body && !target.getBoundingClientRect().height) target = target.parentElement;
        if (!target || target === document.body) return 14;
        const r = target.getBoundingClientRect();
        let top = r.top, bottom = r.bottom;
        const clip = clipBox(target);
        if (clip) { top = Math.max(top, clip.top); bottom = Math.min(bottom, clip.bottom); }
        const h = bottom - top;
        if (h <= 0) return 14;
        return Math.max(10, Math.min(18, Math.round(h * 0.4)));
    }

    function swap(node) {
        const glyph = node.nodeValue.trim();
        if (GLYPHS.indexOf(glyph) === -1) return;
        const parent = node.parentElement;
        if (!parent || parent.closest('input, textarea, [data-no-icon]')) return;
        const size = sizeFor(parent);
        const span = document.createElement('span');
        span.className = 'gt-icon';
        span.setAttribute('aria-hidden', 'true');
        span.style.cssText = `display:inline-flex; position:relative; width:${size}px; height:${size}px; pointer-events:none; vertical-align:middle;`;
        span.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="display:block">${ICONS[glyph]}</svg>`;
        node.parentNode.replaceChild(span, node);
        // a button whose label is now only an icon: center it
        if (/^(BUTTON|DIV)$/.test(parent.tagName) && !parent.style.display) {
            parent.style.display = 'flex';
            parent.style.alignItems = 'center';
            parent.style.justifyContent = 'center';
        }
        center(span, parent);
    }

    // Center on the part of the button you can actually see: some buttons run
    // under their card's border or past a clipped edge, and their own borders
    // take space on one side, so plain centering sits the icon off-center
    function clipBox(el) {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            const o = getComputedStyle(p).overflow;
            if (o === 'hidden' || o === 'clip') {
                const r = p.getBoundingClientRect();
                return { top: r.top + p.clientTop, bottom: r.top + p.clientTop + p.clientHeight,
                         left: r.left + p.clientLeft, right: r.left + p.clientLeft + p.clientWidth };
            }
        }
        return null;
    }
    function center(span, button) {
        const b = button.getBoundingClientRect();
        if (!b.height) return;
        let top = b.top + button.clientTop, bottom = top + button.clientHeight;
        let left = b.left + button.clientLeft, right = left + button.clientWidth;
        const clip = clipBox(button);
        if (clip) {
            top = Math.max(top, clip.top); bottom = Math.min(bottom, clip.bottom);
            left = Math.max(left, clip.left); right = Math.min(right, clip.right);
        }
        const i = span.getBoundingClientRect();
        const dy = (top + bottom) / 2 - (i.top + i.height / 2);
        const dx = (left + right) / 2 - (i.left + i.width / 2);
        if (Math.abs(dx) > 0.25 || Math.abs(dy) > 0.25) {
            span.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        }
    }

    function scan(root) {
        if (root.nodeType === 3) { swap(root); return; }
        if (root.nodeType !== 1) return;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: n => GLYPHS.indexOf(n.nodeValue.trim()) !== -1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        });
        const found = [];
        while (walker.nextNode()) found.push(walker.currentNode);
        found.forEach(swap);
    }

    function start() {
        scan(document.body);
        new MutationObserver(list => {
            list.forEach(m => {
                if (m.type === 'characterData') swap(m.target);
                else m.addedNodes.forEach(scan);
            });
        }).observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start);
})();
