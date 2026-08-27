// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_TURNSTILE_SITE_KEY?: string
  readonly VITE_TURNSTILE_SCRIPT_SRC?: string
}

type TurnstileWidgetId = string

type TurnstileRenderOptions = {
  sitekey: string
  action?: string
  theme?: 'light' | 'dark' | 'auto'
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
}

interface Window {
  turnstile?: {
    render: (container: HTMLElement, options: TurnstileRenderOptions) => TurnstileWidgetId
    reset: (widgetId: TurnstileWidgetId) => void
    remove: (widgetId: TurnstileWidgetId) => void
  }
}
