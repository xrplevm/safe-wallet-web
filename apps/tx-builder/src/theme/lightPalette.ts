import walletPalette from '@safe-global/theme/palettes/light.ts'

// The wallet palette, plus the keys that only the Transaction Builder uses.
const lightPalette = {
  ...walletPalette,
  background: {
    ...walletPalette.background,
    // Grey page, so the white cards stand out.
    default: walletPalette.background.main,
  },
  upload: {
    primary: walletPalette.primary.main,
  },
  code: {
    main: walletPalette.background.paper,
  },
}

export default lightPalette
