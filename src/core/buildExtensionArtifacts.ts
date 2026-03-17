import { loadExtensions } from './loadExtensions'
import { resolveExtensions } from './resolveExtensions'
import { validateDescriptors } from './validateDescriptors'
import { generateMode1Template, generateMode2Template } from '../generators/runtimeTemplate'
import { generateTypes } from '../generators/typesTemplate'

const EMPTY_TEMPLATE = 'export async function applyExtensions() {}'

export interface ExtensionArtifacts {
  templateCode: string
  typesCode?: string
}

export async function buildExtensionArtifacts(rootDir: string, methodsDir?: string): Promise<ExtensionArtifacts> {
  const extensionPath = resolveExtensions(rootDir, methodsDir)

  if (!extensionPath) {
    if (methodsDir) {
      console.error(
        `[nuxt-yup] Could not find yup.methods file inside "${methodsDir}". Continuing without custom methods.`,
      )
    }
    return { templateCode: EMPTY_TEMPLATE }
  }

  try {
    const loadedExtensions = await loadExtensions(extensionPath)

    if (loadedExtensions.mode === 'mode1') {
      validateDescriptors(loadedExtensions.descriptors)

      return {
        templateCode: generateMode1Template(loadedExtensions.descriptors),
        typesCode: generateTypes(loadedExtensions.descriptors),
      }
    }

    return {
      templateCode: generateMode2Template(loadedExtensions.filePath),
    }
  }
  catch (err) {
    throw new Error(
      `[nuxt-yup] Failed to load yup.methods: ${err instanceof Error ? err.message : String(err)}`,
    )
  }
}
