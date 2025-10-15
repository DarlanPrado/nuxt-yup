import * as yup from 'yup'
import type { LocaleObject } from 'yup'
import type { AppConfig } from '@nuxt/schema'
import { defineNuxtPlugin, useAppConfig } from '#imports'

interface YupAppConfig extends AppConfig {
  yup?: {
    setLocale?: LocaleObject
  }
}

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig() as YupAppConfig

  const setLocale = appConfig.yup?.setLocale

  console.log('setLocale', appConfig)

  if (setLocale) {
    yup.setLocale(setLocale)
  }

  return { provide: { yup } }
})
