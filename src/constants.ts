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
  string: 'yup.StringSchema',
  number: 'yup.NumberSchema',
  boolean: 'yup.BooleanSchema',
  object: 'yup.ObjectSchema',
  array: 'yup.ArraySchema',
  date: 'yup.DateSchema',
  mixed: 'yup.Schema',
  schema: 'yup.Schema',
}
