# teevi-ts

This document provides instructions for setting up your development environment, writing your Teevi extension using TypeScript, and building it for distribution.

## Getting Started

1. **Initialize Your Project:**

Set up a new Node.js project and configure TypeScript:

```bash
npm init
npm install --save-dev typescript
tsc --init
```

2. **Install teevi-ts:**

Add the Teevi TypeScript library to your project:

```bash
npm install https://github.com/teeviapp/teevi-ts
```

This will prepare your development environment for creating a Teevi extension using TypeScript.

3. **Write Your Extension Code:**

Now it's time to write your Teevi extension! Make sure your entry point exports a default object that implements the `TeeviExtension` type.

```typescript
export default {
  fetchShowsByQuery: async (query) => {
    // Your code to fetch shows by query
  },
  fetchShow: async (id) => {
    // Your code to fetch a specific show by ID
  },
} satisfies TeeviExtension
```

## Web API Limitations

Please note that certain Web APIs such as `URL`, `URLSearchParams`, `Headers`, `Request`, etc., are not available in the environment where the extensions will be executed. Only the `fetch` function is provided through a native polyfill.

For other APIs, you can use the [core-js](https://github.com/zloirock/core-js) library to include the necessary polyfills:

```bash
npm install core-js
```

Then, import the required polyfills in your code:

```typescript
import "core-js/web/url"
import "core-js/web/url-search-params"
```

## Building for Distribution

To distribute the extension, ensure the final output is a single JavaScript file with the following specifications:

- **Target**: ES2020 and Safari 16
- **Format**: iife (Immediately Invoked Function Expression)
- **Global Variable**: "teevi"

Below is an example of how to perform a build using _esbuild_, but you can use any build system of your choice.

1. **Install esbuild:**

```bash
npm install --save-exact --save-dev esbuild
```

2. **Create a build script:**

Create a file named `build.js` with the following content:

```javascript
import * as esbuild from "esbuild"

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/bundle.js",
  target: ["es2020", "safari16"],
  drop: ["console", "debugger"],
  treeShaking: true,
  globalName: "teevi",
  format: "iife",
  platform: "browser",
  minify: true,
})
```
