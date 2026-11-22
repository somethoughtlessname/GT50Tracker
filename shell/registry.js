(function() {
    // ===== CARD TYPE REGISTRY =====
    // Every comp-*.js file signs in here when it loads.
    // The shell only knows about card types that have registered,
    // so deleting a comp file simply removes that card type.
    //
    // GT50.register({
    //     type:  'list',              // saved in data, must be unique
    //     label: 'LIST',              // footer button text
    //     color: 'var(--color-1)',    // footer button color
    //     lib:   GT50Lib.List,        // needs defaultState, renderBuild, renderView
    //     about: { desc, color },     // optional: its entry in the Card Info window
    //     info:  function(state) {}   // optional: { title, done, text } for sort/filter/search
    // });

    window.GT50 = window.GT50 || {};
    window.GT50Lib = window.GT50Lib || {};

    const types = {};
    const order = [];

    window.GT50.register = function(def) {
        if (!def || !def.type || !def.lib) {
            console.warn('[GT50] register: needs type and lib', def);
            return;
        }
        const lib = def.lib;
        // renderView is optional: some types (Import) only exist in edit mode
        if (typeof lib.defaultState !== 'function' || typeof lib.renderBuild !== 'function') {
            console.warn('[GT50] register: ' + def.type + ' is missing defaultState/renderBuild');
            return;
        }
        if (!types[def.type]) order.push(def.type);
        types[def.type] = {
            type: def.type,
            label: def.label || def.type.toUpperCase(),
            color: def.color || 'var(--color-9)',
            lib: lib,
            // optional: info(state) -> { title, done, text } for sort, filter and search
            info: typeof def.info === 'function' ? def.info : defaultInfo,
            // optional: { desc, color } shown in the Card Info window while this file is installed
            about: def.about || null
        };
    };

    function defaultInfo(state) {
        const title = (state && state.title) || '';
        return { title: title, done: !!(state && state.completed), text: title };
    }

    // small shared helper for shell files that build HTML strings
    window.GT50.escapeHTML = function(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    };

    window.GT50.getType = function(type) {
        return types[type] || null;
    };

    window.GT50.listTypes = function() {
        return order.map(t => types[t]);
    };
})();
