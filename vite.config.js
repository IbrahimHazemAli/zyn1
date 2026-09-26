import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-dev-transform',
      transformIndexHtml(html, ctx) {
        if (ctx.server) {
          return html
            .replace(/<script type="module" crossorigin src="\/assets\/[^"]+"><\/script>/, '<script type="module" src="/src/main.jsx"></script>')
            .replace(/<link rel="stylesheet" crossorigin href="\/assets\/[^"]+">/, '');
        }
        return html;
      }
    }
  ],
  base: '/',
  server: {
    port: 3000,
    host: true
  }
})
