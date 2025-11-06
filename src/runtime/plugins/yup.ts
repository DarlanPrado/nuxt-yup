import type { InferType, ISchema, AnySchema, AnyObjectSchema } from 'yup';
import * as yup from 'yup'
import type { LocaleObject } from 'yup'
import type { AppConfig } from '@nuxt/schema'
import { defineNuxtPlugin, useAppConfig } from '#imports'

type SchemaTypeMap = {
  string: yup.StringSchema<any, any, any>
  number: yup.NumberSchema<any, any, any>
  boolean: yup.BooleanSchema<any, any, any>
  object: yup.ObjectSchema<any, any, any>
  array: yup.ArraySchema<any, any, any>
  date: yup.DateSchema<any, any, any>
  mixed: yup.MixedSchema<any, any, any>
  schema: yup.Schema<any, any, any>
}

export interface Method<K extends keyof SchemaTypeMap = keyof SchemaTypeMap> {
  schema: K
  transform: (
    this: SchemaTypeMap[K],
    ...args: any[]
  ) => SchemaTypeMap[K]
}

interface YupAppConfig extends AppConfig {
  yup?: {
    setLocale?: LocaleObject
    methods?: Record<string, Method>
  }
}

export default defineNuxtPlugin(() => {
  const { yup: yupConfig } = useAppConfig() as YupAppConfig

  if (!yupConfig) return { provide: { yup } }

  const { setLocale, methods } = yupConfig

  if (setLocale) yup.setLocale(setLocale)

  if (!methods) return { provide: { yup } }

  if (methods && Object.keys(methods).length > 0) {
    for (const [key, method] of Object.entries(methods)) {
      const schemaCandidate: any = method.schema === 'schema' ? yup.Schema : yup[method.schema as keyof typeof yup]

      if (!schemaCandidate || (typeof schemaCandidate !== 'function' && !('prototype' in schemaCandidate))) {
        console.warn(`[nuxt-yup] Method "${key}" skipped: invalid schema reference.`)
        continue
      }
      yup.addMethod(schemaCandidate, key, method.transform)
    }
  }

  return { provide: { yup } }
})
