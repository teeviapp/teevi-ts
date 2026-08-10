import { Project, Type } from "ts-morph"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "../../..")
const coreSrcDir = path.resolve(rootDir, "packages/core/src")
const outputFilePath = path.resolve(__dirname, "../src/stubs.json")

// Get current versions from workspace
const corePkg = JSON.parse(
  fs.readFileSync(path.resolve(rootDir, "packages/core/package.json"), "utf-8")
)
const vitePkg = JSON.parse(
  fs.readFileSync(path.resolve(rootDir, "packages/vite/package.json"), "utf-8")
)

const project = new Project()

// Load all .d.ts files from core
project.addSourceFilesAtPaths(`${coreSrcDir}/**/*.d.ts`)

const extensionInterfaces = [
  "TeeviMetadataExtension",
  "TeeviVideoExtension",
  "TeeviFeedExtension",
  "TeeviLiveExtension",
  "TeeviAuthExtension",
]

type MethodStub = {
  name: string
  args: string[]
  returnType: string
  defaultValue: string
}

const stubs: Record<string, MethodStub[]> = {}

for (const typeName of extensionInterfaces) {
  const sourceFile = project.getSourceFileOrThrow((f) => {
    return f.getTypeAlias(typeName) !== undefined
  })
  const typeAlias = sourceFile.getTypeAliasOrThrow(typeName)
  const type = typeAlias.getType()

  stubs[typeName] = extractMethodsFromType(type)
}

function cleanReturnType(typeText: string): string {
  return typeText.replace(/import\("([^"]+)"\)/g, (match, importPath) => {
    if (
      importPath.includes("packages/core/src") ||
      importPath.includes("core/src")
    ) {
      return `import("@teeviapp/core")`
    }
    return match
  })
}

function extractMethodsFromType(type: Type): MethodStub[] {
  const methods: MethodStub[] = []
  const properties = type.getProperties()

  for (const prop of properties) {
    const valueDecl = prop.getValueDeclaration()
    if (!valueDecl) continue

    const propType = prop.getTypeAtLocation(valueDecl)
    if (propType.getCallSignatures().length > 0) {
      const signature = propType.getCallSignatures()[0]
      const name = prop.getName()
      const args = signature.getParameters().map((p) => p.getName())
      const rawReturnType = signature.getReturnType().getText()
      const returnType = cleanReturnType(rawReturnType)
      let defaultValue = 'throw new Error("Not implemented")'

      if (returnType.includes("void") && !returnType.includes("Promise")) {
        defaultValue = ""
      }

      methods.push({
        name,
        args,
        returnType,
        defaultValue,
      })
    }
  }

  return methods
}

const output = {
  versions: {
    core: corePkg.version,
    vite: vitePkg.version,
  },
  stubs,
}

fs.writeFileSync(outputFilePath, JSON.stringify(output, null, 2))
console.log(
  `Generated stubs and versions (${corePkg.version}) in ${outputFilePath}`
)
