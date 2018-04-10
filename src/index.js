import { createConfig, createLogger } from '@dreipol/abstract-log';
import { presets as pluginPresets } from './presets';


/**
 * Install `vue-logger`
 */
let config;
const plugin = {};

plugin.install = function(Vue, presets) {
    if (plugin.installed) { return; }
    plugin.installed = true;

    config = createConfig(pluginPresets, presets);

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
