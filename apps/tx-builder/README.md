# Transaction Builder

A Safe App that allows users to compose custom contract interactions and batch them into a single transaction.

## Development

### Prerequisites

- Node.js 20+
- Yarn 4 (via corepack)

### Setup

```bash
# From monorepo root
yarn install

# Start development server
yarn workspace @safe-global/tx-builder dev
```

The app will be available at `http://localhost:3000/tx-builder/`

### Commands

| Command                                             | Description      |
| --------------------------------------------------- | ---------------- |
| `yarn workspace @safe-global/tx-builder dev`        | Start dev server |
| `yarn workspace @safe-global/tx-builder build`      | Production build |
| `yarn workspace @safe-global/tx-builder test`       | Run unit tests   |
| `yarn workspace @safe-global/tx-builder lint`       | Run ESLint       |
| `yarn workspace @safe-global/tx-builder type-check` | TypeScript check |

## Testing

### Unit Tests

Unit tests use Jest with React Testing Library:

```bash
yarn workspace @safe-global/tx-builder test
```

### E2E Tests

E2E testing for Safe Apps is handled by the main web app's Cypress suite at `apps/web/cypress/e2e/safe-apps/`. This ensures tests run against the actual Safe{Wallet} integration rather than mocked iframe environments.

## Architecture

### Key Directories

- `src/components/` - React components
- `src/pages/` - Route page components
- `src/hooks/` - Custom React hooks
- `src/store/` - React Context providers
- `src/lib/` - Business logic (batches, simulation, storage)
- `src/theme/` - MUI theme configuration

### Tech Stack

- **React 19** with TypeScript
- **MUI v6** for UI components
- **ethers.js v6** for Ethereum interactions
- **Vite** for bundling
- **Jest** + React Testing Library for unit tests

### Safe Apps Integration

This app runs as a Safe App inside Safe{Wallet}'s iframe. It uses:

- `@safe-global/safe-apps-sdk` for communication with Safe{Wallet}
- `@safe-global/safe-apps-react-sdk` for React hooks
- `@safe-global/safe-apps-provider` for ethers.js provider

## Environment Variables

| Variable                              | Description           | Default |
| ------------------------------------- | --------------------- | ------- |
| `VITE_TENDERLY_SIMULATE_ENDPOINT_URL` | Tenderly API endpoint | -       |
| `VITE_TENDERLY_PROJECT_NAME`          | Tenderly project name | -       |
| `VITE_TENDERLY_ORG_NAME`              | Tenderly organization | -       |

## License

See [LICENSE](../../LICENSE) in the monorepo root.
