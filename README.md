# teevi-ts

Teevi Source Bindings in TypeScript

## Getting Started

1. **Initialize your project:**

```bash
npm init
npm install --save-dev typescript
tsc --init
```

2. **Install the bindings:**

```bash
npm install https://github.com/teeviapp/teevi-ts
```

## Write the Source Code

Your source must exports four functions, each with a specific purpose:

**`search(query: string): Promise<SearchShow[]>`**

Searches for shows based on a query.

**`fetchDetails(id: string): Promise<Show>`**

Fetches detailed information about a show by its ID.

**`fetchEpisodes(id: string,  season?: number): Promise<ShowEpisode[]>`**

Fetches episodes for a show. Omit the season parameter if the ID refers to a movie.

**`fetchVideoSources(episodeId: string): Promise<VideoSource[]>`**

Fetches video sources for an episode.

## Building for Distribution

You can use any build system, but ensure the final output is a single JavaScript file targeting **ES2020** and **Safari 16** with the format set to **iife** (Immediately Invoked Function Expression). The global variable for exports should be named **"source"**.

### Using esbuild

Here's how to build using esbuild:

```bash
npm install --save-exact --save-dev esbuild
```

#### Build Configuration

Create a build script (`build.js`)

```javascript
import * as esbuild from "esbuild"

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/bundle.js",
  target: ["es2020", "safari16"],
  drop: ["console", "debugger"],
  treeShaking: true,
  globalName: "source",
  format: "iife",
  platform: "browser",
  minify: true,
})
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

## Useful dependencies

- [Cheerio](https://github.com/cheeriojs/cheerio): a fast, flexible library for parsing and manipulating HTML and XML.
- [core-js](https://github.com/zloirock/core-js): for polyfills (Teevi provides a native `fetch` polyfill for you, but URL and other web API are not supported)
