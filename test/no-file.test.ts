import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('No File (Backward Compat)', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/no-file', import.meta.url)),
  })

  it('should work without yup.methods file', async () => {
    const html = await $fetch('/')
    expect(html).toContain('yupExists: true')
    expect(html).toContain('stringMinWorks: true')
  })
})
