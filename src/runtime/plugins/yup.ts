import * as yup from 'yup'
import type { LocaleObject } from 'yup'
import type { AppConfig } from '@nuxt/schema'
import { defineNuxtPlugin, useAppConfig } from '#imports'
import { applyExtensions } from '#build/yup-methods.mjs'

interface YupAppConfig extends AppConfig {
  yup?: {
    setLocale?: LocaleObject
  }
}

export default defineNuxtPlugin(async () => {
  // 1. Apply generated extensions first
  await applyExtensions(yup)

  // 2. Apply app.config settings
  const { yup: yupConfig } = useAppConfig() as YupAppConfig

  if (!yupConfig) return { provide: { yup } }

  const { setLocale } = yupConfig

  if (setLocale) yup.setLocale(setLocale)

  // 3. Provide globally
  return { provide: { yup } }
})
