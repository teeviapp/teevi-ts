#!/usr/bin/env node
import { readFile, writeFile } from "fs/promises"
import { join, dirname } from "path"

const getPackageJson = async (path) => {
  try {
    const json = await readFile(join(path, "package.json"), "utf8")
    return JSON.parse(json)
  } catch (error) {
    console.error(`Error reading ${path}/package.json:`, error)
    process.exit(1)
  }
}

const libraryPackage = await getPackageJson(dirname(import.meta.dirname))
const sourcePackage = await getPackageJson(process.cwd())

if (!sourcePackage.versionCode) {
  console.error("Error missing versionCode from package.json")
  process.exit(1)
}

// Define the content for manifest.json using information from package.json
const manifestContent = {
  name: sourcePackage.name,
  versionCode: sourcePackage.versionCode,
  libraryVersion: libraryPackage.version,
  description: sourcePackage.description || "Thirt-party source for Teevi",
  author: sourcePackage.author || "Unknown",
}

try {
  const manifestPath = join(process.cwd(), "manifest.json")
  await writeFile(manifestPath, JSON.stringify(manifestContent, null, 2))
  console.log("manifest.json has been created successfully!")
} catch (err) {
  console.error("Error writing manifest.json:", err)
  process.exit(1)
}
