import { existsSync } from 'node:fs'
import { isAbsolute, join, resolve } from 'node:path'

const METHODS_FILE_EXTENSIONS = ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs'] as const

export function resolveExtensions(rootDir: string, methodsDir?: string): string | null {
  const searchDir = methodsDir
    ? (isAbsolute(methodsDir) ? methodsDir : resolve(rootDir, methodsDir))
    : rootDir

  for (const ext of METHODS_FILE_EXTENSIONS) {
    const filePath = join(searchDir, `yup.methods.${ext}`)
    if (existsSync(filePath)) {
      return filePath
    }
  }

  return null
}
