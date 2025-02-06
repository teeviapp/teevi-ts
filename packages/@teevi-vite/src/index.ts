import type { Plugin } from "vite"
import { writeFileSync, mkdirSync, readFileSync } from "fs"
import path from "path"
import pc from "picocolors"

interface TeeviPluginConfig {
  name: string
  entry?: string
}

interface PackageJson {
  name: string
  version: string
  description?: string
  author?: string
}

function log(message: string): void {
  console.log(`${pc.cyan("teevi")} ${message}`)
}

function error(message: string): void {
  console.error(`${pc.cyan("teevi")} ${pc.red(message)}`)
}

export default function teeviPlugin(config: TeeviPluginConfig): Plugin {
  const entry = config.entry ?? "src/index.ts"

  return {
    name: "@teeviapp/vite:generate:build",
    apply: "build",

    config() {
      log("Setting build configuration...")
      return {
        build: {
          lib: {
            entry,
            name: "teevi",
            fileName: () => "main.js",
            formats: ["iife"],
          },
          minify: true,
        },
      }
    },

    writeBundle(options) {
      log("Reading package.json...")

      let pkg: PackageJson
      try {
        const content = readFileSync("./package.json", "utf-8")
        pkg = JSON.parse(content)
      } catch (e) {
        error("Failed to read package.json")
        console.error(e)
        return
      }

      log("Generating manifest...")
      const manifest = {
        id: pkg.name,
        name: config.name,
        version: pkg.version,
        description: pkg.description ?? "Third-party extension for Teevi",
        author: pkg.author ?? "Unknown",
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
