# Nuxt Yup

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A [Nuxt](https://nuxt.com) module that integrates [Yup](https://github.com/jquense/yup) — a schema-based value parsing and validation library — making it available globally across your application.

## Features

- 🔌 &nbsp;Auto-imported `useYup()` composable available everywhere
- 🌍 &nbsp;Global locale customization via `app.config.ts`
- 📦 &nbsp;Extend Yup with a `yup.methods.ts` file in your project root
- 🏷️ &nbsp;Full TypeScript support with automatic type augmentation

---

## Quick Setup

Install the module in your Nuxt application:

```bash
npx nuxi@latest module add nuxt-yup
```

That's it! Yup is now available globally in your application. ✨
---

## Usage

Access the full Yup instance anywhere in your app using the `useYup()` composable or the `$yup` plugin.

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

## Configuration

### Customizing error messages (setLocale)

Override Yup's default error messages globally by setting `yup.setLocale` in your `app.config.ts`.

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

Set `methodsDir` when your methods file is not in the Nuxt root directory.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-yup'],
  yup: {
    methodsDir: './shared/validation',
  },
})
```

- The module looks for `yup.methods.*` in this directory.
- If no file is found, the module logs an error in console and continues without custom methods.

---

## yup.methods.ts

For custom Yup methods, create a `yup.methods.ts` file in your **project root**. This is the only supported way to register new methods. The module auto-detects it and supports two modes.

### Typed Mode — `defineYupExtension` (recommended)

Export an array of descriptors using the `defineYupExtension` helper. The module generates TypeScript type augmentations automatically — no manual declarations needed.

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

The module automatically augments the Yup types, so you get full autocomplete:

```ts
// ✅ TypeScript knows about .cnpj() and .isEven()
useYup().string().cnpj()
useYup().number().isEven()
```

---

### Compat Mode — function export

For full control (e.g. when migrating an existing Yup setup), export a function that receives the `yup` instance directly. Type augmentations are **not** generated automatically in this mode.

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

The `yup.methods` file is resolved in the following order from your project root (or from `methodsDir` when configured):

`.ts` → `.mts` → `.cts` → `.js` → `.mjs` → `.cjs`

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
