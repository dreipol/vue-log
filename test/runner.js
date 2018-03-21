require('jsdom-global')();

const chai = require('chai');
const chaiSpies = require('chai-spies');
chai.use(require('chai-spies'));

const Vue = require('vue');
const VueLog = require('../dist');
Vue.use(VueLog, {});

global.chai = chai;
global.Vue = require('vue');

Vue.config.devtools = false;
Vue.config.productionTip = false;

describe('vue-log', () => {
    require('./global-logger.spec');

    afterEach(() => {
    });
});
