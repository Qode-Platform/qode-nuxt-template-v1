// Fleet contract: nginx forwards the whole /direct/<agent>:<port> prefix
// UNCHANGED, so Nitro must serve every route and asset under it. Baked at
// BUILD time. Empty/unset => serve at the host root.
const raw = (process.env.BASE_PATH ?? '').trim()
const basePath = raw ? `/${raw.replace(/^\/+|\/+$/g, '')}` : ''

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    baseURL: basePath ? `${basePath}/` : '/',
  },
})
