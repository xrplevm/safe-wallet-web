export const LATEST_SAFE_VERSION =
  process.env.NEXT_PUBLIC_SAFE_VERSION || process.env.EXPO_PUBLIC_SAFE_VERSION || '1.4.1'

// Risk mitigation (Blockaid)
export const BLOCKAID_API =
  process.env.NEXT_PUBLIC_BLOCKAID_API || process.env.EXPO_PUBLIC_BLOCKAID_API || 'https://client.blockaid.io'
export const BLOCKAID_CLIENT_ID =
  process.env.NEXT_PUBLIC_BLOCKAID_CLIENT_ID || process.env.EXPO_PUBLIC_BLOCKAID_CLIENT_ID || ''
// Risk mitigation (Hypernative)
export const HYPERNATIVE_API_BASE_URL =
  process.env.NEXT_PUBLIC_HYPERNATIVE_API_BASE_URL ||
  process.env.EXPO_PUBLIC_HYPERNATIVE_API_BASE_URL ||
  'https://api.hypernative.xyz'
// Access keys
export const INFURA_TOKEN = process.env.NEXT_PUBLIC_INFURA_TOKEN || process.env.EXPO_PUBLIC_INFURA_TOKEN || ''
// Safe Apps
export const SAFE_APPS_INFURA_TOKEN =
  process.env.NEXT_PUBLIC_SAFE_APPS_INFURA_TOKEN || process.env.EXPO_PUBLIC_SAFE_APPS_INFURA_TOKEN || INFURA_TOKEN

// Tenderly - API docs: https://www.notion.so/Simulate-API-Documentation-6f7009fe6d1a48c999ffeb7941efc104
export const TENDERLY_SIMULATE_ENDPOINT_URL =
  process.env.NEXT_PUBLIC_TENDERLY_SIMULATE_ENDPOINT_URL || process.env.EXPO_PUBLIC_TENDERLY_SIMULATE_ENDPOINT_URL || ''
export const TENDERLY_PROJECT_NAME =
  process.env.NEXT_PUBLIC_TENDERLY_PROJECT_NAME || process.env.EXPO_PUBLIC_TENDERLY_PROJECT_NAME || ''
export const TENDERLY_ORG_NAME =
  process.env.NEXT_PUBLIC_TENDERLY_ORG_NAME || process.env.EXPO_PUBLIC_TENDERLY_ORG_NAME || ''

// Help Center
export const HELP_CENTER_URL =
  process.env.NEXT_PUBLIC_HELP_CENTER_URL || process.env.EXPO_PUBLIC_HELP_CENTER_URL || 'https://docs.xrplevm.org'
// Every help topic opens the XRPL EVM docs root until topic-specific pages exist.
export const HelpCenterArticle = {
  ADDRESS_BOOK_DATA: HELP_CENTER_URL,
  ADVANCED_PARAMS: HELP_CENTER_URL,
  CANCELLING_TRANSACTIONS: HELP_CENTER_URL,
  COOKIES: HELP_CENTER_URL,
  CONFLICTING_TRANSACTIONS: HELP_CENTER_URL,
  FALLBACK_HANDLER: HELP_CENTER_URL,
  MOBILE_SAFE: HELP_CENTER_URL,
  RECOVERY: HELP_CENTER_URL,
  RELAYING: HELP_CENTER_URL,
  SAFE_SETUP: HELP_CENTER_URL,
  SIGNED_MESSAGES: HELP_CENTER_URL,
  SPAM_TOKENS: HELP_CENTER_URL,
  SPENDING_LIMITS: HELP_CENTER_URL,
  TRANSACTION_GUARD: HELP_CENTER_URL,
  UNEXPECTED_DELEGATE_CALL: HELP_CENTER_URL,
  PROPOSERS: HELP_CENTER_URL,
  PUSH_NOTIFICATIONS: HELP_CENTER_URL,
  SWAP_WIDGET_FEES: HELP_CENTER_URL,
  VERIFY_TX_DETAILS: HELP_CENTER_URL,
  BULK_IMPORT_OLD_DATA: HELP_CENTER_URL,
  SAFE_SHIELD: HELP_CENTER_URL,
  ADDRESS_POISONING: HELP_CENTER_URL,
} as const
export const HelperCenterArticleTitles = {
  RECOVERY: 'Learn more about the Account recovery process',
}
// Social
export const DISCORD_URL = 'https://discord.gg/xrplevm'
export const TWITTER_URL = 'https://x.com/RippleXDev'
export const SAFE_TO_L2_MIGRATION_VERSION = '1.4.1'
