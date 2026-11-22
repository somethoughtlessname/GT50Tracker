(function() {
    // ===== SHELL UTILITIES =====
    window.GT50 = window.GT50 || {};

    window.GT50.Utils = {
        escapeHTML: function(str) {
            return String(str == null ? '' : str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },

        // localStorage can throw (private mode, embedded previews) — never let it break the app
        load: function(key) {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                console.warn('[GT50] load failed', e);
                return null;
            }
        },

        save: function(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                console.warn('[GT50] save failed', e);
            }
        },

        debounce: function(fn, ms) {
            let t = null;
            return function() {
                clearTimeout(t);
                t = setTimeout(fn, ms);
            };
        }
    };
})();
