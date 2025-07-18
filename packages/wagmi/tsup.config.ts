import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'connectors/miniProgram': 'connectors/miniProgram/index.ts',
    'connectors/binanceWallet': 'connectors/binanceWallet/index.ts',
    'connectors/blocto': 'connectors/blocto/index.ts',
    'connectors/trustWallet': 'connectors/trustWallet/index.ts',
    'connectors/kastleWallet': 'connectors/kastleWallet/index.ts',
    'connectors/kasKeeper': 'connectors/kasKeeper/index.ts',
    'connectors/kasWare': 'connectors/kasWare/index.ts',
  },
  treeshake: true,
  splitting: true,
  format: ['esm', 'cjs'],
  dts: true,
})
