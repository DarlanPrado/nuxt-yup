import type { LocaleObject } from 'yup'
import type { Method } from './runtime/plugins/yup'

export interface ModuleOptions {
  /**
  * yup.setLocale function to set custom locale globally
  * 
  * Wraps `yup.setLocale()`.
  * 
  * @example 
  * ```ts
  * setLocale: {
  *  string: {
  *    min: 'Must be at least ${min} letters',
  *   },
  * },
  * ```
  */
  setLocale?: LocaleObject
  /**
  * yup.addMethod function to set custom locale globally
  * 
  * Wraps `yup.addMethod()`.  
  * Each key represents the name of the method being added.
  * 
  * Supported schema types:
  * `'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'mixed' | 'schema'`
  * 
  * @example
  * ```ts
  *methods: {
  *   noWhitespace: {
  *     schema: 'string',
  *     transform(message = 'Cannot contain spaces') {
  *       return this.test(
  *         'no-whitespace',
  *         message,
  *         value => typeof value !== 'string' || !/\s/.test(value)
  *       )
  *     }
  *   }
  * }
  * ```
  */
  methods?: Record<string, Method>
}

declare module '@nuxt/schema' {
  interface AppConfigInput {
    yup?: ModuleOptions
  }
}
