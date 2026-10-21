import type { ColorPalette } from './types'

/**
 * Unified dark mode color palette.
 * Merged from web and mobile palettes with mobile's extended colors as the base.
 */
const darkPalette: ColorPalette = {
  text: {
    primary: '#FFFFFF',
    secondary: '#636669',
    disabled: '#636669',
    contrast: '#000000',
  },
  primary: {
    dark: '#23A15D',
    main: '#32E685',
    light: '#A1A3A7',
  },
  secondary: {
    dark: '#636669',
    main: '#FFFFFF',
    light: '#C890FF',
    background: '#2A2A2A',
  },
  border: {
    main: '#636669',
    light: '#2A2A2A',
    background: '#000000',
  },
  error: {
    dark: '#FFE0E6',
    main: '#FF5F72',
    light: '#4A2125',
    background: '#4A2125',
  },
  error1: {
    main: '#4A2125',
    contrastText: '#FFE0E6',
  },
  success: {
    dark: '#DEFDEA',
    main: '#00B460',
    light: '#3B7A54',
    background: '#173026',
  },
  info: {
    dark: '#D9F4FB',
    main: '#00BFE5',
    light: '#458898',
    background: '#203339',
  },
  warning: {
    dark: '#FFE4CB',
    main: '#FF8C00',
    light: '#A65F34',
    background: '#4A3621',
  },
  warning1: {
    main: '#4A3621',
    text: '#FFE4CB',
    contrastText: '#FF8C00',
  },
  background: {
    default: '#000000',
    main: '#000000',
    sheet: '#000000',
    paper: '#1C1C1C',
    light: '#2A2A2A',
    secondary: '#2A2A2A',
    skeleton: 'rgba(255, 255, 255, 0.04)',
    disabled: '#7878801F',
  },
  backdrop: {
    main: '#636669',
  },
  logo: {
    main: '#FFFFFF',
    background: '#2A2A2A',
  },
  static: {
    main: '#000000',
    light: '#636669',
    primary: '#FFFFFF',
    textSecondary: '#A1A3A7',
    textBrand: '#32E685',
  },
}

export default darkPalette
