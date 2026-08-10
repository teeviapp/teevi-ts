#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import minimist from "minimist"
import prompts from "prompts"
import { blue, cyan, green, red, reset } from "kolorist"
// @ts-ignore
import data from "./stubs.json" assert { type: "json" }

type MethodStub = {
  name: string
  args: string[]
  returnType: string
  defaultValue: string
}

type StubsData = {
  versions: {
    core: string
    vite: string
  }
  stubs: Record<string, MethodStub[]>
}

const typedData = data as unknown as StubsData

const argv = minimist(process.argv.slice(2), { string: ["_"] })
const cwd = process.cwd()

const DEFAULT_TARGET_DIR = "teevi-extension"

async function init() {
  const argTargetDir = argv._[0]
  let targetDir = argTargetDir || DEFAULT_TARGET_DIR

  let result: prompts.Answers<
    | "projectName"
    | "displayName"
    | "description"
    | "author"
    | "capabilities"
    | "overwrite"
  >

  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : "text",
          name: "projectName",
          message: reset("Project name:"),
          initial: DEFAULT_TARGET_DIR,
          validate: (name: string) =>
            /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
              name
            )
              ? true
              : "Invalid package.json name",
          onState: (state: any) => {
            targetDir = state.value.trim() || DEFAULT_TARGET_DIR
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
          name: "overwrite",
          message: () =>
            (targetDir === "."
              ? "Current directory"
              : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`,
        },
        {
          type: (_: any, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error(red("✖") + " Operation cancelled")
            }
            return null
          },
          name: "overwriteChecker",
        },
        {
          type: "text",
          name: "displayName",
          message: reset("Extension display name:"),
          initial: "My Teevi Extension",
        },
        {
          type: "text",
          name: "description",
          message: reset("Description:"),
          initial: "A Teevi extension",
        },
        {
          type: "text",
          name: "author",
          message: reset("Author:"),
        },
        {
          type: "multiselect",
          name: "capabilities",
          message: reset("Select capabilities:"),
          choices: [
            { title: "Metadata", value: "metadata", selected: true },
            { title: "Video", value: "video", selected: true },
            { title: "Feed", value: "feed" },
            { title: "Live", value: "live" },
            { title: "Authentication", value: "auth" },
          ],
          instructions: false,
          min: 1,
        },
      ],
      {
        onCancel: () => {
          throw new Error(red("✖") + " Operation cancelled")
        },
      }
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }

  const {
    projectName,
    displayName,
    description,
    author,
    capabilities,
    overwrite,
  } = result
  const root = path.join(cwd, targetDir)

  if (overwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  }

  console.log(`\nScaffolding project in ${root}...`)

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../../template"
  )

  const write = (file: string, content?: string) => {
    const targetPath = path.join(root, file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  const files = fs.readdirSync(templateDir)
  for (const file of files.filter(
    (f) =>
      f !== "package.json" &&
      f !== "vite.config.ts" &&
      f !== "src" &&
      f !== "README.md"
  )) {
    write(file)
  }

  // Handle src directory
  const srcDir = path.join(templateDir, "src")
  const targetSrcDir = path.join(root, "src")
  if (!fs.existsSync(targetSrcDir)) fs.mkdirSync(targetSrcDir)

  const srcFiles = fs.readdirSync(srcDir)
  for (const file of srcFiles.filter((f) => f !== "index.ts")) {
    copy(path.join(srcDir, file), path.join(targetSrcDir, file))
  }

  // Templates with replacements
  let pkgContent = fs.readFileSync(
    path.join(templateDir, "package.json"),
    "utf-8"
  )
  pkgContent = pkgContent.replace(
    "<%= name %>",
    projectName || path.basename(targetDir)
  )
  pkgContent = pkgContent.replace("<%= description %>", description)
  pkgContent = pkgContent.replace("<%= author %>", author)
  pkgContent = pkgContent.replace(
    "<%= coreVersion %>",
    `^${typedData.versions.core}`
  )
  pkgContent = pkgContent.replace(
    "<%= viteVersion %>",
    `^${typedData.versions.vite}`
  )
  write("package.json", pkgContent)

  let viteConfig = fs.readFileSync(
    path.join(templateDir, "vite.config.ts"),
    "utf-8"
  )
  viteConfig = viteConfig.replace("<%= displayName %>", displayName)
  viteConfig = viteConfig.replace(
    "<%= capabilities %>",
    capabilities.map((c: string) => `"${c}"`).join(", ")
  )
  const credentialsString = capabilities.includes("auth")
    ? `\n      credentials: [\n        { id: "username", name: "Username", required: true },\n        { id: "password", name: "Password", required: true, secret: true },\n      ],`
    : ""
  viteConfig = viteConfig.replace("<%= credentials %>", credentialsString)
  write("vite.config.ts", viteConfig)

  let readme = fs.readFileSync(path.join(templateDir, "README.md"), "utf-8")
  readme = readme.replace("<%= displayName %>", displayName)
  readme = readme.replace("<%= description %>", description)
  write("README.md", readme)

  // Determine extension types based on capabilities
  const selectedTypes: string[] = []
  if (capabilities.includes("metadata"))
    selectedTypes.push("TeeviMetadataExtension")
  if (capabilities.includes("video")) selectedTypes.push("TeeviVideoExtension")
  if (capabilities.includes("feed")) selectedTypes.push("TeeviFeedExtension")
  if (capabilities.includes("live")) selectedTypes.push("TeeviLiveExtension")
  if (capabilities.includes("auth")) selectedTypes.push("TeeviAuthExtension")

  // Fallback and cleaning
  if (selectedTypes.length === 0) selectedTypes.push("TeeviMetadataExtension")

  const extensionType = selectedTypes.join(" & ")
  const extensionImports = selectedTypes.join(", ")

  const allMethods: MethodStub[] = []
  const seenMethods = new Set<string>()

  for (const type of selectedTypes) {
    const stubsForType = typedData.stubs[type] || []
    for (const method of stubsForType) {
      if (!seenMethods.has(method.name)) {
        seenMethods.add(method.name)
        allMethods.push(method)
      }
    }
  }

  const methods = allMethods.map((m) => {
    const isThrow = m.defaultValue?.includes("throw")
    const body = m.defaultValue
      ? isThrow
        ? m.defaultValue
        : `return ${m.defaultValue}`
      : ""
    return `${m.name}: async (${m.args.join(", ")}) => {\n    ${body}\n  },`
  })

  let indexTs = fs.readFileSync(path.join(templateDir, "src/index.ts"), "utf-8")
  indexTs = indexTs.replace(/<%= extensionType %>/g, extensionType)
  indexTs = indexTs.replace(/<%= extensionImports %>/g, extensionImports)
  indexTs = indexTs.replace(
    "// TODO: Implement your extension logic here",
    methods.join("\n\n  ")
  )
  write("src/index.ts", indexTs)

  console.log(`\n${green("Done.")} Now run:\n`)
  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`)
  }
  console.log(`  npm install`)
  console.log(`  npm run build`)
  console.log()
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === ".git")
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    if (file === ".git") {
      continue
    }
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

init().catch((e) => {
  console.error(e)
})
