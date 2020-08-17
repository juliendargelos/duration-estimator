import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import cleaner from 'rollup-plugin-cleaner'
import ts from 'rollup-plugin-ts'
import { terser } from 'rollup-plugin-terser'
import { eslint } from 'rollup-plugin-eslint'

import pkg from './package.json'

const name = pkg.name
  .split(/[^a-z0-9]+/i)
  .map(part => part && part[0].toUpperCase() + part.slice(1))
  .join('')

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true }
    ],
    plugins: [
      eslint(),
      ts(),
      cleaner({ targets: [pkg.main.replace(/\/[^\/]+$/, '')] }),
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
      name,
      footer: `
        (function (global) {
          if (typeof global.${name} === 'undefined') return
          global.${name} = global.${name}.${name}
        })(typeof globalThis === 'undefined' ? window : globalThis)
      `
    },
    plugins: [
      ts({
        transpileOnly: true,
        tsconfig: tsconfig => ({ ...tsconfig, target: 'es5' })
      }),
      nodeResolve({ extensions: ['.ts', '.js'] }),
      commonjs(),
      terser()
    ]
  }
]
