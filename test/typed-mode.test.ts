import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('Typed Mode (Modo 1)', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/typed-mode', import.meta.url)),
  })

  it('should have typed extensions available', async () => {
    const html = await $fetch('/')
    expect(html).toContain('cnpjValid: true')
    expect(html).toContain('cnpjInvalid: false')
    expect(html).toContain('isEvenValid: true')
    expect(html).toContain('isEvenInvalid: false')
  })
})
