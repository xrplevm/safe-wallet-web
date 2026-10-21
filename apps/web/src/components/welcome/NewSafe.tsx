import React from 'react'
import { Typography } from '@mui/material'
import css from './styles.module.css'
import WelcomeLogin from './WelcomeLogin'
import BrandLogo from '@/public/images/brand/logo.svg'
import { BRAND_NAME } from '@/config/constants'
import footerCss from './welcomeFooter.module.css'
import Footer from '../common/Footer'

const NewSafe = () => {
  return (
    <div className={css.loginPage}>
      <div className={css.leftSide}>
        <div className={css.logoContainer}>
          <BrandLogo className={css.logo} aria-label={BRAND_NAME} />
        </div>
        <div className={css.loginContainer}>
          <WelcomeLogin />
        </div>
        <Footer forceShow helpCenter={false} preferences={false} className={footerCss.footer} />
      </div>

      <div className={css.rightSide}>
        <div className={css.rightContent}>
          <Typography className={css.label}>FOR ORGANIZATIONS AND POWER USERS</Typography>
          <Typography className={css.mainTitle}>Own your assets onchain securely</Typography>
        </div>
        <div className={css.mockupImageContainer}>
          <img src="/images/brand/welcome.png" alt="" className={css.mockupImage} />
        </div>
      </div>
    </div>
  )
}

export default NewSafe
