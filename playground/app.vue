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
