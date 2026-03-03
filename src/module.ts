import { defineNuxtModule, addPlugin, createResolver, addImportsDir, addTemplate, addTypeTemplate } from '@nuxt/kit'
import { name, version } from '../package.json'
import type { ModuleOptions, YupExtensionDescriptor, YupExtensionType } from './types'
import { existsSync } from 'node:fs'
import { join, resolve as nodeResolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = nodeResolve(__filename, '..')

const VALID_TYPES: YupExtensionType[] = [
  'string',
  'number',
  'boolean',
  'object',
  'array',
  'date',
  'mixed',
  'schema',
]

const TYPE_MAP = {
  string: 'Yup.StringSchema',
  number: 'Yup.NumberSchema',
  boolean: 'Yup.BooleanSchema',
  object: 'Yup.ObjectSchema',
  array: 'Yup.ArraySchema',
  date: 'Yup.DateSchema',
  mixed: 'Yup.Schema',
  schema: 'Yup.Schema',
}

/**
 * Resolve yup-extensions file in project root
 */
function resolveExtensions(rootDir: string): string | null {
  const extensions = ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs'] as const
  for (const ext of extensions) {
    const filePath = join(rootDir, `yup-extensions.${ext}`)
    if (existsSync(filePath)) {
      return filePath
    }
  }
  return null
}

/**
 * Detect mode from import
 */
async function detectMode(filePath: string): Promise<'mode1' | 'mode2'> {
  try {
    const imported = await import(filePath)
    const exported = imported.default

    if (Array.isArray(exported)) {
      return 'mode1'
    }

    if (typeof exported === 'function') {
      return 'mode2'
    }

    throw new Error(
      `export default must be Array (Mode 1) or Function (Mode 2), received ${typeof exported}`,
    )
  }
  catch (_err) {
    throw new TypeError(
      `Failed to import yup-extensions: ${_err instanceof Error ? _err.message : String(_err)}`,
    )
  }
}

/**
 * Validate extension descriptors
 */
function validateDescriptors(descriptors: YupExtensionDescriptor[]): void {
  const seenNames = new Set<string>()

  for (const descriptor of descriptors) {
    // Validate name
    if (!descriptor.name || typeof descriptor.name !== 'string') {
      throw new Error('Each descriptor must have a non-empty "name" string')
    }

    if (seenNames.has(descriptor.name)) {
      throw new Error(`Method "${descriptor.name}" is already defined`)
    }
    seenNames.add(descriptor.name)

    // Validate type
    if (!VALID_TYPES.includes(descriptor.type)) {
      throw new Error(
        `Type "${descriptor.type}" is invalid. Must be one of: ${VALID_TYPES.join(', ')}`,
      )
    }

    // Validate validate function
    if (typeof descriptor.validate !== 'function') {
      throw new TypeError(`Descriptor "${descriptor.name}" must have a "validate" function`)
    }

    // Validate message (optional)
    if (descriptor.message && typeof descriptor.message !== 'string') {
      throw new Error(`Descriptor "${descriptor.name}" has invalid "message" (must be string)`)
    }
  }
}

/**
 * Generate template for Mode 1 (typed)
 */
function generateMode1Template(descriptors: YupExtensionDescriptor[]): string {
  const methods = descriptors
    .map((descriptor) => {
      let validateSource = descriptor.validate.toString().trim()
      if (/^async\s+[a-z_$][\w$]*\s*\(/i.test(validateSource)) {
        validateSource = validateSource.replace(/^async\s+[a-z_$][\w$]*\s*\(/i, 'async function (')
      }
      else if (/^[a-z_$][\w$]*\s*\(/i.test(validateSource)) {
        validateSource = validateSource.replace(/^[a-z_$][\w$]*\s*\(/i, 'function (')
      }
      const typeName = TYPE_MAP[descriptor.type]
      const escapedMessage = (descriptor.message || 'Invalid').replace(/'/g, '\\\'')

      return `
  Yup.addMethod(${typeName}, '${descriptor.name}', function (message) {
    return this.test(
      'custom-${descriptor.name}',
      message || '${escapedMessage}',
      (value) => {
        if (value == null) return true;

        const __validate = ${validateSource};

        return Promise.resolve(__validate(value));
      }
    );
  });`
    })
    .join('\n')

  return `import * as Yup from 'yup';

export async function applyExtensions(yup) {
  if (globalThis.__NUXT_YUP_EXTENSIONS__) return;
  globalThis.__NUXT_YUP_EXTENSIONS__ = true;

${methods}
}`
}

/**
 * Generate template for Mode 2 (compat)
 */
function generateMode2Template(filePath: string): string {
  const relativePath = filePath.replace(/\\/g, '/')
  return `import extendYup from '${relativePath}';

export async function applyExtensions(yup) {
  if (globalThis.__NUXT_YUP_EXTENSIONS__) return;
  globalThis.__NUXT_YUP_EXTENSIONS__ = true;

  await extendYup?.(yup);
}`
}

/**
 * Generate TypeScript definitions (Mode 1 only)
 */
function generateTypes(descriptors: YupExtensionDescriptor[]): string {
  // Group descriptors by type
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

  // Generate augmentation for each type
  const augmentations = Object.entries(byType)
    .filter(([_, descriptors]) => descriptors.length > 0)
    .map(([type, descriptors]) => {
      const interfaceName = type === 'schema' ? 'Schema' : `${type.charAt(0).toUpperCase()}${type.slice(1)}Schema`
      const methods = descriptors
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
    let templateCode = `export async function applyExtensions() {}`

    // Add base plugin
    addPlugin(resolve('./runtime/plugins/yup'))
    addImportsDir(resolve('./runtime/composables'))

    // Discover and process yup-extensions
    const rootDir = nuxt.options.rootDir
    const extensionPath = resolveExtensions(rootDir)

    if (extensionPath) {
      try {
        // Detect mode
        const mode = await detectMode(extensionPath)

        let typesCode = ''

        if (mode === 'mode1') {
          // Dynamic import and validate descriptors
          const imported = await import(extensionPath)
          const descriptors: YupExtensionDescriptor[] = imported.default

          validateDescriptors(descriptors)

          // Generate template and types
          templateCode = generateMode1Template(descriptors)
          typesCode = generateTypes(descriptors)

          // Add types template
          addTypeTemplate({
            filename: 'yup-extensions.d.ts',
            getContents: () => typesCode,
          })
        }
        else if (mode === 'mode2') {
          // Generate executor template
          templateCode = generateMode2Template(extensionPath)
        }
      }
      catch (err) {
        throw new Error(
          `[nuxt-yup] Failed to load yup-extensions: ${err instanceof Error ? err.message : String(err)}`,
        )
      }
    }

    // Always emit build template so runtime import is stable
    addTemplate({
      filename: 'yup-extensions.mjs',
      getContents: () => templateCode,
    })
  },
})
