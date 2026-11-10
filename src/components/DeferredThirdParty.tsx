'use client';

import { useEffect } from 'react';

/**
 * Loads the Google tag (Ads + Analytics) and the AdSense library AFTER the page
 * has painted, instead of from <head>.
 *
 * Why: together these scripts are ~600 KiB and blocked the main thread for over
 * a second on mobile, delaying LCP and the first tap. Nothing on first paint
 * needs them:
 *   - gtag() calls made before the library arrives queue up in window.dataLayer
 *     (the inline stub in layout.tsx) and are sent once it loads.
 *   - <AdUnit> pushes into window.adsbygoogle, which AdSense drains on load.
 *
 * When: on the first user interaction (scroll, tap, key), or once the page has
 * loaded and the browser is idle — whichever comes first.
 */

const GTAG_SRC = 'https://www.googletagmanager.com/gtag/js?id=AW-18001608633';
const INTERACTION_EVENTS = ['pointerdown', 'touchstart', 'keydown', 'scroll'] as const;
const IDLE_TIMEOUT_MS = 3000;

function injectScript(src: string, crossOrigin?: string) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  if (crossOrigin) script.crossOrigin = crossOrigin;
  document.head.appendChild(script);
}

// Module-level so a remount (Strict Mode, hydration recovery, route change)
// can never inject the libraries a second time.
let loaded = false;

export default function DeferredThirdParty({ adsenseId }: { adsenseId?: string }) {
  useEffect(() => {
    if (loaded) return;
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      INTERACTION_EVENTS.forEach((name) => window.removeEventListener(name, load));
      window.removeEventListener('load', scheduleIdle);
      if (idleHandle !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
    };

    function load() {
      if (loaded) return;
      loaded = true;
      cleanup();
      injectScript(GTAG_SRC);
      if (adsenseId) {
        injectScript(
          `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`,
          'anonymous',
        );
      }
    }

    function scheduleIdle() {
      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(load, { timeout: IDLE_TIMEOUT_MS });
      } else {
        timeoutHandle = setTimeout(load, IDLE_TIMEOUT_MS);
      }
    }

    INTERACTION_EVENTS.forEach((name) =>
      window.addEventListener(name, load, { passive: true, once: true }),
    );

    if (document.readyState === 'complete') scheduleIdle();
    else window.addEventListener('load', scheduleIdle, { once: true });

    return cleanup;
  }, [adsenseId]);

  return null;
}
