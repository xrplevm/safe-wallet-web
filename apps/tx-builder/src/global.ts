import { createGlobalStyle } from 'styled-components'
import WorkSansLatinFont from './assets/fonts/WorkSans-latin.woff2'
import WorkSansLatinExtFont from './assets/fonts/WorkSans-latin-ext.woff2'

const GlobalStyle = createGlobalStyle`
    html {
        height: 100%
    }

    body {
       height: 100%;
       margin: 0px;
       padding: 0px;
       background-color: #F6F6F6;
    }

    #root {
        height: 100%;
    }
    
    @font-face {
        font-family: 'Work Sans';
        font-style: normal;
        font-display: swap;
        font-weight: 400 600;
        src: url(${WorkSansLatinExtFont}) format('woff2');
        unicode-range:
            U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F,
            U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
    }

    @font-face {
        font-family: 'Work Sans';
        font-style: normal;
        font-display: swap;
        font-weight: 400 600;
        src: url(${WorkSansLatinFont}) format('woff2');
        unicode-range:
            U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC,
            U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus, 
    input:-webkit-autofill:active {
        box-shadow: 0 0 0 30px white inset !important;
        -webkit-box-shadow: 0 0 0 30px white inset !important;
    }

    && {
        .MuiButton-root {
            height: 46px !important;
        }
    
        .MuiFormControl-root  {
            min-height: 82px;
            margin-bottom: 0;
        }

        .MuiTooltip-tooltip {
            border: 0 !important;
        }
    }

    * {
        scrollbar-width: thin;
        scrollbar-color: #B2BBC0 #f6f6f6;
    }

    *::-webkit-scrollbar {
        width: 5px;
    }

    *::-webkit-scrollbar-track {
        background: #f6f6f6;
    }

    *::-webkit-scrollbar-thumb {
        background-color: #B2BBC0;
        border-radius: 20px;
        border: 3px solid #B2BBC0;
    }
`

export default GlobalStyle
