import { useEffect, useRef, useState } from 'react';

type TurnstileWidgetProps = {
  action: 'login' | 'register';
  resetSignal: number;
  onTokenChange: (token: string) => void;
  onUnavailable?: (message: string) => void;
};

const FALLBACK_TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

class TurnstileScriptLoader {
  private static scriptPromise?: Promise<void>;

  static load() {
    if (window.turnstile) {
      return Promise.resolve();
    }

    if (TurnstileScriptLoader.scriptPromise === undefined) {
      TurnstileScriptLoader.scriptPromise = TurnstileScriptLoader.createScriptPromise();
    }

    return TurnstileScriptLoader.scriptPromise;
  }

  private static createScriptPromise() {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-turnstile-script="true"]',
    );

    if (existingScript) {
      existingScript.remove();
    }
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        import.meta.env.VITE_TURNSTILE_SCRIPT_SRC ?? FALLBACK_TURNSTILE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.dataset.turnstileScript = 'true';
      script.addEventListener('load', () => resolve(), { once: true });
      script.addEventListener(
        'error',
        () => reject(new Error('Cloudflare Turnstile script failed to load.')),
        { once: true },
      );
      document.head.append(script);
    });
  }
}

function TurnstileWidget({
  action,
  resetSignal,
  onTokenChange,
  onUnavailable,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [error, setError] = useState('');
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '';
  const missingSiteKeyError = siteKey ? '' : 'Turnstile site key is not configured.';

  useEffect(() => {
    let isMounted = true;

    if (!siteKey) {
      onTokenChange('');
      return;
    }

    const currentSiteKey = siteKey;

    async function renderWidget() {
      try {
        await TurnstileScriptLoader.load();

        if (!isMounted || !containerRef.current || !window.turnstile) {
          return;
        }

        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }

        setError('');
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: currentSiteKey,
          action,
          theme: 'auto',
          callback: (token) => {
            onTokenChange(token);
          },
          'expired-callback': () => {
            onTokenChange('');
          },
          'error-callback': () => {
            onTokenChange('');
            setError('Verification failed. Please try again.');
          },
        });
      } catch {
        const message = 'Turnstile could not be loaded.';
        setError(message);
        onUnavailable?.(message);
        onTokenChange('');
      }
    }

    void renderWidget();

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [action, onTokenChange, onUnavailable, siteKey]);

  useEffect(() => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
    onTokenChange('');
  }, [onTokenChange, resetSignal]);

  return (
    <div className="turnstile-field">
      <div ref={containerRef} className="turnstile-widget" />
      {(error || missingSiteKeyError) && (
        <p className="field-error" role="alert">
          {error || missingSiteKeyError}
        </p>
      )}
    </div>
  );
}

export default TurnstileWidget;
