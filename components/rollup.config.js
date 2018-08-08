import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import replace from 'rollup-plugin-replace'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: 'src/index.js',
  output: {
    file: 'umd/bundle.js',
    format: 'umd',
    name: 'PayloadComponents',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  // All the used libs needs to be here
  external: ['react', 'react-dom'],
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    postcss(),
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    uglify(),
  ],
}
