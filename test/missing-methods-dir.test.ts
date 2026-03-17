import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('Missing methodsDir file', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/missing-methods-dir', import.meta.url)),
  })

  it('should continue without custom methods when methodsDir is invalid', async () => {
    const html = await $fetch('/')
    expect(html).toContain('yupExists: true')
    expect(html).toContain('stringMinWorks: true')
  })
})
