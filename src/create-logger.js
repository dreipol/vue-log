/**
 * Just a noop
 */
function noop() {
    // NOTE: Intentionally do nothing
}

/**
 * Define loggers for vue instances
 * @param {Object} target - The host object
 * @param {Object} config - A config object for the logger instance
 * @param {Object} vm - A vue component instance that is allowed to influence part of the logging string
 * @return {Function} The original target object enhanced with a logger instance
 */
export function createLogger(target, config, vm) {
    const { logger, proxy, levels, loggerArgs, context, filter } = config;

    return levels.reduce((host, level) => {
        return Object.defineProperty(host, level.name, {
            get() {
                if (!level.fn || !filter({ config, level, vm })) {
                    return noop;
                }

                if (proxy) {
                    const args = loggerArgs({ level, config, vm });
                    return level.fn.bind(logger, ...args);
                }

                return function(...statements) {
                    const args = loggerArgs({ level, config, vm, statements });
                    level.fn.call(logger, ...args);
                };
            },
        });
    }, target);
}
