export type YupSchema = typeof import('yup')

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
