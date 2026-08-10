import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")
const newVersion = process.argv[2]

if (!newVersion) {
  console.error("Error: Please provide a version number. Example: node scripts/set-version.js 0.12.0")
  process.exit(1)
}

const packages = [
  "package.json",
  "packages/core/package.json",
  "packages/vite/package.json",
  "packages/create-extension/package.json"
]

for (const pkgPath of packages) {
  const absolutePath = path.resolve(rootDir, pkgPath)
  const content = JSON.parse(fs.readFileSync(absolutePath, "utf-8"))
  content.version = newVersion
  
  // Update internal references if any package depends on another workspace package
  if (content.dependencies && content.dependencies["@teeviapp/core"]) {
    content.dependencies["@teeviapp/core"] = newVersion
  }
  if (content.peerDependencies && content.peerDependencies["@teeviapp/core"]) {
    content.peerDependencies["@teeviapp/core"] = newVersion
  }
  if (content.devDependencies && content.devDependencies["@teeviapp/core"]) {
    content.devDependencies["@teeviapp/core"] = newVersion
  }

  // Write with 2 spaces indentation and a trailing newline
  fs.writeFileSync(absolutePath, JSON.stringify(content, null, 2) + "\n")
  console.log(`Updated ${pkgPath} to version ${newVersion}`)
}
