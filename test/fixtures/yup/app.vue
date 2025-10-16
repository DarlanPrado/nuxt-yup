<template>
  <div>
    <p v-for="(value, key) in checks" :key="key">
      {{ `${key}: ${value}` }}
    </p>
  </div>
</template>

<script setup>
const yup = useYup()

const yupTest = async (schemaObject, data) => {
  const schema = yup.object(schemaObject)
  try {
    await schema.validate(data)
    return `true`
  }
  catch (e) {
    return `false -> ${e.errors[0]}`
  }
}

const checks = {
  stringMinFive: await yupTest(
    { name: yup.string().min(5).required() },
    { name: 'abc' },
  ),

  emailValid: await yupTest(
    { email: yup.string().email().required() },
    { email: 'teste@' },
  ),

  numberMinTen: await yupTest(
    { age: yup.number().min(10).required() },
    { age: 5 },
  ),

  requiredField: await yupTest(
    { username: yup.string().required() },
    { username: '' },
  ),

  arrayMinTwo: await yupTest(
    { items: yup.array().min(2).required() },
    { items: ['one'] },
  ),

  booleanTest: await yupTest(
    { accepted: yup.boolean().oneOf([true]) },
    { accepted: false },
  ),
}
</script>
