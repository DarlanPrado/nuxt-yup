<template>
  <main style="max-width: 900px; margin: 32px auto; font-family: sans-serif; line-height: 1.4">
    <h1>nuxt-yup playground</h1>
    <p><strong>Extension mode:</strong> {{ mode }}</p>
    <p style="opacity: .8">
      Troque o modo com <code>NUXT_YUP_EXT_MODE=typed</code> ou <code>NUXT_YUP_EXT_MODE=compat</code> e reinicie.
    </p>

    <section style="margin-top: 24px">
      <h2>1) app.config methods + setLocale</h2>
      <input v-model="baseValue" placeholder="Digite um texto" style="padding: 8px; min-width: 260px">
      <button style="margin-left: 8px" @click="runBaseValidation">Validar</button>
      <p><strong>Resultado:</strong> {{ baseResult }}</p>
      <p><strong>Mensagem:</strong> {{ baseMessage || '-' }}</p>
      <small>Regra: required + min(5) + noWhitespace() + hasNuxtPrefix()</small>
    </section>

    <section style="margin-top: 24px">
      <h2>2) extensions ({{ mode }})</h2>
      <template v-if="mode === 'typed'">
        <input v-model="typedString" placeholder="CNPJ (14 dígitos)" style="padding: 8px; min-width: 260px">
        <button style="margin-left: 8px" @click="runTypedString">Validar CNPJ</button>
        <p><strong>cnpj:</strong> {{ typedStringResult }} | {{ typedStringMessage || '-' }}</p>

        <input v-model.number="typedNumber" type="number" placeholder="Número par" style="padding: 8px; min-width: 260px; margin-top: 8px">
        <button style="margin-left: 8px" @click="runTypedNumber">Validar evenAsync</button>
        <p><strong>evenAsync:</strong> {{ typedNumberResult }} | {{ typedNumberMessage || '-' }}</p>
      </template>

      <template v-else>
        <input v-model="compatString" placeholder="Documento (>=6 chars)" style="padding: 8px; min-width: 260px">
        <button style="margin-left: 8px" @click="runCompatString">Validar documentId</button>
        <p><strong>documentId:</strong> {{ compatStringResult }} | {{ compatStringMessage || '-' }}</p>

        <input v-model.number="compatNumber" type="number" placeholder="> 10" style="padding: 8px; min-width: 260px; margin-top: 8px">
        <button style="margin-left: 8px" @click="runCompatNumber">Validar greaterThanAsync</button>
        <p><strong>greaterThanAsync:</strong> {{ compatNumberResult }} | {{ compatNumberMessage || '-' }}</p>
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { ValidationError } from 'yup'

const { $yup: yup } = useNuxtApp()
const config = useRuntimeConfig()
const mode = config.public.yupExtMode as 'typed' | 'compat'

const baseValue = ref('')
const baseResult = ref<'idle' | 'valid' | 'invalid'>('idle')
const baseMessage = ref('')

const typedString = ref('')
const typedNumber = ref<number | null>(null)
const typedStringResult = ref<'idle' | 'valid' | 'invalid'>('idle')
const typedStringMessage = ref('')
const typedNumberResult = ref<'idle' | 'valid' | 'invalid'>('idle')
const typedNumberMessage = ref('')

const compatString = ref('')
const compatNumber = ref<number | null>(null)
const compatStringResult = ref<'idle' | 'valid' | 'invalid'>('idle')
const compatStringMessage = ref('')
const compatNumberResult = ref<'idle' | 'valid' | 'invalid'>('idle')
const compatNumberMessage = ref('')

async function validateAndCapture(schema: any, value: unknown) {
  try {
    await schema.validate(value)
    return { ok: true, message: '' }
  }
  catch (error) {
    const err = error as ValidationError
    return { ok: false, message: err?.message || 'Invalid' }
  }
}

async function runBaseValidation() {
  const schema = (yup.string().required().min(5) as any).noWhitespace().hasNuxtPrefix()
  const result = await validateAndCapture(schema, baseValue.value)
  baseResult.value = result.ok ? 'valid' : 'invalid'
  baseMessage.value = result.message
}

async function runTypedString() {
  const schema = (yup.string() as any).cnpj('Documento inválido')
  const result = await validateAndCapture(schema, typedString.value)
  typedStringResult.value = result.ok ? 'valid' : 'invalid'
  typedStringMessage.value = result.message
}

async function runTypedNumber() {
  const schema = (yup.number() as any).evenAsync('Número deve ser par')
  const result = await validateAndCapture(schema, typedNumber.value)
  typedNumberResult.value = result.ok ? 'valid' : 'invalid'
  typedNumberMessage.value = result.message
}

async function runCompatString() {
  const schema = (yup.string() as any).documentId('Documento curto')
  const result = await validateAndCapture(schema, compatString.value)
  compatStringResult.value = result.ok ? 'valid' : 'invalid'
  compatStringMessage.value = result.message
}

async function runCompatNumber() {
  const schema = (yup.number() as any).greaterThanAsync(10, 'Precisa ser > 10')
  const result = await validateAndCapture(schema, compatNumber.value)
  compatNumberResult.value = result.ok ? 'valid' : 'invalid'
  compatNumberMessage.value = result.message
}
</script>
