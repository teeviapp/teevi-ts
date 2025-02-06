import { type Plugin } from "vite"
import { readFile, writeFile } from "fs/promises"
import path from "path"

interface TeeviPluginConfig {
  name: string
}

export default function teeviPlugin(config: TeeviPluginConfig): Plugin {
  return {
    name: "@teevi/vite:generate:build",
    apply: "build",

    async config() {
      return {
        build: {
          lib: {
            entry: "src/index.ts",
            name: "teevi",
            fileName: () => `main.js`,
            formats: ["iife"],
          },
          minify: true,
        },
      }
    },

    async generateBundle(options) {
      const pkg = JSON.parse(await readFile("./package.json", "utf-8"))

      const manifest = {
        id: pkg.name,
        name: config.name,
        version: pkg.version,
        description: pkg.description || "Thirt-party extension for Teevi",
        author: pkg.author || "Unknown",
      }

      await writeFile(
        path.resolve(options.dir!, "manifest.json"),
        JSON.stringify(manifest, null, 2)
      )
    },
  }
}
