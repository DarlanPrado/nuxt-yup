import { defineNuxtModule, addPlugin, createResolver, addImportsDir, addTemplate, addTypeTemplate } from '@nuxt/kit'
import { name, version } from '../package.json'
import type { ModuleOptions } from './types'
import { buildExtensionArtifacts } from './core/buildExtensionArtifacts'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: name,
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {},
  async setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Add base plugin
    addPlugin(resolve('./runtime/plugins/yup'))
    addImportsDir(resolve('./runtime/composables'))

    const artifacts = await buildExtensionArtifacts(nuxt.options.rootDir)

    if (artifacts.typesCode) {
      const typesCode = artifacts.typesCode
      addTypeTemplate({
        filename: 'yup-extensions.d.ts',
        getContents: () => typesCode,
      })
    }

    addTemplate({
      filename: 'yup-extensions.mjs',
      getContents: () => artifacts.templateCode,
    })
  },
})
