import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.js',
  output: {
    strict: false,
    file: 'dist/index.js',
    sourcemap: true,
    format: 'cjs',
  },
  plugins: [
    json(),
    commonjs(),
    resolve(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
  ],
  external: [
    '@babel/parser',
    '@babel/traverse',
    '@babel/types',
    '@babel/generator',
  ],
};
