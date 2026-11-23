// === shell/parts.js ===
// Shared card parts. Card files build these pieces from here instead of
// writing their own copy, so every card type draws them the same way.
// The look lives in shell/styles.js (the "CARD PARTS" section).
(function() {
    window.GT50 = window.GT50 || {};

    GT50.parts = {
        // The ▲ ▼ × buttons on the right of an item row inside a card's dropdown
        // (Checklist, List, Radio, Tier, Threshold). `color` is the row's color;
        // the buttons sit a shade darker than it.
        itemControls: function(idx, color) {
            return `<div class="gt-ictl" style="--ictl: ${color || 'var(--bg-3)'}">`
                + `<button type="button" data-action="move-up" data-idx="${idx}" aria-label="Move up">▲</button>`
                + `<button type="button" data-action="move-down" data-idx="${idx}" aria-label="Move down">▼</button>`
                + `<button type="button" data-action="delete" data-idx="${idx}" aria-label="Delete">×</button>`
                + `</div>`;
        }
    };
})();
