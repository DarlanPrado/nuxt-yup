import { defineNuxtModule, addPlugin, createResolver, addImportsDir, addTemplate, addTypeTemplate } from '@nuxt/kit'
import { name, version } from '../package.json'
import type { ModuleOptions } from './types'
import { buildExtensionArtifacts } from './core/buildExtensionArtifacts'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'yup',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {},
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Add base plugin
    addPlugin(resolve('./runtime/plugins/yup'))
    addImportsDir(resolve('./runtime/composables'))

    const artifacts = await buildExtensionArtifacts(nuxt.options.rootDir, options.methodsDir)

    if (artifacts.typesCode) {
      const typesCode = artifacts.typesCode
      addTypeTemplate({
        filename: 'yup-methods.d.ts',
        getContents: () => typesCode,
      })
    }

    addTemplate({
      filename: 'yup-methods.mjs',
      getContents: () => artifacts.templateCode,
    })
  },
})
