import type { LocaleObject } from 'yup'

export interface ModuleOptions {
  /**
   * yup.setLocale function to set custom locale globally
   */
  setLocale?: LocaleObject
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    yup?: ModuleOptions
  }
}
