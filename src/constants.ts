import type { YupExtensionType } from './types'

export const VALID_TYPES: YupExtensionType[] = [
  'string',
  'number',
  'boolean',
  'object',
  'array',
  'date',
  'mixed',
  'schema',
]

export const TYPE_MAP: Record<YupExtensionType, string> = {
  string: 'Yup.StringSchema',
  number: 'Yup.NumberSchema',
  boolean: 'Yup.BooleanSchema',
  object: 'Yup.ObjectSchema',
  array: 'Yup.ArraySchema',
  date: 'Yup.DateSchema',
  mixed: 'Yup.Schema',
  schema: 'Yup.Schema',
}
