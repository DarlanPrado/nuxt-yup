import type { YupSchema } from '../types'
import { useNuxtApp } from '#imports'

export const useYup = (): YupSchema => useNuxtApp().$yup
