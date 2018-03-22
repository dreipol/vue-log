export const presets = {
    logger: window.console,
    proxy: true,
    context: {},
    filter: () => true,
    levels: [
        {
            name: 'debug',
            fn: window.console.debug,
            label: '🗒',
            color: 'grey',
        },
        {
            name: 'log',
            fn: window.console.log,
            label: '📎',
            color: 'grey',
        },
        {
            name: 'info',
            fn: window.console.info,
            label: '💎️',
            color: '#6060BA',
        },
        {
            name: 'warn',
            fn: window.console.warn,
            label: '',
            color: '#817123',
        },
        {
            name: 'error',
            fn: window.console.error,
            label: '',
            color: '#A16666',
        },
    ],
    loggerArgs({ level, vm, config }) {
        const result = [];
        let { location } = config.context;
        const { label, color } = level;
        const styles = color ? `color: ${ color }` : '';

        if (!location && vm) {
            const tag = vm.$options._componentTag;
            location = `${ tag ? `${ tag } #${ vm._uid }` : `#${ vm._uid }` }` || 'unknown';
        }

        if (styles || label || location) {
            result.push([
                styles ? '%c' : '',
                label ? `${ label } ` : '',
                location ? `[${ location }]` : '',
            ].join(''));

            if (styles) {
                result.push(styles);
            }
        }

        return result;
    },
};
