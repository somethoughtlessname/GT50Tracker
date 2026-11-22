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
    //     lib:   GT50Lib.List         // needs defaultState, renderBuild, renderView
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
        if (typeof lib.defaultState !== 'function' ||
            typeof lib.renderBuild !== 'function' ||
            typeof lib.renderView !== 'function') {
            console.warn('[GT50] register: ' + def.type + ' is missing defaultState/renderBuild/renderView');
            return;
        }
        if (!types[def.type]) order.push(def.type);
        types[def.type] = {
            type: def.type,
            label: def.label || def.type.toUpperCase(),
            color: def.color || 'var(--color-9)',
            lib: lib
        };
    };

    window.GT50.getType = function(type) {
        return types[type] || null;
    };

    window.GT50.listTypes = function() {
        return order.map(t => types[t]);
    };
})();
