# 📺 Teevi SDK for TypeScript

[![npm version](https://img.shields.io/npm/v/@teeviapp/core.svg?style=flat-square)](https://www.npmjs.com/package/@teeviapp/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-Apache--2.0-green?style=flat-square)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](#)

The official TypeScript SDK for building powerful, type-safe extensions for the **Teevi** platform. Integrate movies, series, live TV, and custom feeds with ease.

[Quick Start](#🚀-quick-start) • [Capabilities](#🛠-capabilities) • [User Inputs](#⌨️-user-inputs) • [Runtime](#🌐-runtime-environment) • [Distribution](#📦-distribution)

---

## 🚀 Quick Start

The fastest way to start is using our interactive scaffolding tool. It sets up a complete project with TypeScript, Vite, and all required method stubs.

```bash
npx @teeviapp/create-extension
```

### What's inside the box?

- **@teeviapp/core**: Type definitions and runtime bindings.
- **@teeviapp/vite**: Specialized plugin to bundle your extension and auto-generate the `manifest.json`.

---

## 🛠 Capabilities

Teevi extensions are modular. You can implement one or more of the following interfaces:

| Capability   | Interface                | Primary Purpose                                  |
| :----------- | :----------------------- | :----------------------------------------------- |
| **Metadata** | `TeeviMetadataExtension` | Search and retrieve details for Movies & Series. |
| **Video**    | `TeeviVideoExtension`    | Provide streaming URLs (MP4, HLS, DASH).         |
| **Feed**     | `TeeviFeedExtension`     | Create "Home" collections or "Trending" lists.   |
| **Live TV**  | `TeeviLiveExtension`     | Integrate live channels and EPG data.            |
| **Auth**     | `TeeviAuthExtension`     | Handle user authentication and user sessions.   |

### Example implementation

```typescript
import type { TeeviVideoExtension } from "@teeviapp/core"

export default {
  fetchShowsByQuery: async (query) => {
    // Search logic here...
    return []
  },
  fetchVideoAssets: async (mediaId) => {
    // Return stream URLs...
    return [{ url: "https://example.com/stream.m3u8" }]
  },
} satisfies TeeviVideoExtension
```

---

## ⌨️ User Inputs

Inputs allow you to request configuration from users (e.g., API Keys, Server URLs).

1. **Define** them in your `vite.config.ts`:

   ```typescript
   teevi({
     inputs: [{ id: "token", name: "Access Token", required: true }],
   })
   ```

2. **Access** them in your code:
   ```typescript
   const token = Teevi.getInputValueById("token")
   ```

---

## 🔒 Authentication & Sessions

For extensions that require user login, you can implement the `TeeviAuthExtension` capability. This enables secure, platform-orchestrated user sessions.

1. **Define** authentication credentials in your `vite.config.ts`:

   ```typescript
   teevi({
     capabilities: ["auth"],
     credentials: [
       { id: "username", name: "Username", required: true },
       { id: "password", name: "Password", required: true, secret: true },
     ],
   })
   ```

2. **Implement** the `TeeviAuthExtension` interface:

   ```typescript
   import type { TeeviAuthExtension, TeeviSession } from "@teeviapp/core"

   export default {
     login: async (credentials) => {
       const { username, password } = credentials

       // Perform network authentication request
       const response = await fetch("https://api.example.com/login", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ username, password })
       })

       if (!response.ok) throw new Error("Invalid credentials")
       const data = await response.json()

       // Return a TeeviSession object (delegates storage to the host)
       return {
         token: data.accessToken,
         refreshToken: data.refreshToken,
         user: { username }
       } satisfies TeeviSession
     }
   } satisfies TeeviAuthExtension
   ```

3. **Manage** session tokens in your content requests:

   ```typescript
   // Retrieve the active session token saved by the host platform
   const session = await Teevi.getSession()
   if (session) {
     const token = session.token
     // Use the token in authorization headers...
   }
   ```

---

## 🌐 Runtime Environment

Extensions run in a secure sandbox. While most logic is standard TypeScript, the environment has specific constraints:

- **✅ Available APIs**: `fetch`, `localStorage`, `URL`, `URLSearchParams`, `console`.
- **❌ Unavailable**: Node.js built-ins (`fs`, `path`), DOM manipulation, and `eval`.
- **🌍 Localization**: Use `Teevi.language` (e.g., `"en"`, `"it"`) to provide translated content.

---

## 📦 Distribution

Building your extension is simple:

```bash
npm run build
```

This generates a `dist` folder containing `main.js`, `manifest.json`, and your `icon.png`.

### 🚀 Deploy in seconds

1. Upload the `dist` folder to any static host (GitHub Pages, Netlify, Vercel).
2. Share the installation link:
   `teeviapp://extensions?url=https://your-domain.com/path-to-dist/`

---

## 🌟 Examples

- [**Official Extensions**](https://github.com/teeviapp/teevi-official-extensions)

---

<p align="center">
  Built with ❤️ by the Teevi Team<br>
  <a href="https://github.com/teeviapp/teevi-ts/issues">Report an issue</a> • <a href="https://github.com/teeviapp/teevi-ts">Contribute</a>
</p>
