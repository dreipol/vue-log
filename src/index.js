import { createConfig } from './create-config';
import { createLogger } from './create-logger';


/**
 * Install `vue-logger`
 */
let config;
const plugin = {};

plugin.install = function(Vue, presets) {
    if (plugin.installed) { return; }
    plugin.installed = true;

    config = createConfig(presets);

    // Add logger to vue components
    Object.defineProperty(Vue.prototype, '$log', {
        get() {
            return createLogger({}, config, this);
        },
    });

    // Add general logger and logging creator to vue components
    Object.defineProperty(Vue, 'log', {
        get() {
            const log = options => createLogger({}, createConfig(config, options));
            return createLogger(log, config);
        },
    });
};


export default plugin;
