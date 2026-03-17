import * as yup from 'yup'
import type { LocaleObject } from 'yup'
import { defineNuxtPlugin, useAppConfig } from '#imports'
import { applyExtensions } from '#build/yup-methods.mjs'

interface YupAppConfigOptions {
  setLocale?: LocaleObject
}

export default defineNuxtPlugin(async () => {
  // 1. Apply generated extensions first
  await applyExtensions(yup)

  // 2. Apply app.config settings
  const yupConfig = useAppConfig().yup as YupAppConfigOptions | undefined

  if (!yupConfig) return { provide: { yup } }

  const { setLocale } = yupConfig

  if (setLocale) yup.setLocale(setLocale)

  // 3. Provide globally
  return { provide: { yup } }
})
