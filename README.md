# vue-log

This npm package provides a system of log enhancements for vue applications.

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]

## Purpose
*vue-log* enables you to implement multiple log levels with enhanced and coloured messages based on your environment.
For example, you can log coloured debug messages to the console, discerning between sibling vue components in a list.
In production you can send the same messages to your error reporting framework (for example Sentry/Raven) as
breadcrumbs in case of an error occuring.

## Quickstart

1.  Install the module

    ```bash
    npm install -S @dreipol/vue-log
    ```

2.  Register the plugin to your Vue instance

    ```js
    import VueLog from '@dreipol/vue-log';
    Vue.use(VueLog);
    ```

3.  Start logging!

    ```js
    // As a global instance
    const Log = Vue.log();

    function isPrimary(color) {
        if (!color) {
            Log.error(`Uh oh, no color was provided. That doesn't look right...`);
        }

        return ['red', 'green', 'blue'].indexOf(color) > -1;
    }

    // In a component: my-favourite-color
    export default {
        props: {
            color: String
        },
        mounted() {
            this.$log.debug('Component mounted!');

            if (isPrimary(this.color)) {
                this.$log.info('Favourite color is a primary color');
            } else {
                this.$log.warn(`Favourite color is no primary color, but that's ok... We don't judge!`);
            }
        }
    }
    ```

## Config
You have multiple options to add a config either globally or when creating a new Logger.

### Global config
When installing the plugin you may add a second parameter to extend the original presets. The new config will be used
in two different ways:

- As a preset whenever you create a new log instance explicitly (by using `Vue.log`)
- As the config when creating a log instance implicitly (by using `this.$log` in a vue component)

```js
    Vue.use(VueLog, { /* vue-log config */ });
```

### Local config
For every log instance that you create explicitly (by using `Vue.log`), you can add a config object that will extend
the global config.

```js
    const Log = Vue.log({ /* vue-log config */ });
```

## Config object
For a detailed description of the config object, please see the
[abstract-log documentation](https://github.com/dreipol/abstract-log#config).

## Environments
Switching between development and production code can be done like in many similar situations:

```js
    Vue.use(VueLog, process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig);
```

## Examples

### Logging to the console
Console output should work out of the box with the default preset.

### Custom log messages
You can greatly customize your log messages by extending the log config object:

```js
    Vue.use(VueLog, {
        logger: window.console,
        levels: [
            {
                name: 'log',
                fn: window.console.log,
                isCriticalError: false
            },
            {
                name: 'error',
                fn: window.console.error,
                isCriticalError: true
            },
        ],
        middlewares: [
            (result, { level, config }) => {
                const { isCriticalError } = level;

                if (isCriticalError) {
                    result.unshift('WARNING!!!');
                }

                return result;
            }
        ],
    });
```

### Filter log levels
To filter below a certain threshold, you can use the `filter` property:

```js
    const LOG_THRESHOLD = 'info';

    Vue.use(VueLog, {
        filter({ config, level }) {
            const logIndex = config.levels.findIndex(l => l.name === level.name);
            const thresholdIndex = config.levels.findIndex(l => l.name === LOG_THRESHOLD);

            return logIndex >= thresholdIndex;
        }
    });
```

### Sentry
[Sentry](https://sentry.io/welcome/) is a real-time crash reporting service. Its frontend reporting library is called
*Raven*. When a javascript error occurs, Raven will report it to Sentry. You can add valuable debug information by
storing what happened before the error occured:

```js
    const { captureBreadcrumb } = window.Raven || {};

    Vue.use(VueLog, {
        logger: window.Raven,
        proxy: false,
        levels: [
            { name: 'debug', fn: captureBreadcrumb },
            { name: 'info', fn: captureBreadcrumb },
            { name: 'warn', fn: captureBreadcrumb },
            { name: 'error', fn: captureBreadcrumb },
        ],
        middlewares: [
            (result { level, config, statements }) {
                result.push([
                    {
                        category: 'vue-log',
                        level: level.name,
                        data: {
                            message: statements.toString ? statements.toString() : '',
                            ...config.context,
                        },
                    },
                ]);

                return result;
            }
        ]
    });
```

##
[travis-image]: https://img.shields.io/travis/dreipol/vue-log.svg?style=flat-square
[travis-url]: https://travis-ci.org/dreipol/vue-log
[license-image]: http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]: LICENSE
[npm-version-image]: http://img.shields.io/npm/v/@dreipol/vue-log.svg?style=flat-square
[npm-downloads-image]: http://img.shields.io/npm/dm/@dreipol/vue-log.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@dreipol/vue-log
