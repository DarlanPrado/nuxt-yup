export default defineAppConfig({
  yup: {
    setLocale: {
      string: {
        min: 'Must be at least ${min} letters',
        required: 'This field is required',
      },
    },
  },
})
