import type { LocaleObject } from 'yup'
import type { Method } from './runtime/plugins/yup'

export interface ModuleOptions {
  /**
   * yup.setLocale function to set custom locale globally
   */
  setLocale?: LocaleObject
  methods?: Record<string, Method>
}

declare module '@nuxt/schema' {
  interface AppConfigInput {
    yup?: ModuleOptions
  }
}
