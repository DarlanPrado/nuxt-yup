import type { YupExtensionDescriptor } from '../types'

export type ExtensionMode = 'mode1' | 'mode2'

export type LoadedExtensions
  = { mode: 'mode1', descriptors: YupExtensionDescriptor[] }
    | { mode: 'mode2', filePath: string }

export async function loadExtensions(filePath: string): Promise<LoadedExtensions> {
  try {
    const imported = await import(filePath)
    const exported = imported.default

    if (Array.isArray(exported)) {
      return {
        mode: 'mode1',
        descriptors: exported as YupExtensionDescriptor[],
      }
    }

    if (typeof exported === 'function') {
      return {
        mode: 'mode2',
        filePath,
      }
    }

    throw new Error(
      `export default must be Array (Mode 1) or Function (Mode 2), received ${typeof exported}`,
    )
  }
  catch (err) {
    throw new TypeError(
      `Failed to import yup-extensions: ${err instanceof Error ? err.message : String(err)}`,
    )
  }
}
