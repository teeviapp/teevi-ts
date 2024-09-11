#!/usr/bin/env node
import { readFile, writeFile } from "fs"
import { join } from "path"

const packageJsonPath = join(process.cwd(), "package.json")
const manifestPath = join(process.cwd(), "manifest.json")

// Read the package.json file
readFile(packageJsonPath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading package.json:", err)
    process.exit(1)
  }

  try {
    const packageJson = JSON.parse(data)

    // Define the content for manifest.json using information from package.json
    const manifestContent = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description || "Thirt-party source for Teevi",
      author: packageJson.author || "Unknown",
    }

    // Write the manifest.json file
    writeFile(manifestPath, JSON.stringify(manifestContent, null, 2), (err) => {
      if (err) {
        console.error("Error writing manifest.json:", err)
        process.exit(1)
      }

      console.log(
        "manifest.json has been created successfully using package.json data!"
      )
    })
  } catch (parseError) {
    console.error("Error parsing package.json:", parseError)
    process.exit(1)
  }
})
