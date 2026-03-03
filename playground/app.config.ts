export default defineAppConfig({
  yup: {
    setLocale: {
      string: {
        min: 'Must be at least ${min} letters',
        required: 'This field is required',
      },
    },
    methods: {
      noWhitespace: {
        schema: 'string',
        transform(message = 'Cannot contain spaces') {
          return this.test(
            'no-whitespace',
            message,
            value => typeof value !== 'string' || !/\s/.test(value),
          )
        },
      },
      hasNuxtPrefix: {
        schema: 'string',
        transform(message = 'Must start with "nuxt-"') {
          return this.test(
            'has-nuxt-prefix',
            message,
            value => typeof value !== 'string' || /^nuxt-/.test(value),
          )
        },
      },
    },
  },
})
