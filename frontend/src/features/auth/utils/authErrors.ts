import { ApiError } from '../../../shared/api/apiError'

type FieldErrors<TFields extends string> = Partial<Record<TFields, string>>

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message
  }

  return fallback
}

export function getFieldErrors<TFields extends string>(
  error: unknown,
  fieldNames: readonly TFields[],
): FieldErrors<TFields> {
  if (!(error instanceof ApiError)) {
    return {}
  }

  return error.issues.reduce<FieldErrors<TFields>>((errors, issue) => {
    const field = issue.path[0]
    if (typeof field !== 'string') {
      return errors
    }

    if (fieldNames.includes(field as TFields)) {
      errors[field as TFields] = issue.message
    }

    return errors
  }, {})
}

export function getLoginErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.code === 'UNAUTHORIZED') {
    return 'Invalid email or password.'
  }

  return getErrorMessage(error, 'Unable to sign in. Please try again.')
}

export function getRegisterFieldErrors(error: unknown) {
  const fieldErrors = getFieldErrors(error, [
    'name',
    'email',
    'password',
    'confirmPassword',
    'captchaToken',
  ] as const)

  if (error instanceof ApiError && error.code === 'not_unique') {
    fieldErrors.email = 'An account with this email already exists.'
  }

  return fieldErrors
}
