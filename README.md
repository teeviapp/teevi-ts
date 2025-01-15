# teevi-ts

Easily build Teevi extensions in TypeScript.

## Getting Started

Initialize a new Node.js project and install the Teevi library.

```bash
npm init
npm install --save-dev typescript https://github.com/teeviapp/teevi-ts
tsc --init
```

Your entry point should export a default object that implements the `TeeviExtension` type.

```typescript
export default {} satisfies TeeviExtension
```

## Building for Distribution

Use a bundler (e.g., Parcel, Webpack, or Vite) to create a single JavaScript file with:

- **Target**: ES2020, Safari 16
- **Format**: IIFE
- **Global Variable**: `teevi`

This ensures compatibility with the Teevi environment.

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
