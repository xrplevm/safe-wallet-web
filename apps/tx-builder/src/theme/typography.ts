import type { TypographyOptions } from '@mui/material/styles/createTypography'
import { fontFamily, typographyVariants } from '@safe-global/theme/tokens/typography.ts'

type Variant = (typeof typographyVariants)[keyof typeof typographyVariants]

const px = (value: number) => `${value}px`

const toMui = ({ fontSize, lineHeight, ...rest }: Variant) => ({
  ...rest,
  fontSize: px(fontSize),
  lineHeight: px(lineHeight),
  ...('letterSpacing' in rest && { letterSpacing: px(rest.letterSpacing) }),
})

// The wallet typography tokens, in the px strings that MUI expects.
const typography: TypographyOptions = {
  fontFamily,
  h1: toMui(typographyVariants.h1),
  h2: toMui(typographyVariants.h2),
  h3: toMui(typographyVariants.h3),
  h4: toMui(typographyVariants.h4),
  h5: toMui(typographyVariants.h5),
  body1: toMui(typographyVariants.body1),
  body2: toMui(typographyVariants.body2),
  caption: toMui(typographyVariants.caption),
  overline: toMui(typographyVariants.overline),
}

export default typography
