export default defineAppConfig({
  yup: {
    setLocale: {
      string: {
        min({ min }) {
          return `the text is too small, it must have at least ${min} characters`
        },
      },
    },
  },
})
