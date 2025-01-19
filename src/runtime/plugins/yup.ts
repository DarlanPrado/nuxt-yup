import * as yup from 'yup'
import { defineNuxtPlugin } from '#app'

declare module '#app' {
  interface NuxtApp {
    $yup: typeof yup
  }
}

export default defineNuxtPlugin((_nuxtApp) => {
  console.log('Plugin injected by my-module!')

  _nuxtApp.$yup = yup
})
