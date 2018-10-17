/**
 * Apply a color to the part of the console output that is generated by the logger. This concatenates previous output!
 * @param {Array} result - The initial output args
 * @param {object} data - The data object with all necessary runtine information
 * @param {object} data.config - The config that the logger was invoked with
 * @param {object} data.instance - A vue instance
 * @return {Array} The resulting output args
 */
export function localizeByVm(result, { config, instance }) {
    let { location } = config.context;

    if (!location && instance) {
        const tag = instance.$options._componentTag;
        const uid = instance._uid;

        location = tag ? `${ tag } #${ uid }` : `#${ uid }`;

        result.unshift(`[${ location }]`);
    }

    return result;
}
