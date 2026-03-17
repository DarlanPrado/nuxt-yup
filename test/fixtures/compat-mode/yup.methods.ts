import type * as YupType from 'yup'

export default function extendYup(yup: typeof YupType) {
  yup.addMethod(yup.StringSchema, 'customString', function (message = 'Custom validation failed') {
    return this.test('custom-string', message, (value) => {
      if (typeof value !== 'string') return false
      return value.startsWith('valid-')
    })
  })

  yup.addMethod(yup.NumberSchema, 'customNumber', function (message = 'Custom number validation failed') {
    return this.test('custom-number', message, (value) => {
      if (typeof value !== 'number') return false
      return value > 100
    })
  })
}
