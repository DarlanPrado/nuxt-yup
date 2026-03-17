import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  yup: {
    methodsDir: './does-not-exist',
  },
})
