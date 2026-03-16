import { existsSync } from 'node:fs'
import { join } from 'node:path'

const EXTENSION_FILE_EXTENSIONS = ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs'] as const

export function resolveExtensions(rootDir: string): string | null {
  for (const ext of EXTENSION_FILE_EXTENSIONS) {
    const filePath = join(rootDir, `yup-extensions.${ext}`)
    if (existsSync(filePath)) {
      return filePath
    }
  }

  return null
}
