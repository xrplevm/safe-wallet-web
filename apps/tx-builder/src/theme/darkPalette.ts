import walletPalette from '@safe-global/theme/palettes/dark.ts'

// The wallet palette, plus the keys that only the Transaction Builder uses.
const darkPalette = {
  ...walletPalette,
  upload: {
    primary: walletPalette.text.primary,
  },
  code: {
    main: 'rgba(0, 0, 0, 0)',
  },
}

export default darkPalette
