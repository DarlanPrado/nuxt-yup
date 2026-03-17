import type * as YupType from 'yup'

const typedExtensions = [
  {
    name: 'cnpj',
    type: 'string',
    message: 'CNPJ inválido',
    validate(value: string) {
      if (typeof value !== 'string') return false
      return /^\d{14}$/.test(value)
    },
  },
  {
    name: 'evenAsync',
    type: 'number',
    message: 'Deve ser um número par',
    async validate(value: number) {
      await Promise.resolve()
      return typeof value === 'number' && value % 2 === 0
    },
  },
] as const

function compatExtensions(yup: typeof YupType) {
  yup.addMethod(yup.StringSchema, 'documentId', function (message = 'Documento inválido') {
    return this.test('document-id', message, (value) => {
      if (value == null) return true
      return typeof value === 'string' && value.length >= 6
    })
  })

  yup.addMethod(yup.NumberSchema, 'greaterThanAsync', function (limit = 10, message = 'Valor inválido') {
    return this.test('greater-than-async', message, async (value) => {
      if (value == null) return true
      await Promise.resolve()
      return typeof value === 'number' && value > Number(limit)
    })
  })
}

const mode = process.env.NUXT_YUP_EXT_MODE || 'typed'

export default mode === 'compat' ? compatExtensions : typedExtensions
