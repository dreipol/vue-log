import { createConfig, colorize, iconize, localize } from '@dreipol/abstract-log';
import { localizeByVm } from './middlewares';


export const presets = createConfig({
    middlewares: [localize, localizeByVm, iconize, colorize],
});
