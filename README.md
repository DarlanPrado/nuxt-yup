# Nuxt Yup

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A [Nuxt](https://nuxt.com) module that brings [Yup](https://github.com/jquense/yup) into your app with first-class Nuxt integration, global access, and typed extension support.

## Features

- 🔌 &nbsp;Use Yup anywhere with the auto-imported `useYup()` composable
- 🌍 &nbsp;Configure global validation messages through `app.config.ts`
- 📦 &nbsp;Add custom methods from `yup.methods.ts`
- 🏷️ &nbsp;Automatically generate TypeScript types for custom Yup methods

---

## Why use nuxt-yup?

`nuxt-yup` gives you a Nuxt-native Yup workflow with minimal setup.

- Auto-imported `useYup()` composable
- Global configuration through `app.config.ts`
- Typed custom Yup extensions
- Seamless Nuxt runtime integration
- Better DX with less boilerplate

---

## Quick Example

```ts
const yup = useYup()

const userSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  document: yup.string().cnpj(), // custom method from yup.methods.ts
})

const sampleUser = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  document: '12345678901234',
}

await userSchema.validate(sampleUser)
```

---

## Quick Setup

Install the module in your Nuxt project:

```bash
npx nuxi@latest module add nuxt-yup
```

Yup is now available globally in your app.
---

## Usage

Access Yup anywhere with `useYup()` or the `$yup` plugin.

```vue
<template>
  <div>
    <input v-model="value" placeholder="Enter a value" />
    <p>Is valid: {{ isValid }}</p>
  </div>
</template>

<script setup>
const yup = useYup()
// or: const { $yup } = useNuxtApp()

const value = ref('')
const isValid = ref(false)

const schema = yup.string().min(3).required()

watch(value, async (newValue) => {
  isValid.value = await schema.isValid(newValue)
})
</script>
```

---

## Comparison

| Feature | Yup | nuxt-yup |
|---|---|---|
| Auto-import composable | Manual import and wiring | `useYup()` available automatically |
| Global config | Manual setup in app bootstrap | Configure with `app.config.ts` |
| Typed extensions | Manual declaration merging | Typed descriptors + generated augmentation |
| Nuxt developer experience | Generic library usage | Nuxt-first integration and DX |

---

## Configuration

### Customizing error messages (setLocale)

Override Yup default messages globally with `yup.setLocale` in `app.config.ts`.

```ts
// app.config.ts
export default defineAppConfig({
  yup: {
    setLocale: {
      mixed: {
        required: 'This field is required',
      },
      string: {
        min: 'Must be at least ${min} characters',
        email: 'Must be a valid email address',
      },
      number: {
        min: 'Must be at least ${min}',
        max: 'Must be at most ${max}',
      },
    },
  },
})
```

> See the full list of keys in the [Yup locale documentation](https://github.com/jquense/yup?tab=readme-ov-file#error-message-customization).

---

### Module options (nuxt.config.ts)

Use `methodsDir` when your methods file is outside the Nuxt root.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-yup'],
  yup: {
    methodsDir: './shared/validation',
  },
})
```

- The module searches this directory for `yup.methods.*`.
- If no file is found, it logs an error and continues without custom methods.

---

## yup.methods.ts

Create a `yup.methods.ts` file in your **project root** to register custom methods. The module auto-detects it and supports two modes.

### Typed Mode — `defineYupExtension` (recommended)

Export an array of descriptors with `defineYupExtension`. Type augmentations are generated automatically.

```ts
// yup.methods.ts
import { defineYupExtension } from 'nuxt-yup'

export default defineYupExtension([
  {
    name: 'cnpj',
    type: 'string',
    message: 'Invalid CNPJ',
    validate(value: string) {
      return /^\d{14}$/.test(value)
    },
  },
  {
    name: 'isEven',
    type: 'number',
    message: 'Must be an even number',
    async validate(value: number) {
      return value % 2 === 0
    },
  },
])
```

Each descriptor accepts:

| Property | Type | Description |
|---|---|---|
| `name` | `string` | Method name to add to the schema |
| `type` | `YupExtensionType` | Yup schema type to extend |
| `message` | `string` (optional) | Default error message |
| `validate` | `(value) => boolean \| Promise<boolean>` | Validation logic (sync or async) |

Yup types are automatically augmented, so you get full autocomplete:

```ts
// ✅ TypeScript knows about .cnpj() and .isEven()
useYup().string().cnpj()
useYup().number().isEven()
```

---

### Compat Mode — function export

For full control (for example, migrations from an existing setup), export a function that receives the `yup` instance directly. Type augmentations are **not** generated in this mode.

```ts
// yup.methods.ts
import type * as Yup from 'yup'

export default function extendYup(yup: typeof Yup) {
  yup.addMethod(yup.StringSchema, 'documentId', function (message = 'Invalid document') {
    return this.test('document-id', message, (value) => {
      if (value == null) return true
      return typeof value === 'string' && value.length >= 6
    })
  })
}
```

---

## Supported file extensions

The `yup.methods` file is resolved in this order from your project root (or from `methodsDir`):

`.ts` → `.mts` → `.cts` → `.js` → `.mjs` → `.cjs`

---

## Works well with

- Nuxt 3 / Nuxt 4
- TypeScript
- [vee-validate](https://vee-validate.logaretm.com/)
- Nuxt server routes (`server/api/*`)

---

## Contributing

Contributions are welcome. Open an issue for bugs or feature ideas, and submit a PR when you're ready.

For local development and test commands, see [package.json](package.json).

---

## License

[MIT](./LICENSE) — Made with ❤️ by [Darlan Prado](https://github.com/DarlanPrado)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-yup/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-yup

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-yup.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-yup

[license-src]: https://img.shields.io/npm/l/nuxt-yup.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-yup

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
