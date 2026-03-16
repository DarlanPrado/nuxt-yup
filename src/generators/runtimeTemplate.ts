import { TYPE_MAP } from '../constants'
import type { YupExtensionDescriptor } from '../types'

function normalizeValidateSource(source: string): string {
  if (/^async\s+[a-z_$][\w$]*\s*\(/i.test(source))
    return source.replace(/^async\s+[a-z_$][\w$]*\s*\(/i, 'async function (')
  if (/^[a-z_$][\w$]*\s*\(/i.test(source))
    return source.replace(/^[a-z_$][\w$]*\s*\(/i, 'function (')
  return source
}

export function generateMode1Template(descriptors: YupExtensionDescriptor[]): string {
  const validators: string[] = []
  const methods: string[] = []

  for (const descriptor of descriptors) {
    const validateSource = normalizeValidateSource(descriptor.validate.toString().trim())
    const typeName = TYPE_MAP[descriptor.type]
    const escapedMessage = (descriptor.message || 'Invalid').replace(/'/g, '\\\'')
    const validatorVar = `__validate_${descriptor.name}`

    validators.push(`const ${validatorVar} = ${validateSource};`)

    methods.push(`
  Yup.addMethod(${typeName}, '${descriptor.name}', function (message) {
    return this.test(
      'custom-${descriptor.name}',
      message || '${escapedMessage}',
      (value) => {
        if (value == null) return true;
        const result = ${validatorVar}(value);
        return result instanceof Promise ? result : Promise.resolve(result);
      }
    );
  });`)
  }

  return `import * as Yup from 'yup';

${validators.join('\n')}

export async function applyExtensions(yup) {
  if (globalThis.__NUXT_YUP_EXTENSIONS__) return;
  globalThis.__NUXT_YUP_EXTENSIONS__ = true;

${methods.join('\n')}
}`
}

export function generateMode2Template(filePath: string): string {
  const relativePath = filePath.replace(/\\/g, '/')

  return `import extendYup from '${relativePath}';

export async function applyExtensions(yup) {
  if (globalThis.__NUXT_YUP_EXTENSIONS__) return;
  globalThis.__NUXT_YUP_EXTENSIONS__ = true;

  await extendYup?.(yup);
}`
}
