# Teevi Extension Developer Guide

[![npm version](https://img.shields.io/npm/v/@teeviapp/core.svg?style=flat)](https://www.npmjs.com/package/@teeviapp/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Build powerful extensions for the Teevi platform

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Extension Development](#extension-development)
  - [Core Concepts](#core-concepts)
  - [Basic Structure](#basic-structure)
  - [Extension Capabilities](#extension-capabilities)
- [Build Configuration](#build-configuration)
- [The Manifest File](#the-manifest-file)
- [User Inputs](#user-inputs)
- [Runtime Environment](#runtime-environment)
- [Building and Distribution](#building-and-distribution)
- [Best Practices](#best-practices)
- [Examples](#examples)
  - [Official Teevi Extensions](#official-teevi-extensions)
- [FAQ](#faq)

## Overview

Teevi extensions allow you to integrate content from various sources into the Teevi platform. This guide provides comprehensive instructions for creating, testing, and distributing Teevi extensions.

An extension consists of:

1. **Source code**: TypeScript implementation of the extension interface
2. **Manifest file**: JSON metadata describing your extension (auto-generated)
3. **Icon**: Visual representation of your extension

## Quick Start

Create a new Teevi extension in 5 minutes:

```bash
# Create a new directory
mkdir my-teevi-extension && cd my-teevi-extension

# Initialize project
npm init -y
npm install --save @teeviapp/core
npm install --save-dev typescript @teeviapp/vite vite

# Create TypeScript config
npx tsc --init

# Create source directory
mkdir -p src public
```

Create a basic extension (`src/index.ts`):

```typescript
import type { TeeviVideoExtension } from "@teeviapp/core"

export default {
  fetchShowsByQuery: async (query) => {
    console.log(`Searching for: ${query}`)
    return [
      {
        kind: "movie",
        id: "example-id",
        title: "Example Movie",
        year: 2023,
      },
    ]
  },

  fetchShow: async (id) => {
    return {
      kind: "movie",
      id,
      title: "Example Movie",
      overview: "This is an example movie",
      releaseDate: "2023-05-25",
      duration: 7200,
      genres: ["Example"],
    }
  },

  fetchEpisodes: async (id) => {
    return []
  },

  fetchVideoAssets: async (id) => {
    return [
      {
        url: "https://example.com/video.mp4",
      },
    ]
  },
} satisfies TeeviVideoExtension
```

Create Vite config (`vite.config.ts`):

```typescript
import { defineConfig } from "vite"
import teevi from "@teeviapp/vite"

export default defineConfig({
  plugins: [
    teevi({
      name: "My First Extension",
      capabilities: ["metadata", "video"],
    }),
  ],
})
```

Add an icon to `public/icon.png`, then build your extension:

```bash
npx vite build
```

Your extension is now ready in the `dist` directory!

## Installation

To start developing a Teevi extension, you'll need to set up your development environment:

```bash
# Initialize a new project
npm init -y

# Install dependencies
npm install --save @teeviapp/core
npm install --save-dev typescript @teeviapp/vite vite

# Create TypeScript configuration
npx tsc --init
```

### TypeScript Configuration

A basic `tsconfig.json` for Teevi extensions:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Extension Development

### Core Concepts

Teevi extensions are built on these key concepts:

| Concept          | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| **Extension**    | A TypeScript module that exports an object implementing the Teevi extension interface |
| **Capabilities** | Functionality your extension provides (metadata, video, feed)                         |
| **Manifest**     | JSON metadata describing your extension and its capabilities                          |
| **User Inputs**  | Configuration values that users provide to customize your extension                   |

### Basic Structure

Teevi extensions must export a default object that implements one of the extension interfaces:

```typescript
// src/index.ts
import type { TeeviVideoExtension } from "@teeviapp/core"

// Extensions must be exported as a default object
export default {
  // Required methods based on your extension's capabilities
  // ...
} satisfies TeeviVideoExtension
```

### Extension Capabilities

Teevi extensions can implement one or more capabilities:

#### Metadata Capability

Provides basic show information and search functionality:

```typescript
import type { TeeviMetadataExtension } from "@teeviapp/core"

export default {
  fetchShowsByQuery: async (query) => {
    // Implement search functionality
    return []
  },

  fetchShow: async (id) => {
    // Implement show details retrieval
    // ...
  },

  fetchEpisodes: async (showId, season) => {
    // Implement episode listing
    // ...
  },
} satisfies TeeviMetadataExtension
```

#### Video Capability

Adds video playback sources to your extension:

```typescript
import type { TeeviVideoExtension } from "@teeviapp/core"

export default {
  // Include metadata capabilities...

  fetchVideoAssets: async (mediaId) => {
    // Implement video source retrieval
    // ...
  },
} satisfies TeeviVideoExtension
```

#### Feed Capability

Provides content collections and recommendations:

```typescript
import type { TeeviFeedExtension } from "@teeviapp/core"

export default {
  fetchFeedCollections: async () => {
    // Return collections of content
    return [
      {
        id: "recommended",
        title: "Recommended For You",
        shows: [
          /* list of TeeviShowEntry objects */
        ],
      },
    ]
  },
} satisfies TeeviFeedExtension
```

## Build Configuration

Teevi provides a Vite plugin that simplifies the build process for extensions.

Create a `vite.config.ts` file in your project root:

```typescript
import { defineConfig } from "vite"
import teevi from "@teeviapp/vite"

export default defineConfig({
  plugins: [
    teevi({
      // Display name of your extension
      name: "My Extension",

      // Capabilities your extension provides
      capabilities: ["metadata", "video", "feed"],

      // Optional configuration inputs for your extension
      inputs: [
        {
          id: "api_key",
          name: "API Key",
          required: true,
        },
        {
          id: "adult_content",
          name: "Allow Adult Content",
          required: false,
        },
      ],

      // Directory containing assets (default: "public")
      assetsDir: "public",

      // Name of icon file in assets directory (default: "icon.png")
      iconResourceName: "icon.png",
    }),
  ],
})
```

## The Manifest File

The manifest describes your extension to the Teevi platform. The Vite plugin generates it automatically during the build process.

Example manifest:

```json
{
  "id": "your-extension-name", // from package.json name
  "name": "My Extension", // from teevi plugin configuration
  "version": "1.0.0", // from package.json version
  "description": "Description of the app", // from package.json description
  "author": "Your Name", // from package.json author
  "homepage": "https://example.com", // from package.json homepage
  "hash": "sha256-hash-of-bundle", // generated from the bundle
  "capabilities": ["metadata", "video"], // from teevi plugin configuration
  "iconResourceName": "icon.png", // from teevi plugin configuration
  "inputs": [
    // from teevi plugin configuration
    {
      "id": "api_key",
      "name": "API Key",
      "required": true
    }
  ]
}
```

### Extension Icon

Your extension should include an icon in the assets directory:

- Default path: `public/icon.png`
- Recommended size: 512×512 pixels

## User Inputs

Teevi extensions can request configuration values from users:

```typescript
// In vite.config.ts
teevi({
  // ...
  inputs: [
    {
      id: "api_key", // Unique identifier
      name: "API Key", // Display name
      required: true, // Whether input is required
    },
  ],
})
```

Access these values in your extension code:

```typescript
export default {
  fetchShowsByQuery: async (query) => {
    const apiKey = Teevi.getInputValueById("api_key")
    if (!apiKey) {
      throw new Error("API KEY is required")
    }

    // Use apiKey in your API requests
    const response = await fetch(
      `https://api.example.com/search?q=${query}&api_key=${apiKey}`
    )
    const data = await response.json()
    // ...
  },
  // ...
}
```

## Runtime Environment

Teevi provides a specialized runtime environment for extensions:

### Available Web APIs

Teevi includes these Web APIs natively:

- ✅ `fetch`: For making network requests
- ✅ `URL` and `URLSearchParams`: For URL manipulation
- ✅ `localStorage`: For persistent storage
- ❌ Other Web APIs: Not available by default

> For additional Web APIs, use polyfills from libraries like `core-js`

### The Teevi Object

A global `Teevi` object provides access to platform features and settings:

```typescript
// Access runtime information
const language = Teevi.language // Current language (e.g., "en", "it")
const userAgent = Teevi.userAgent // User agent information

// Get user-provided configuration
const apiKey = Teevi.getInputValueById("api_key")
```

## Building and Distribution

### Build Process

Build your extension with Vite:

```bash
# Add build script to package.json
"scripts": {
  "build": "vite build"
}

# Build the extension
npm run build
```

This creates three files in the `dist` directory:

1. `main.js`: The bundled extension code
2. `manifest.json`: Extension metadata
3. `icon.png`: Extension icon (copied from assets directory)

### Distribution

To distribute your extension:

1. Build the extension (`npm run build`)
2. Deploy the contents of the `dist` directory to a static hosting platform (e.g., GitHub Pages or as a Releases artifact, Netlify, or Vercel)
3. Share the published URL so users can directly access the extension online

Teevi supports **deep linking**, enabling users to directly install extensions from a single URL. This feature simplifies sharing and onboarding.

**Construct a URL like teeviapp://extensions?install={YOUR_DIRECTORY_URL}**

## Best Practices

### Code Quality

1. **Use TypeScript strictly**: Enable `strict: true` in your `tsconfig.json`
2. **Export as default object**: Always export your extension as a default object
3. **Use async/await**: For cleaner asynchronous code

### Performance

1. **Implement caching**: Cache API responses to reduce network requests
2. **Optimize bundles**: Keep dependencies minimal
3. **Lazy load resources**: Load resources only when needed

### User Experience

1. **Support internationalization**: Use `Teevi.language` to provide localized content
2. **Handle edge cases**: Account for missing data or failed requests
3. **Provide meaningful metadata**: Include accurate descriptions, genres, etc.
4. **Implement search correctly**: Ensure search is fast and returns relevant results

## Examples

### Official Teevi Extensions

You can explore these official extensions to see real-world implementations:

- [**TMDB Extension**](https://github.com/teeviapp/teevi-tmdb): Uses The Movie Database API to provide movie and TV show metadata
- [**Jellyfin Extension**](https://github.com/teeviapp/teevi-jellyfin): Integrates with Jellyfin media servers

### Simple Movie Search Extension

```typescript
// src/index.ts
import type { TeeviVideoExtension } from "@teeviapp/core"

export default {
  fetchShowsByQuery: async (query) => {
    const apiKey = Teevi.getInputValueById("api_key")
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}`
    )

    if (!response.ok) return []

    const data = await response.json()
    return data.results.map((movie) => ({
      kind: "movie",
      id: String(movie.id),
      title: movie.title,
      posterURL: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : undefined,
      year: movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : undefined,
    }))
  },

  fetchShow: async (id) => {
    const apiKey = Teevi.getInputValueById("api_key")
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
    )

    if (!response.ok)
      throw new Error(`Failed to fetch movie: ${response.status}`)

    const movie = await response.json()
    return {
      kind: "movie",
      id: String(movie.id),
      title: movie.title,
      posterURL: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : undefined,
      backdropURL: movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : undefined,
      overview: movie.overview,
      releaseDate: movie.release_date,
      duration: movie.runtime * 60, // Convert minutes to seconds
      genres: movie.genres.map((g) => g.name),
    }
  },

  fetchEpisodes: async () => {
    return [] // Movies don't have episodes
  },

  fetchVideoAssets: async (id) => {
    const apiKey = Teevi.getInputValueById("api_key")
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`
    )

    if (!response.ok) return []

    const data = await response.json()
    // Example: find YouTube trailer
    const trailer = data.results.find(
      (video) =>
        video.site === "YouTube" &&
        (video.type === "Trailer" || video.type === "Teaser")
    )

    if (!trailer) return []

    return [
      {
        url: `https://www.youtube.com/watch?v=${trailer.key}`,
      },
    ]
  },
} satisfies TeeviVideoExtension
```

## FAQ

### General Questions

**Q: Can I use third-party libraries in my extension?**  
A: Yes, you can use any npm package as long as it's compatible with the Teevi runtime environment.

**Q: How do I handle authentication for external APIs?**  
A: Use the `inputs` feature to securely collect API keys from users.

**Q: Can my extension have a UI?**  
A: No, extensions only provide data. The Teevi app handles all UI rendering.

**Q: What's the maximum bundle size?**  
A: While there's no hard limit, we recommend keeping your bundle under 500KB for optimal performance.

## Need Help?

- **GitHub**: [Report issues](https://github.com/teeviapp/teevi-ts/issues)
