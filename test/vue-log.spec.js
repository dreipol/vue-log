/* globals chai, Vue */
/* eslint-disable no-unused-expressions */

describe('global-logger', () => {
    const LogFactory = Vue.log;
    let spy = chai.spy((...args) => {
        console.log(args);
        console.log(...args);
    });

    beforeEach(function() {
        spy = chai.spy((...args) => {
            console.log(args);
            // console.log(...args);
        });
    });

    it('should be an accessible log constructor', () => {
        chai.assert.equal(typeof LogFactory, 'function');
    });

    it('should be able to create a logger instance with default log methods', () => {
        const Logger = LogFactory();
        chai.assert.equal(typeof Logger, 'object');
    });

    it('should call a console method', () => {
        const Log = LogFactory({
            levels: [{ name: 'foo', fn: spy }],
        });

        Log.foo('bar');

        chai.expect(spy).to.have.been.called.once;
        chai.expect(spy).to.have.been.called.with.exactly('bar');
    });

    it('should prepend a given location to the output', () => {
        const Log = LogFactory({
            levels: [{ name: 'foo', fn: spy }],
            context: { location: 'bar' },
        });
        Log.foo('baz');

        chai.expect(spy).to.have.been.called.once;
        chai.expect(spy).to.have.been.called.with.exactly('[bar]', 'baz');
    });

    it('should append multiple arguments with their original type', () => {
        const obj = { qux: 'quux' };
        const Log = LogFactory({
            levels: [{ name: 'foo', fn: spy }],
            context: { location: 'bar' },
        });
        Log.foo('baz', { qux: 'quux' }, ['corge', 'grault']);

        chai.expect(spy).to.have.been.called.once;
        chai.expect(spy).to.have.been.called.with.exactly('[bar]', 'baz', { qux: 'quux' }, ['corge', 'grault']);
    });

    it('should add a label to the output', () => {
        const Log = LogFactory({
            levels: [{ name: 'foo', fn: spy, label: 'qux' }],
            context: { location: 'bar' },
        });
        Log.foo('baz');

        chai.expect(spy).to.have.been.called.once;
        chai.expect(spy).to.have.been.called.with.exactly('qux', '[bar]', 'baz');
    });

    it('should print a color coded message when consumed by `window.console`', () => {
        const Log = LogFactory({
            levels: [{ name: 'foo', fn: spy, color: 'red' }],
            context: { location: 'bar' },
        });
        Log.foo('baz');

        chai.expect(spy).to.have.been.called.once;
        chai.expect(spy).to.have.been.called.with.exactly('%c[bar]', 'color: red', 'baz');
    });

    afterEach(function() {
        spy = null;
    });
});
