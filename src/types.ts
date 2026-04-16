import type { LocaleObject } from 'yup'

export type YupExtensionType
  = 'string'
    | 'number'
    | 'boolean'
    | 'object'
    | 'array'
    | 'date'
    | 'mixed'
    | 'schema'

export interface YupExtensionDescriptor {
  name: string
  type: YupExtensionType
  message?: string
  validate(value: unknown): boolean | Promise<boolean>
}

/**
 * Define Yup extensions (Modo 1 - Tipado)
 *
 * @example
 * ```ts
 * export default defineYupExtension([
 *   {
 *     name: 'cnpj',
 *     type: 'string',
 *     message: 'CNPJ inválido',
 *     validate(value: string) {
 *       const regex = /^\d{14}$/
 *       return regex.test(value)
 *     }
 *   }
 * ])
 * ```
 */
export function defineYupExtension(
  descriptors: YupExtensionDescriptor[],
): YupExtensionDescriptor[] {
  return descriptors
}

export interface ModuleOptions {
  /**
   * Optional directory containing `yup.methods.*`.
   *
   * If omitted, the module looks in the Nuxt root directory.
   * If provided and no file is found, the module logs an error and continues.
   */
  methodsDir?: string
}

export interface AppConfigYupOptions {
  /**
   *yup.setLocale function to set custom locale globally
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
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    yup?: ModuleOptions
  }

  interface NuxtOptions {
    yup: ModuleOptions
  }

  interface AppConfigInput {
    yup?: AppConfigYupOptions
  }
}
