<template>
  <div>
    <div>
      <p>customStringValid: {{ customStringValid }}</p>
      <p>customStringInvalid: {{ customStringInvalid }}</p>
      <p>customNumberValid: {{ customNumberValid }}</p>
      <p>customNumberInvalid: {{ customNumberInvalid }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useYup } from '#imports'

const yup = useYup()

let customStringValid = false
let customStringInvalid = false
let customNumberValid = false
let customNumberInvalid = false

// Test customString validator
// @ts-expect-error - Method added dynamically at build-time
const customStringSchema = yup.string().customString()
// @ts-expect-error - Method added dynamically at build-time
const customStringInvalidSchema = yup.string().customString()

try {
  await customStringSchema.validate('valid-test')
  customStringValid = true
}
catch {
  customStringValid = false
}

try {
  await customStringInvalidSchema.validate('invalid-test')
  customStringInvalid = true
}
catch {
  customStringInvalid = false
}

// Test customNumber validator
// @ts-expect-error - Method added dynamically at build-time
const customNumberSchema = yup.number().customNumber()
// @ts-expect-error - Method added dynamically at build-time
const customNumberInvalidSchema = yup.number().customNumber()

try {
  await customNumberSchema.validate(150)
  customNumberValid = true
}
catch {
  customNumberValid = false
}

try {
  await customNumberInvalidSchema.validate(50)
  customNumberInvalid = true
}
catch {
  customNumberInvalid = false
}
</script>
