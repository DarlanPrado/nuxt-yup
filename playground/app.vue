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
import { ref, watch } from 'vue'

const { $yup } = useNuxtApp()
const value = ref('')
const isValid = ref(false)
const errorMessage = ref('')

const validationSchema = $yup.string().required('This field is required')

watch(value, async (newValue) => {
  try {
    await validationSchema.validate(newValue)
    isValid.value = true
    errorMessage.value = ''
  }
  catch (error) {
    isValid.value = false
    errorMessage.value = error.message
  }
})
</script>
