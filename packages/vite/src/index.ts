import type { Plugin } from "vite"
import {
  writeFileSync,
  mkdirSync,
  readFileSync,
  existsSync,
  copyFileSync,
} from "fs"
import path from "path"
import pc from "picocolors"
import crypto from "crypto"
import type { OutputAsset, OutputChunk } from "rollup"
import { fileURLToPath } from "url"

type TeeviExtensionCapability = "metadata" | "video" | "feed" | "live"

type TeeviExtensionInput = {
  id: string
  name: string
  required: boolean
}

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

  /**
   * Extension inputs.
   */
  inputs?: TeeviExtensionInput[]

  /**
   * Optional note for the extension.
   * This can be used to provide additional information about the extension.
   */
  note?: string
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
  inputs: TeeviExtensionInput[]
  note?: string
  sdkVersion?: string
}

function log(message: string): void {
  console.log(`${pc.cyan("teevi")} ${message}`)
}

function error(message: string): void {
  console.error(`${pc.cyan("teevi")} ${pc.red(message)}`)
}

export default function teeviPlugin(config: TeeviPluginConfig): Plugin {
  log("Reading package.json...")

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
          copyPublicDir: false,
        },
        publicDir: config.assetsDir ?? "public",
      }
    },

    writeBundle(options, bundle) {
      // Calculate hash from bundle
      log("Calculating hash...")
      const bundleFileHash = calculateBundleHash(bundle[fileName])
      if (!bundleFileHash) {
        error(`No ${fileName} found in bundle`)
        return
      }

      log("Generating manifest...")
      const manifest = createManifest({
        config: config,
        bundleFileHash: bundleFileHash,
      })

      if (!options.dir) {
        error("No output directory specified")
        return
      }

      try {
        const outputDir = path.resolve(options.dir)
        mkdirSync(outputDir, { recursive: true })

        // Write manifest.json
        writeFileSync(
          path.join(outputDir, "manifest.json"),
          JSON.stringify(manifest, null, 2)
        )
        log(
          `${pc.green("Manifest written to")} ${pc.gray(
            path.basename(outputDir)
          )}/${pc.cyan("manifest.json")}`
        )

        // Write icon resource if it exists
        const iconResourceName = config.iconResourceName ?? "icon.png"
        const iconSourcePath = path.join(
          config.assetsDir ?? "public",
          iconResourceName
        )

        if (existsSync(iconSourcePath)) {
          const iconDestPath = path.join(outputDir, iconResourceName)
          copyFileSync(iconSourcePath, iconDestPath)
          log(
            `${pc.green("Icon resource copied to")} ${pc.gray(
              path.basename(outputDir)
            )}/${pc.cyan(iconResourceName)}`
          )
        }
      } catch (e) {
        error("Failed to write manifest.json")
        console.error(e)
      }
    },
  }
}

function readPackageJson(path: string): PackageJson {
  try {
    const content = readFileSync(path, "utf-8")
    return JSON.parse(content)
  } catch (e) {
    error("Failed to read package.json")
    console.error(e)
    throw e
  }
}

function calculateBundleHash(
  bundle: OutputAsset | OutputChunk
): string | undefined {
  if (bundle && bundle.type === "chunk" && bundle.code) {
    const hash = crypto.createHash("sha256")
    hash.update(bundle.code)
    return hash.digest("hex")
  } else {
    return undefined
  }
}

function createManifest(options: {
  config: TeeviPluginConfig
  bundleFileHash: string
}): Manifest {
  const { config, bundleFileHash } = options
  const extensionPackage = readPackageJson("./package.json")
  const sdkVersion = readPackageJson(
    path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "../package.json"
    )
  ).version

  return {
    id: extensionPackage.name,
    name: config.name,
    version: extensionPackage.version,
    description:
      extensionPackage.description ?? "Third-party extension for Teevi",
    author: extensionPackage.author ?? "Unknown",
    hash: bundleFileHash,
    capabilities: [...new Set(config.capabilities)],
    homepage: extensionPackage.homepage,
    iconResourceName: config.iconResourceName ?? "icon.png",
    inputs: config.inputs ?? [],
    note: config.note,
    sdkVersion: sdkVersion,
  } satisfies Manifest
}
