import typescript from 'rollup-plugin-typescript2'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'))

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'BarcodeGenerator',
      exports: 'named',
      sourcemap: true,
      globals: {
        // 如果有外部依赖，在这里定义全局变量名
      },
    },
  ],
  external: [
    // 在这里列出外部依赖，它们不会被打包进最终文件
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript({
      clean: true,
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          target: 'ES2018',
          module: 'ESNext',
          declaration: true,
          declarationDir: 'dist',
        },
        exclude: [
          'tests/**/*',
          'examples/**/*',
          '**/*.test.ts',
          '**/*.spec.ts',
        ],
      },
    }),
  ],
}
