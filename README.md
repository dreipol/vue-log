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
You can pass the following options keys:

### `@property logger {Object}`
The log methods will be bound to this property as `this` value.

### `@property loggerArgs {Function}`
The log output is controlled by passing a method to `loggerArgs`. As the only argument, the function will receive an 
object with the following keys:

#### `@param o.config {Object}`
The logger's configuration object.

#### `@param o.level {Object}`
The invoked log level's config object that was passed within the `levels` config key.

#### `@param o.vm {ViewModel}`
When used within a vue component, the component instance that invoked the log method is passed as `vm`.

#### `@param o.statements {Array}`
This property is only defined, when `proxy` is set to `false`! <br> 
The array contains the arguments that the log method has been invoked with.

#### `@return {Array}`
The method's output is expected to be an array that is passed to the log method as an arglist.

### `@property proxy {boolean}`
When this value is set to true, the log method will be directly bound to the `logger` value. You will lose the access 
to the log method arguments in the `loggerArgs` method. This is necessary for exmaple to ensure that stack traces in 
the console will maintain their original value instead of being bound to this plugin. <br> 
If you don't use console logs or don't need original stack traces, you can disable this option and gain
the ability to customize your log messages according to the passed arguments.

### `@param context {any}`
A completely customizable property that has been passed in the config when creating the logger.

### `@property levels {Array}`
A list of log level objects that can be invoked by the logger. Each log level must contain at least the following keys:

#### `@property fn {Function}`
The log method that is being used by the log level.

#### `@property name {string}`
The logger will have a function of this name to invoke a log message.

### `@property filter {Function}`
A method that receives the same object as the `loggerArgs` method. <br>
The log message will be hidden in case of a falsey return value. 

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
        loggerArgs({ level, config }) {
            const result = [];
            const { isCriticalError } = level;
            
            if (isCriticalError) {
                result.push('WARNING!!!');
            }
            
            return result;
        }
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
        loggerArgs({ level, config, statements }) {
            return [
                {
                    category: 'vue-log',
                    level: level.name,
                    data: {
                        message: statements.toString ? statements.toString() : '',
                        ...config.context,
                    },
                },
            ];
        },
    });
``` 

## 
[travis-image]: https://img.shields.io/travis/dreipol/vue-log.svg?style=flat-square
[travis-url]: https://travis-ci.org/dreipol/vue-log
[license-image]: http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]: LICENSE
[npm-version-image]: http://img.shields.io/npm/v/dreipol/vue-log.svg?style=flat-square
[npm-downloads-image]: http://img.shields.io/npm/dm/dreipol/vue-log.svg?style=flat-square
[npm-url]: https://npmjs.org/package/dreipol/vue-log
