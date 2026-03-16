import { VALID_TYPES } from '../constants'
import type { YupExtensionDescriptor } from '../types'

export function validateDescriptors(descriptors: YupExtensionDescriptor[]): void {
  const seenNames = new Set<string>()

  for (const descriptor of descriptors) {
    if (!descriptor.name || typeof descriptor.name !== 'string') {
      throw new Error('Each descriptor must have a non-empty "name" string')
    }

    if (seenNames.has(descriptor.name)) {
      throw new Error(`Method "${descriptor.name}" is already defined`)
    }
    seenNames.add(descriptor.name)

    if (!VALID_TYPES.includes(descriptor.type)) {
      throw new Error(
        `Type "${descriptor.type}" is invalid. Must be one of: ${VALID_TYPES.join(', ')}`,
      )
    }

    if (typeof descriptor.validate !== 'function') {
      throw new TypeError(`Descriptor "${descriptor.name}" must have a "validate" function`)
    }

    if (descriptor.message && typeof descriptor.message !== 'string') {
      throw new Error(`Descriptor "${descriptor.name}" has invalid "message" (must be string)`)
    }
  }
}
