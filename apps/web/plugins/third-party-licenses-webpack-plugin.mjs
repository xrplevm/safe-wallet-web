import fs from 'fs'
import path from 'path'

export const LICENSES_JSON = 'static/third-party-licenses.json'
export const LICENSES_TXT = 'static/third-party-licenses.txt'

const LICENSE_FILE = /^(licen[sc]e|copying|notice)([-._].*)?(\.(md|txt|markdown))?$/i
const README_FILE = /^readme(\.(md|markdown|txt))?$/i

/** The "License" section of a README, used when a package publishes no license file. */
const readmeLicense = (root) => {
  const readme = fs.readdirSync(root).find((f) => README_FILE.test(f))
  if (!readme) return ''
  const lines = fs.readFileSync(path.join(root, readme), 'utf8').split('\n')
  const start = lines.findIndex((l) => /^#{1,6}\s*licen[sc]e\b/i.test(l.trim()))
  if (start === -1) return ''
  const level = lines[start].match(/^#+/)[0].length
  const end = lines.findIndex((l, i) => i > start && (l.match(/^#+/)?.[0].length ?? 99) <= level)
  return lines.slice(start, end === -1 ? undefined : end).join('\n').trim()
}

const licenseText = (root, pkg) => {
  const files = fs.readdirSync(root).filter((f) => LICENSE_FILE.test(f)).sort()
  if (files.length) return files.map((f) => fs.readFileSync(path.join(root, f), 'utf8').trim()).join('\n\n')
  const fromReadme = readmeLicense(root)
  if (fromReadme) return `(License section of the package README)\n\n${fromReadme}`
  const author = typeof pkg.author === 'string' ? pkg.author : pkg.author?.name
  return `The package publishes no license file. Its package.json declares the license "${licenseOf(pkg)}"${
    author ? ` and the author "${author}"` : ''
  }.`
}

/** Package root of a module path inside node_modules, or null for workspace and generated code. */
const packageRoot = (resource) => {
  const marker = `${path.sep}node_modules${path.sep}`
  const index = resource.lastIndexOf(marker)
  if (index === -1) return null
  const rest = resource.slice(index + marker.length).split(path.sep)
  const depth = rest[0].startsWith('@') ? 2 : 1
  return resource.slice(0, index + marker.length) + rest.slice(0, depth).join(path.sep)
}

const licenseOf = (pkg) => {
  if (typeof pkg.license === 'string') return pkg.license
  if (pkg.license?.type) return pkg.license.type
  if (Array.isArray(pkg.licenses)) return pkg.licenses.map((l) => l.type || l).join(' OR ')
  return 'UNKNOWN'
}

const repositoryOf = (pkg) => {
  const repo = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url
  const url = repo || pkg.homepage || ''
  return url
    .replace(/^git\+/, '')
    .replace(/^git:\/\//, 'https://')
    .replace(/^github:/, 'https://github.com/')
    .replace(/\.git$/, '')
    .replace(/^([\w-]+\/[\w.-]+)$/, 'https://github.com/$1')
}

/**
 * Lists every npm package that ends up in the browser bundle, with its version and license,
 * and writes the full license texts next to it. The /licenses page renders the JSON.
 */
export class ThirdPartyLicensesWebpackPlugin {
  apply(compiler) {
    const pluginName = 'ThirdPartyLicensesWebpackPlugin'

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      const isClient = !compilation.options.name || compilation.options.name === 'client'
      if (!isClient) return

      compilation.hooks.processAssets.tap(
        { name: pluginName, stage: compilation.constructor.PROCESS_ASSETS_STAGE_ADDITIONAL },
        () => {
          const roots = new Set()
          const visit = (module) => {
            if (module.modules) module.modules.forEach(visit)
            const resource = module.resource || module.rootModule?.resource
            const root = resource && packageRoot(resource)
            if (root) roots.add(root)
          }
          compilation.modules.forEach(visit)

          const packages = new Map()
          for (const root of roots) {
            const pkgFile = path.join(root, 'package.json')
            if (!fs.existsSync(pkgFile)) continue
            const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'))
            if (!pkg.name || pkg.private) continue
            const key = `${pkg.name}@${pkg.version}`
            if (packages.has(key)) continue
            packages.set(key, {
              name: pkg.name,
              version: pkg.version,
              license: licenseOf(pkg),
              repository: repositoryOf(pkg),
              text: licenseText(root, pkg),
            })
          }

          const list = [...packages.values()].sort(
            (a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version),
          )
          const json = list.map(({ text, ...rest }) => rest)
          const txt = list
            .map((p) => `${p.name}@${p.version} (${p.license})\n${p.repository}\n\n${p.text}`)
            .join(`\n\n${'-'.repeat(80)}\n\n`)

          const { RawSource } = compiler.webpack.sources
          compilation.emitAsset(LICENSES_JSON, new RawSource(JSON.stringify(json)))
          compilation.emitAsset(LICENSES_TXT, new RawSource(txt))
        },
      )
    })
  }
}
