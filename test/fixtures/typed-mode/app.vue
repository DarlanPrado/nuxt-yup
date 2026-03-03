<template>
  <div>
    <div>
      <p>cnpjValid: {{ cnpjValid }}</p>
      <p>cnpjInvalid: {{ cnpjInvalid }}</p>
      <p>isEvenValid: {{ isEvenValid }}</p>
      <p>isEvenInvalid: {{ isEvenInvalid }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useYup } from '#imports'

const yup = useYup()

// Test CNPJ validator
// @ts-expect-error - Method added dynamically at build-time
const cnpjSchema = yup.string().cnpj()
// @ts-expect-error - Method added dynamically at build-time
const cnpjInvalidSchema = yup.string().cnpj()

let cnpjValid = false
let cnpjInvalid = false
let isEvenValid = false
let isEvenInvalid = false

// Test valid CNPJ
try {
  await cnpjSchema.validate('12345678901234')
  cnpjValid = true
}
catch {
  cnpjValid = false
}

// Test invalid CNPJ
try {
  await cnpjInvalidSchema.validate('invalid')
  cnpjInvalid = true
}
catch {
  cnpjInvalid = false
}

// Test isEven validator
// @ts-expect-error - Method added dynamically at build-time
const isEvenSchema = yup.number().isEven()
// @ts-expect-error - Method added dynamically at build-time
const isEvenInvalidSchema = yup.number().isEven()

try {
  await isEvenSchema.validate(4)
  isEvenValid = true
}
catch {
  isEvenValid = false
}

try {
  await isEvenInvalidSchema.validate(3)
  isEvenInvalid = true
}
catch {
  isEvenInvalid = false
}
</script>
