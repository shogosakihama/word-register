/// <reference types="nuxt" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
    }
  }

  const process: {
    dev: boolean
    server: boolean
    client: boolean
  }
}

declare module '#app' {
  interface NuxtApp {
    $dev?: boolean
  }
}

export {}
