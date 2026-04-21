/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MEDIA_PROVIDER_TOKEN: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
