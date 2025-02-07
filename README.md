# teevi-ts

Create Teevi extensions in TypeScript with ease.

## Getting Started

1. **Set up a TypeScript project**  
   Create a new Node.js project and install TypeScript:

```bash
npm init
npm install --save-dev typescript
npx tsc --init
```

2. **Install Teevi Core**  
   Add the core library to your project:

```bash
npm install @teeviapp/core
```

3. **Export a Teevi Extension**  
   In your main entry file, export a default object that implements the `TeeviExtension` type:

```typescript
import type { TeeviExtension } from "@teeviapp/core"

export default {} satisfies TeeviExtension
```

## Building

### With Vite

1. **Install Vite and the Teevi plugin:**

```bash
npm install --save-dev vite @teeviapp/vite
```

2. **Update your Vite Config**  
   In`vite.config.ts`, import and register the plugin:

```typescript
import { UserConfig } from "vite"
import teevi from "@teeviapp/vite"

export default {
  plugins: [teevi({ name: "Your Ext Name" })],
} satisfies UserConfig
```

### Manually (e.g., Parcel or Webpack)

Use your bundler of choice to create a single, self-contained JavaScript file. Recommended settings for the output bundle:

- **Target**: ES2020, Safari 16
- **Format**: IIFE
- **Global Variable**: `teevi`

For further configuration options, refer to the plugin code for Vite.

## Web API Limitations

The Teevi runtime does not fully support Web or DOM APIs, but it provides native polyfills for `fetch`, `URL`, and `URLSearchParams`.

If you require additional APIs that aren’t available, add the necessary polyfills or use a library that provides them (like [core-js](https://github.com/zloirock/core-js))
