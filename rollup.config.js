import commonjs from '@rollup/plugin-commonjs'
import multi from '@rollup/plugin-multi-entry'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import minimist from 'minimist'
import copy from 'rollup-plugin-copy'
import livereload from 'rollup-plugin-livereload'
import css from 'rollup-plugin-scss'
import terser from 'rollup-plugin-terser'
import pkg from './package.json'

const {
  l: live = false,
  w: watch = false
} = minimist(process.argv)

const external = [
  '@scola/lib',
  'busboy',
  'crypto',
  'fs-extra',
  'ioredis',
  'msgpack-lite'
]

const name = pkg.name
  .split('/')
  .pop()

const names = {
  '@scola/lib': 'scola'
}

const plugins = [
  commonjs(),
  multi(),
  resolve({
    mainFields: [
      'browser',
      'main',
      'module'
    ],
    preferBuiltins: false
  })
]

const env = {
  input: './src/**/*env.ts',
  output: {
    file: './dist/js/env.js',
    format: 'umd'
  },
  plugins: [
    multi(),
    resolve()
  ]
}

const esm = {
  external,
  input: './src/**/*esm.ts',
  output: [
    {
      dir: './',
      entryFileNames: `dist/js/${name}.esm.js`,
      format: 'esm'
    }
  ],
  plugins: [
    ...plugins,
    typescript({
      declaration: true,
      declarationDir: 'types/'
    })
  ]
}

const umd = {
  external,
  input: './src/**/*umd.ts',
  output: [
    {
      file: `dist/js/${name}.umd.js`,
      format: 'umd',
      globals: (g) => names[g] || g.replace(/\W/g, ''),
      name: 'scola'
    }
  ],
  plugins: [
    ...plugins,
    css({
      output: `./dist/css/${name}.css`,
      outputStyle: watch === undefined ? 'compressed' : 'nested'
    }),
    copy({
      targets: [
        {
          src: './node_modules/ionicons/dist/fonts/*',
          dest: './dist/fonts/'
        }
      ]
    }),
    typescript(),
    watch ? {} : terser.terser(),
    !live ? {} : livereload('dist')
  ]
}

export default [
  env,
  esm,
  umd
].filter((v) => v)
