<template>
  <div>
    yupExists: {{ yupExists }}
    stringMinWorks: {{ stringMinWorks }}
  </div>
</template>

<script setup lang="ts">
const yup = useYup()
const yupExists = computed(() => !!yup)
const stringMinWorks = computed(() => {
  const schema = yup.string().min(3)
  return schema.isValidSync('ab') === false
})
</script>
