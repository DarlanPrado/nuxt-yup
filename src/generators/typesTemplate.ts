import type { YupExtensionDescriptor, YupExtensionType } from '../types'

export function generateTypes(descriptors: YupExtensionDescriptor[]): string {
  const byType: Record<YupExtensionType, YupExtensionDescriptor[]> = {
    string: [],
    number: [],
    boolean: [],
    object: [],
    array: [],
    date: [],
    mixed: [],
    schema: [],
  }

  for (const descriptor of descriptors) {
    byType[descriptor.type].push(descriptor)
  }

  const augmentations = Object.entries(byType)
    .filter(([_, typedDescriptors]) => typedDescriptors.length > 0)
    .map(([type, typedDescriptors]) => {
      const interfaceName = type === 'schema'
        ? 'Schema'
        : `${type.charAt(0).toUpperCase()}${type.slice(1)}Schema`

      const methods = typedDescriptors
        .map(d => `    ${d.name}(message?: string): ${interfaceName};`)
        .join('\n')

      return `
  interface ${interfaceName} {
${methods}
  }`
    })
    .join('\n')

  return `import type {
  StringSchema,
  NumberSchema,
  BooleanSchema,
  ObjectSchema,
  ArraySchema,
  DateSchema,
  Schema
} from 'yup';

declare module 'yup' {${augmentations}
}

export declare function defineYupExtension(
  descriptors: Array<{
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date' | 'mixed' | 'schema';
    message?: string;
    validate(value: any): boolean | Promise<boolean>;
  }>
): void;
`
}
