export default {
  entry: 'main.ts',
  cjs: {
    type: 'rollup',
    file: 'cjs',
    minify: false,
  },
  target:'node',
}