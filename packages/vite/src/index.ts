import type { Plugin } from "vite"
import { writeFileSync, mkdirSync, readFileSync } from "fs"
import path from "path"
import pc from "picocolors"
import crypto from "crypto"

type TeeviExtensionCapability = "metadata" | "video" | "feed"

/**
 * Configuration options for the Teevi plugin.
 */
type TeeviPluginConfig = {
  /**
   * The name of the plugin.
   */
  name: string

  /**
   * The entry point file of the extension.
   * This is optional.
   * Default is src/index.ts.
   */
  entry?: string

  /**
   * Whether to minify the output.
   * This is optional.
   * Default is true.
   */
  minify?: boolean

  /**
   * The directory where assets are stored.
   * This is optional.
   * Default is "public".
   */
  assetsDir?: string

  /**
   * The icon resource name.
   * This is optional.
   * Default is "icon.png".
   */
  iconResourceName?: string

  /**
   * Extension capabilities.
   */
  capabilities: TeeviExtensionCapability[]
}

type PackageJson = {
  homepage?: string
  name: string
  version: string
  description?: string
  author?: string
}

type Manifest = {
  id: string
  name: string
  version: string
  description: string
  author: string
  homepage?: string
  hash: string
  capabilities: TeeviExtensionCapability[]
  iconResourceName: string
}

function log(message: string): void {
  console.log(`${pc.cyan("teevi")} ${message}`)
}

function error(message: string): void {
  console.error(`${pc.cyan("teevi")} ${pc.red(message)}`)
}

export default function teeviPlugin(config: TeeviPluginConfig): Plugin {
  log("Reading package.json...")

  let pkg: PackageJson
  try {
    const content = readFileSync("./package.json", "utf-8")
    pkg = JSON.parse(content)
  } catch (e) {
    error("Failed to read package.json")
    console.error(e)
    throw e
  }

  const fileName = `main.js`

  return {
    name: "@teeviapp/vite:generate:build",
    apply: "build",

    config() {
      log("Setting build configuration...")
      return {
        build: {
          lib: {
            entry: config.entry ?? "src/index.ts",
            name: "teevi",
            fileName: () => fileName,
            formats: ["iife"],
          },
          minify: config.minify ?? true,
          outDir: `dist`,
        },
        publicDir: config.assetsDir ?? "public",
      }
    },

    writeBundle(options, bundle) {
      // Calculate hash from bundle
      log("Calculating hash...")
      const bundleFile = bundle[fileName]
      let bundleFileHash: string
      if (bundleFile && bundleFile.type === "chunk" && bundleFile.code) {
        const hash = crypto.createHash("sha256")
        hash.update(bundleFile.code)
        bundleFileHash = hash.digest("hex")
      } else {
        error(`No ${fileName} found in bundle`)
        return
      }

      log("Generating manifest...")
      const manifest: Manifest = {
        id: pkg.name,
        name: config.name,
        version: pkg.version,
        description: pkg.description ?? "Third-party extension for Teevi",
        author: pkg.author ?? "Unknown",
        hash: bundleFileHash,
        capabilities: [...new Set(config.capabilities)],
        homepage: pkg.homepage,
        iconResourceName: config.iconResourceName ?? "icon.png",
      }

      if (!options.dir) {
        error("No output directory specified")
        return
      }

      try {
        const outputDir = path.resolve(options.dir)
        mkdirSync(outputDir, { recursive: true })
        writeFileSync(
          path.join(outputDir, "manifest.json"),
          JSON.stringify(manifest, null, 2)
        )
        log(
          `${pc.green("Manifest written to")} ${pc.gray(
            path.basename(outputDir)
          )}/${pc.cyan("manifest.json")}`
        )
      } catch (e) {
        error("Failed to write manifest.json")
        console.error(e)
      }
    },
  }
}
