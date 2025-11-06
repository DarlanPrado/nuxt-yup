export default defineAppConfig({
  yup: {
    setLocale: {
      string: {
        min: 'Must be at least ${min} letters',
      },
    },
    methods: {
      noWhitespace: {
        schema: 'string',
        transform(message = 'Cannot contain spaces') {
          return this.test(
            'no-whitespace',
            message,
            value => typeof value !== 'string' || !/\s/.test(value)
          )
        }
      }
    }
  },
})
