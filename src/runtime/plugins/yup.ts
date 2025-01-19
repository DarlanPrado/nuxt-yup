import * as yup from 'yup'
import { defineNuxtPlugin, useAppConfig } from '#app'

declare module '#app' {
  interface NuxtApp {
    $yup: typeof yup
  }
}

interface YupSchema {
  setLocale?: yup.LocaleObject
}

declare module 'nuxt/schema' {
  interface AppConfigInput {
    yup?: YupSchema
  }
}

export default defineNuxtPlugin((_nuxtApp) => {
  const yupAppConfig = useAppConfig().yup as YupSchema || null

  if (yupAppConfig?.setLocale) {
    yup.setLocale(yupAppConfig.setLocale!)
  }

  _nuxtApp.$yup = yup
})
