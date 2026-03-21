/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MEDIA_PROVIDER_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
