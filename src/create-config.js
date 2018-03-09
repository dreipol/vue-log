import { presets } from './presets';


export function createConfig(...cfg) {
    return Object.assign({}, presets, ...cfg);
};
