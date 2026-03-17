import { defineYupExtension } from '../../../src/types'

export default defineYupExtension([
  {
    name: 'cnpj',
    type: 'string',
    message: 'CNPJ inválido',
    validate(value: string) {
      if (typeof value !== 'string') return false
      const regex = /^\d{14}$/
      return regex.test(value)
    },
  },
  {
    name: 'isEven',
    type: 'number',
    message: 'Deve ser um número par',
    validate(value: number) {
      if (typeof value !== 'number') return false
      return value % 2 === 0
    },
  },
])
