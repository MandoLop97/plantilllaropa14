
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare module 'virtual:pwa-register/react' {
  import type { Ref } from 'react'
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export interface PWABuildInfo {
    mode: string
    webManifest?: {
      href: string
      useCredentials?: boolean
    }
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [boolean, Ref<boolean>]
    offlineReady: [boolean, Ref<boolean>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
