import * as yup from 'yup'
import type { LocaleObject } from 'yup'
import type { AppConfig } from '@nuxt/schema'
import { defineNuxtPlugin, useAppConfig } from '#imports'
import { applyExtensions } from '#build/yup-extensions.mjs'

type SchemaTypeMap = {
  string: yup.StringSchema<never>
  number: yup.NumberSchema<never>
  boolean: yup.BooleanSchema<never>
  object: yup.ObjectSchema<never>
  array: yup.ArraySchema<never, never>
  date: yup.DateSchema<never>
  mixed: yup.MixedSchema<never>
  schema: yup.Schema<never>
}

export interface Method<K extends keyof SchemaTypeMap = keyof SchemaTypeMap> {
  schema: K
  transform: (
    this: SchemaTypeMap[K],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => SchemaTypeMap[K]
}

interface YupAppConfig extends AppConfig {
  yup?: {
    setLocale?: LocaleObject
    methods?: Record<string, Method>
  }
}

export default defineNuxtPlugin(async () => {
  // 1. Apply generated extensions first
  await applyExtensions(yup)

  // 2. Apply app.config settings
  const { yup: yupConfig } = useAppConfig() as YupAppConfig

  if (!yupConfig) return { provide: { yup } }

  const { setLocale, methods } = yupConfig

  if (setLocale) yup.setLocale(setLocale)

  if (!methods) return { provide: { yup } }

  if (methods && Object.keys(methods).length > 0) {
    for (const [key, method] of Object.entries(methods)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const schemaCandidate: any = method.schema === 'schema' ? yup.Schema : yup[method.schema as keyof typeof yup]

      if (!schemaCandidate || (typeof schemaCandidate !== 'function' && !('prototype' in schemaCandidate))) {
        console.warn(`[nuxt-yup] Method "${key}" skipped: invalid schema reference.`)
        continue
      }
      yup.addMethod(schemaCandidate, key, method.transform)
    }
  }

  // 3. Provide globally
  return { provide: { yup } }
})

