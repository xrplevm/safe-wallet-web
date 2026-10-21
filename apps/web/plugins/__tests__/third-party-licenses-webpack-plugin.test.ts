import fs from 'fs'
import os from 'os'
import path from 'path'
import { collectPackages, moduleResources } from '../third-party-licenses-webpack-plugin.mjs'

const writePackage = (root: string, pkg: Record<string, unknown>, files: Record<string, string> = {}) => {
  fs.mkdirSync(root, { recursive: true })
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(pkg))
  Object.entries(files).forEach(([name, content]) => fs.writeFileSync(path.join(root, name), content))
  fs.writeFileSync(path.join(root, 'index.js'), '')
  return path.join(root, 'index.js')
}

describe('third-party licenses collector', () => {
  let tmp: string
  let nm: string

  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'licenses-'))
    nm = path.join(tmp, 'node_modules')
  })

  afterEach(() => {
    fs.rmSync(tmp, { recursive: true, force: true })
  })

  it('collects modules nested in concatenated modules', () => {
    const resources = moduleResources([
      { resource: '/a.js' },
      { rootModule: { resource: '/b.js' }, modules: [{ resource: '/c.js' }, { modules: [{ resource: '/d.js' }] }] },
    ])

    expect(resources.sort()).toEqual(['/a.js', '/b.js', '/c.js', '/d.js'])
  })

  it('lists one entry per package version, scoped and unscoped, and skips workspace code', () => {
    const a = writePackage(path.join(nm, 'a'), { name: 'a', version: '1.0.0', license: 'MIT' }, { LICENSE: 'MIT A' })
    const scoped = writePackage(path.join(nm, '@scope', 'b'), { name: '@scope/b', version: '2.0.0', license: 'ISC' })
    const nested = writePackage(path.join(nm, 'x', 'node_modules', 'a'), {
      name: 'a',
      version: '0.9.0',
      license: 'MIT',
    })
    fs.writeFileSync(path.join(nm, 'a', 'other.js'), '')

    const list = collectPackages([a, path.join(nm, 'a', 'other.js'), scoped, nested, path.join(tmp, 'src', 'app.ts')])

    expect(list.map((p) => `${p.name}@${p.version}`)).toEqual(['@scope/b@2.0.0', 'a@0.9.0', 'a@1.0.0'])
  })

  it('skips private packages', () => {
    const file = writePackage(path.join(nm, 'internal'), { name: 'internal', version: '1.0.0', private: true })

    expect(collectPackages([file])).toEqual([])
  })

  it('includes every license and notice file of a package', () => {
    const file = writePackage(
      path.join(nm, 'multi'),
      { name: 'multi', version: '1.0.0', license: 'Apache-2.0' },
      { LICENSE: 'Apache text', NOTICE: 'Notice text', 'LICENSE-MIT.txt': 'MIT text' },
    )

    const [pkg] = collectPackages([file])

    expect(pkg.text).toContain('Apache text')
    expect(pkg.text).toContain('Notice text')
    expect(pkg.text).toContain('MIT text')
  })

  it('falls back to the License section of the README', () => {
    const readme = '# lib\n\nUsage.\n\n## License\n\nCopyright (c) Someone\n\nMIT\n\n## Contributing\n\nNot this.'
    const file = writePackage(
      path.join(nm, 'lib'),
      { name: 'lib', version: '1.0.0', license: 'MIT' },
      { 'README.md': readme },
    )

    const [pkg] = collectPackages([file])

    expect(pkg.text).toContain('Copyright (c) Someone')
    expect(pkg.text).not.toContain('Not this.')
  })

  it('names custom licenses by the title of the referenced license file', () => {
    const file = writePackage(
      path.join(nm, 'custom'),
      { name: 'custom', version: '1.0.0', license: 'SEE LICENSE IN LICENSE.md' },
      { 'LICENSE.md': '\n**ACME COMMUNITY LICENSE**\n\nTerms.' },
    )

    const [pkg] = collectPackages([file])

    expect(pkg.license).toBe('ACME COMMUNITY LICENSE (custom)')
    expect(pkg.text).toContain('Terms.')
  })

  it('reports packages that publish no license text, with the declared license and author', () => {
    const file = writePackage(path.join(nm, 'bare'), {
      name: 'bare',
      version: '1.0.0',
      license: { type: 'MIT' },
      author: { name: 'Jane Doe' },
      repository: { url: 'git+https://github.com/jane/bare.git' },
    })

    const [pkg] = collectPackages([file])

    expect(pkg.license).toBe('MIT')
    expect(pkg.repository).toBe('https://github.com/jane/bare')
    expect(pkg.text).toBe(
      'The package publishes no license file. Its package.json declares the license "MIT" and the author "Jane Doe".',
    )
  })
})
