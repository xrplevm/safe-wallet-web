import type { NextPage } from 'next'
import Head from 'next/head'
import { Typography, Table, TableBody, TableRow, TableCell, TableHead, TableContainer, Box } from '@mui/material'
import Paper from '@mui/material/Paper'
import ExternalLink from '@/components/common/ExternalLink'
import { BRAND_NAME } from '@/config/constants'
import { APP_HOMEPAGE } from '@/config/version'
import useAsync from '@safe-global/utils/hooks/useAsync'

const UPSTREAM_SOURCE_URL = 'https://github.com/safe-global/safe-wallet-monorepo'
// Written by ThirdPartyLicensesWebpackPlugin during `next build` (not available in `next dev`).
const LICENSES_JSON_URL = '/_next/static/third-party-licenses.json'
const LICENSES_TXT_URL = '/_next/static/third-party-licenses.txt'

type ThirdPartyPackage = {
  name: string
  version: string
  license: string
  repository: string
}

const ThirdPartyTable = () => {
  const [packages, error, loading] = useAsync<ThirdPartyPackage[]>(async () => {
    const res = await fetch(LICENSES_JSON_URL)
    if (!res.ok) throw new Error(`Failed to load the license list (${res.status})`)
    return res.json()
  }, [])

  if (loading) return <Typography>Loading the license list…</Typography>
  if (error || !packages) {
    return <Typography color="text.secondary">The license list is only generated in production builds.</Typography>
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell width="40%">
              <strong>Package</strong>
            </TableCell>
            <TableCell width="15%">
              <strong>Version</strong>
            </TableCell>
            <TableCell>
              <strong>License</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {packages.map((pkg) => (
            <TableRow key={`${pkg.name}@${pkg.version}`}>
              <TableCell>
                {pkg.repository ? <ExternalLink href={pkg.repository}>{pkg.name}</ExternalLink> : pkg.name}
              </TableCell>
              <TableCell>{pkg.version}</TableCell>
              <TableCell>{pkg.license}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const Licenses: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`${BRAND_NAME} – Licenses`}</title>
      </Head>

      <main>
        <Typography variant="h1" mb={2}>
          Licenses
        </Typography>
        <Box mb={4}>
          <Typography mb={2}>
            {BRAND_NAME} is a modified version of open source software published at{' '}
            <ExternalLink href={UPSTREAM_SOURCE_URL}>{UPSTREAM_SOURCE_URL}</ExternalLink> under the GNU General Public
            License v3.0. It was modified in 2026 to use its own name, design and links. The complete source code of
            this version is available at <ExternalLink href={APP_HOMEPAGE}>{APP_HOMEPAGE}</ExternalLink> under the same
            license.
          </Typography>
          <Typography>
            This app is not affiliated with, endorsed by or operated by the authors of the original software.
          </Typography>
        </Box>

        <Typography variant="h3" mb={2}>
          Libraries we use
        </Typography>
        <Box mb={4}>
          <Typography mb={3}>
            These open source packages are included in the {BRAND_NAME} web app. The full license texts are in{' '}
            <ExternalLink href={LICENSES_TXT_URL}>third-party-licenses.txt</ExternalLink>. We thank the open source
            community for all of their contributions.
          </Typography>
          <Typography mb={3}>
            The Work Sans font is © The Work Sans Project Authors and licensed under the{' '}
            <ExternalLink href="/fonts/WorkSans-OFL.txt">SIL Open Font License 1.1</ExternalLink>.
          </Typography>
          <ThirdPartyTable />
        </Box>
      </main>
    </>
  )
}

export default Licenses
