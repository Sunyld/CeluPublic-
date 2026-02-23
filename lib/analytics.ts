/**
 * Simple analytics abstraction for future integration (GA, PostHog, etc.).
 * For now, only logs events to console in dev.
 */

export type AnalyticsEventName =
  | 'ad_view'
  | 'whatsapp_click'
  | 'signup_success'
  | 'login_success';

export function trackEvent(name: AnalyticsEventName, payload?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[analytics]', name, payload ?? {});
  }
  // TODO: Integrar Google Analytics, PostHog ou Supabase logs.
}

