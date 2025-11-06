# Nuxt Yup

A Nuxt module to integrate the yup library.

## ✨ Get started

1. Install and add to Nuxt with one command

```sh
npx nuxi@latest module add nuxt-yup
```
## Usage Example

```html
<template>
  <div>
    <input
      v-model="value"
      placeholder="Enter value"
    >
    <p>{{ value }}</p>
    <p>is valid: {{ isValid }}</p>
  </div>
</template>

<script setup>
const yup = useYup() // you can use "const { $yup } = useNuxtApp()"
const value = ref('')
const isValid = ref(false)

const validationSchema = yup.string().required('This field is required')

watch(value, async (newValue) => {
  try {
    await validationSchema.validate(newValue)
    isValid.value = true
  }
  catch (e) {
    console.error(e)
    isValid.value = false
  }
})
</script>
```
endpoints are linked globally and can be accessed from anywhere

## 📖 Docs

view more from Yup in [Yup documentation](https://www.npmjs.com/package/yup).

### Define setLocale by  [app.config.ts](https://nuxt.com/docs/guide/directory-structure/app-config)
If you want to customize your error messages you can do this directly through "app.config.ts" using setLocale.

```bash
# app.config.ts
export default defineAppConfig({
  yup: {
    setLocale: {
      string: {
        min: 'Must be at least ${min} letters',
      },
    },
  },
})
```

### Add new methods by  [app.config.ts](https://nuxt.com/docs/guide/directory-structure/app-config)
You can also define your own validation methods directly in "app.config.ts".

```bash
# app.config.ts
export default defineAppConfig({
  yup: {
    methods: {
      noWhitespace: {
        schema: 'string',
        transform(message = 'Cannot contain spaces') {
          return this.test(
            'no-whitespace',
            message,
            value => typeof value !== 'string' || !/\s/.test(value)
          )
        }
      }
    }
  },
})
```

Each key represents the name of the custom method.
In the example above, you can now use:

```bash
useYup().string().noWhitespace()
```
#### Adding TypeScript Support for Custom Methods
if you need add type from you method, you can declare module yup

```bash
declare module 'yup' {
  interface StringSchema {
    noWhitespace(...args: any[]): this;
  }
}
```
