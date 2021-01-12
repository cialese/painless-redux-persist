import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import pkg from './package.json';

export default [
  {
    input: 'src/local/index.js',
    output: [
      {
        name: 'index',
        file: `${pkg.browser}/local/index.js`,
        format: 'umd',
      },
    ],
    plugins: [
      resolve(),
      eslint({
        throwOnError: true,
      }),
      injectProcessEnv({
        STORAGE_TYPE: 'localStorage'
      }),
      terser(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
  {
    input: 'src/session/index.js',
    output: [
      {
        name: 'index',
        file: `${pkg.browser}/session/index.js`,
        format: 'umd',
      },
    ],
    plugins: [
      resolve(),
      eslint({
        throwOnError: true,
      }),
      injectProcessEnv({
        STORAGE_TYPE: 'sessionStorage'
      }),
      terser(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
  },
];

