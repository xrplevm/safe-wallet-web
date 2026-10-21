import { http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker'
import { server } from '@/tests/server'
import { render, screen } from '@/tests/test-utils'
import Licenses from '@/pages/licenses'

const LICENSES_URL = '*/_next/static/third-party-licenses.json'

describe('Licenses page', () => {
  it('lists the bundled packages from the generated license list', async () => {
    const pkg = {
      name: faker.word.noun(),
      version: faker.system.semver(),
      license: 'MIT',
      repository: `https://github.com/${faker.word.noun()}/${faker.word.noun()}`,
    }
    server.use(http.get(LICENSES_URL, () => HttpResponse.json([pkg])))

    render(<Licenses />)

    const link = await screen.findByRole('link', { name: new RegExp(pkg.name) })
    expect(link).toHaveAttribute('href', pkg.repository)
    expect(screen.getByText(pkg.version)).toBeInTheDocument()
    expect(screen.getByText('MIT')).toBeInTheDocument()
  })

  it('explains that the list only exists in production builds when it cannot be loaded', async () => {
    server.use(http.get(LICENSES_URL, () => new HttpResponse(null, { status: 404 })))

    render(<Licenses />)

    expect(await screen.findByText('The license list is only generated in production builds.')).toBeInTheDocument()
  })
})
