import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/yup', import.meta.url)),
  })

  it('yup validatios', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('stringMinFive: false')
    expect(html).toContain('emailValid: false')
    expect(html).toContain('numberMinTen: false')
    expect(html).toContain('requiredField: false')
    expect(html).toContain('arrayMinTwo: false')
    expect(html).toContain('booleanTest: false')
  })
})
