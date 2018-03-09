export const presets = {
    logger: window.console,
    proxy: true,
    threshold: 'debug',
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
    loggerArgs({ level, vm, context }) {
        let { location } = context;
        const { label, color } = level;
        const loglevel = label ? `${ label } ` : '';
        const styles = color ? `color: ${ color }` : '';

        if (!location && vm) {
            const tag = vm.$options._componentTag;
            location = `${ tag ? `${ tag } #${ vm._uid }` : `#${ vm._uid }` }` || 'unknown';
        }

        return [
            `${ styles ? '%c' : '' }${ loglevel }[${ location }]`,
            styles,
        ];
    },
};
