import * as yup from 'yup'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()

  const setLocale = runtimeConfig.public.yup?.setLocale

  if (setLocale) {
    yup.setLocale(setLocale)
  }

  return { provide: { yup } }
})
