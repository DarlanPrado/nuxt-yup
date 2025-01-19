# Nuxt Yup

A Nuxt module to integrate the yup library.

## ✨ Get started

1. Install and add to Nuxt with one command

```sh
npm install nuxt-yup
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
const { $yup } = useNuxtApp()
const value = ref('')
const isValid = ref(false)

const validationSchema = $yup.string().required('This field is required')

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
        min({ min }) {
          return `the text is too small, it must have at least ${min} characters`
        },
      },
    },
  },
})

```
