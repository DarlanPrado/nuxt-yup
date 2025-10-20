import { defineNuxtModule, addPlugin, createResolver, addImportsDir } from '@nuxt/kit'
import { name, version } from '../package.json'
import type { ModuleOptions } from './types'

// Module options TypeScript interface definition
// export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: name,
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addPlugin(resolve('./runtime/plugins/yup'))
    addImportsDir(resolve('./runtime/composables'))
  },
})
