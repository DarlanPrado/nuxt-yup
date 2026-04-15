import { defineNuxtModule, addPlugin, createResolver, addImportsDir, addTemplate, addTypeTemplate } from '@nuxt/kit'
import { name, version } from '../package.json'
import type { ModuleOptions } from './types'
import { buildExtensionArtifacts } from './core/buildExtensionArtifacts'

export { defineYupExtension } from './types'
export type { AppConfigYupOptions, ModuleOptions, YupExtensionDescriptor, YupExtensionType } from './types'

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

    // Fix ESM/CJS interop: yup's transitive dep tiny-case is CJS-only and fails
    // named-export resolution in the browser when loaded as raw ESM. Adding
    // yup and tiny-case to Vite's optimizeDeps forces pre-bundling on the client
    // dev server, which properly converts CJS→ESM without touching the SSR path.
    nuxt.options.vite.optimizeDeps ??= {}
    nuxt.options.vite.optimizeDeps.include ??= []
    for (const pkg of ['yup', 'tiny-case']) {
      if (!nuxt.options.vite.optimizeDeps.include.includes(pkg)) {
        nuxt.options.vite.optimizeDeps.include.push(pkg)
      }
    }

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
