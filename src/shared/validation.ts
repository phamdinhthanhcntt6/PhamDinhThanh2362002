import { PHONE_MAX_DIGITS, PHONE_MIN_DIGITS } from './constants'

export const normalizeText = (value: string): string => value.trim()

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const phonePattern = new RegExp(`^\\d{${PHONE_MIN_DIGITS},${PHONE_MAX_DIGITS}}$`)

export const isValidPhone = (phone: string): boolean => phonePattern.test(phone)
