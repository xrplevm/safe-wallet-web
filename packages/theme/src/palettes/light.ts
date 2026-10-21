import type { ColorPalette } from './types'

/**
 * Unified light mode color palette.
 * Merged from web and mobile palettes with mobile's extended colors as the base.
 */
const lightPalette: ColorPalette = {
  text: {
    primary: '#000000',
    secondary: '#A1A3A7',
    disabled: '#DDDEE0',
    contrast: '#FFFFFF',
  },
  primary: {
    dark: '#5B13BF',
    main: '#7919FF',
    light: '#636669',
  },
  secondary: {
    dark: '#7919FF',
    main: '#C890FF',
    light: '#E4C8FF',
    background: '#F7EEFF',
  },
  border: {
    main: '#A1A3A7',
    light: '#DCDEE0',
    background: '#F4F4F4',
  },
  error: {
    dark: '#8A1C27',
    main: '#FF5F72',
    light: '#F79BA7',
    background: '#FFE0E6',
  },
  error1: {
    main: '#FFE0E6',
    contrastText: '#8A1C27',
  },
  success: {
    dark: '#1C5538',
    main: '#00B460',
    light: '#84D9A0',
    background: '#CBF2DB',
  },
  info: {
    dark: '#15566A',
    main: '#00BFE5',
    light: '#78D2E7',
    background: '#CEF0FD',
  },
  warning: {
    dark: '#6C2D19',
    main: '#FF8C00',
    light: '#F9B37C',
    background: '#FFECC2',
  },
  warning1: {
    main: '#FFECC2',
    text: '#6C2D19',
    contrastText: '#FF8C00',
  },
  background: {
    default: '#FFFFFF',
    main: '#F4F4F4',
    sheet: '#F4F4F4',
    paper: '#FFFFFF',
    light: '#F7EEFF',
    secondary: '#DDDEE0',
    skeleton: 'rgba(0, 0, 0, 0.04)',
    disabled: '#7878801F',
  },
  backdrop: {
    main: '#636669',
  },
  logo: {
    main: '#000000',
    background: '#EEEFF0',
  },
  static: {
    main: '#000000',
    light: '#636669',
    primary: '#FFFFFF',
    textSecondary: '#A1A3A7',
    textBrand: '#32E685',
  },
}

export default lightPalette
