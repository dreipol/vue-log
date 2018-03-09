import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';


export default {
    input: 'src/index.js',
    plugins: [
        resolve({
            jsnext: true,
        }),
        buble({
            objectAssign: 'Object.assign',
        }),
        commonjs(),
    ],
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
        },
    ],
};
