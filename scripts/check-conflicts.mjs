import { readdir, readFile } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'

const root = process.cwd()
const ignored = new Set(['.git', '.next', 'node_modules'])
const textExtensions = new Set(['.css', '.html', '.js', '.jsx', '.json', '.md', '.mjs', '.ts', '.tsx'])
const markerPattern = /^(<<<<<<<|=======|>>>>>>>)(?:\s|$)/m
const conflicts = []

async function scan(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  await Promise.all(entries.map(async (entry) => {
    if (ignored.has(entry.name)) return
    const filePath = join(directory, entry.name)
    if (entry.isDirectory()) return scan(filePath)
    if (!textExtensions.has(extname(entry.name))) return
    if (markerPattern.test(await readFile(filePath, 'utf8'))) conflicts.push(relative(root, filePath))
  }))
}

await scan(root)
if (conflicts.length) {
  console.error(`Unresolved Git conflict markers found:\n${conflicts.map((file) => `- ${file}`).join('\n')}`)
  process.exit(1)
}

console.log('No unresolved Git conflict markers found.')
