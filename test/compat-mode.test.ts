import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('Compat Mode (Modo 2)', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/compat-mode', import.meta.url)),
  })

  it('should have compat extensions working', async () => {
    const html = await $fetch('/')
    expect(html).toContain('customStringValid: true')
    expect(html).toContain('customStringInvalid: false')
    expect(html).toContain('customNumberValid: true')
    expect(html).toContain('customNumberInvalid: false')
  })
})
