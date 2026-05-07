import { defineConfig } from "vite"
import teevi from "@teeviapp/vite"

export default defineConfig({
  plugins: [
    teevi({
      name: "<%= displayName %>",
      capabilities: [<%= capabilities %>],
    }),
  ],
})
