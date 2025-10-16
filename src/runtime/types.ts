import type * as yup from 'yup'

export type YupSchema = typeof yup

declare module '#app' {
  interface NuxtApp {
    $yup: YupSchema
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $yup: YupSchema
  }
}
