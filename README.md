# teevi-ts
Teevi Source Bindings in TypeScript

## Getting Started

1. Initialize your project:
```bash
npm init
npm install --save-dev typescript
tsc --init
```

2. Install the bindings:
```bash
npm install https://github.com/teeviapp/teevi-ts
```

## Building for Distribution

You can use any build system you prefer. 

The key requirement is that the final output is a single JavaScript file targeting es6 and safari16 with the format set to iife (Immediately Invoked Function Expression). 
The global variable used to store the exports should be named source.

Below is an example of how to achieve this using esbuild, though other build systems can be used as well.

### Installing esbuild
```bash
npm install --save-exact --save-dev esbuild
```

### Build Configuration
Here's an example build script using esbuild:

```javascript
import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/bundle.js",
  target: ["es6", "safari16"],
  drop: ["console", "debugger"],
  treeShaking: true,
  globalName: "source",
  format: "iife",
  platform: "browser",
  minify: true,
});
```
Explanation of Options
- `entryPoints`: Specifies the entry file of your project (src/index.ts).
- `bundle`: Ensures all dependencies are bundled into a single file.
- `outfile`: The output file for the build process (dist/bundle.js).
- `target`: Targets ES6 and Safari 16 compatibility.
- `drop`: Removes console and debugger statements to optimize the final output.
- `treeShaking`: Removes unused code for a more efficient build.
- `globalName`: Sets the name of the global variable (source) for the bundled module.
- `format`: Uses the iife format, which immediately invokes the bundle as a function.
- `platform`: Targets the browser environment.
- `minify`: Minifies the output for smaller file sizes.

