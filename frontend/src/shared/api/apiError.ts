import { type ApiErrorResponse } from '@project/shared'

export type ApiIssue = {
  path: Array<string | number>
  code: string
  message: string
}

export type NormalizedApiError = {
  status: number
  code: string
  message: string
  issues: ApiIssue[]
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly issues: ApiIssue[]

  constructor(error: NormalizedApiError) {
    super(error.message)
    this.name = 'ApiError'
    this.status = error.status
    this.code = error.code
    this.issues = error.issues
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return isRecord(value) && typeof value.errorCode === 'string'
}

function getIssueParam(issue: { params?: unknown }, key: string) {
  const params = issue.params

  if (!isRecord(params)) {
    return undefined
  }

  return params[key]
}

function getBackendIssueMessage(issue: { code: string; params?: unknown }) {
  const customMessage = getIssueParam(issue, 'message')

  if (typeof customMessage === 'string') {
    return customMessage
  }

  switch (issue.code) {
    case 'invalid_format':
      return 'Enter a valid value.'
    case 'invalid_type':
      return 'This field is required.'
    case 'not_unique':
      return 'This value is already used.'
    case 'too_big': {
      const max = getIssueParam(issue, 'max')
      return typeof max === 'number'
        ? `Must be no more than ${max} characters.`
        : 'This value is too long.'
    }
    case 'too_small': {
      const min = getIssueParam(issue, 'min')
      return typeof min === 'number'
        ? `Must be at least ${min} characters.`
        : 'This value is too short.'
    }
    default:
      return 'Please check this field.'
  }
}

function getIssuePathSegment(field: string | number | symbol): string | number {
  return typeof field === 'symbol' ? field.description ?? String(field) : field
}

function parseBackendIssues(issues: ApiErrorResponse['errorIssues']): ApiIssue[] {
  return (issues ?? []).map((issue) => ({
    path: [getIssuePathSegment(issue.field)],
    code: issue.code,
    message: getBackendIssueMessage(issue),
  }))
}

function parseIssues(value: unknown): ApiIssue[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((issue) => {
    if (!isRecord(issue)) {
      return []
    }

    const path = Array.isArray(issue.path)
      ? issue.path.filter(
          (segment): segment is string | number =>
            typeof segment === 'string' || typeof segment === 'number',
        )
      : []

    return [
      {
        path,
        code: typeof issue.code === 'string' ? issue.code : 'VALIDATION_FAILED',
        message:
          typeof issue.message === 'string'
            ? issue.message
            : 'Please check this field.',
      },
    ]
  })
}

export function normalizeApiError(status: number, body: unknown): NormalizedApiError {
  if (isApiErrorResponse(body)) {
    return {
      status,
      code: body.errorCode,
      message:
        body.errorMessage ??
        'The request could not be completed.',
      issues: parseBackendIssues(body.errorIssues),
    }
  }

  if (isRecord(body)) {
    return {
      status,
      code:
        typeof body.code === 'string'
          ? body.code
          : typeof body.errorCode === 'string'
            ? body.errorCode
            : 'REQUEST_FAILED',
      message:
        typeof body.detail === 'string'
          ? body.detail
          : typeof body.errorMessage === 'string'
            ? body.errorMessage
            : typeof body.errorMsg === 'string'
              ? body.errorMsg
            : 'The request could not be completed.',
      issues: parseIssues(body.issues),
    }
  }

  return {
    status,
    code: 'REQUEST_FAILED',
    message: 'The request could not be completed.',
    issues: [],
  }
}
