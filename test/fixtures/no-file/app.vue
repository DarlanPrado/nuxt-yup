<template>
  <div>
    <div>
      <p>yupExists: {{ yupExists }}</p>
      <p>stringMinWorks: {{ stringMinWorks }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useYup } from '#imports'

const yup = useYup()

const yupExists = !!yup
let stringMinWorks = false

// Test that basic Yup still works
const schema = yup.string().min(5)

try {
  await schema.validate('valid')
  stringMinWorks = true
}
catch {
  stringMinWorks = false
}
</script>
