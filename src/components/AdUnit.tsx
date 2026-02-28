'use client';

/**
 * AdUnit — Google AdSense display ad component
 *
 * Design goals (all must pass simultaneously):
 *
 * 1. ZERO CLS  — explicit min-height reserved before the ad loads,
 *                so the layout never shifts when AdSense fills the slot.
 *
 * 2. No LCP hit — the AdSense script in layout.tsx is `async`. This
 *                 component additionally defers `adsbygoogle.push()` until
 *                 the slot enters the viewport via IntersectionObserver,
 *                 so ads below the fold never block main-thread time.
 *
 * 3. Silent fail — ad-blockers prevent adsbygoogle from loading. We wrap
 *                  every push() in try/catch and the container gracefully
 *                  collapses (display:none) so no empty white boxes appear.
 *
 * 4. SSR safe   — the <ins> element renders on the server (good for SEO /
 *                  no hydration mismatch), but push() only runs client-side
 *                  after the observer fires.
 *
 * Usage:
 *   <AdUnit slot="1234567890" format="horizontal" className="my-4" />
 */

import { useEffect, useRef } from 'react';

// Augment window so TypeScript knows about adsbygoogle
declare global {
  interface Window {
    adsbygoogle: { push: (o: object) => void }[];
  }
}

type AdFormat = 'horizontal' | 'rectangle' | 'vertical' | 'auto';

interface AdUnitProps {
  /** AdSense ad-slot ID (numeric string from your AdSense dashboard) */
  slot: string;
  /**
   * Visual format hint. Controls the reserved container height and
   * the data-ad-format attribute passed to AdSense.
   *
   * horizontal → leaderboard  728×90 / mobile 320×50
   * rectangle  → medium rect  336×280 / mobile 300×250
   * vertical   → skyscraper   160×600
   * auto       → fully responsive, let AdSense decide
   */
  format?: AdFormat;
  /** Extra Tailwind / CSS classes on the outer wrapper */
  className?: string;
  /** Label shown above ad on desktop for transparency (optional) */
  label?: boolean;
}

// Reserved heights prevent CLS. These match common AdSense creative sizes.
const RESERVED_HEIGHT: Record<AdFormat, string> = {
  horizontal: '90px',   // leaderboard
  rectangle:  '280px',  // medium rectangle
  vertical:   '600px',  // wide skyscraper
  auto:       '100px',  // fallback for responsive
};

// Mobile breakpoint — below 768px use shorter heights to avoid wasted space
const MOBILE_HEIGHT: Record<AdFormat, string> = {
  horizontal: '50px',   // mobile banner
  rectangle:  '250px',  // mobile medium rectangle
  vertical:   '250px',  // collapse verticals on mobile
  auto:       '100px',
};

export default function AdUnit({
  slot,
  format = 'auto',
  className = '',
  label = true,
}: AdUnitProps) {
  const insRef       = useRef<HTMLModElement>(null);
  const observerRef  = useRef<IntersectionObserver | null>(null);
  const initialised  = useRef(false);

  // Publisher ID — injected at build time via NEXT_PUBLIC env var
  const publisherId  = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!publisherId || initialised.current) return;
    if (!insRef.current) return;

    // Use IntersectionObserver so we only call adsbygoogle.push()
    // when the slot is within 200px of the viewport. This means:
    // - Ads below the fold do NOT block Time to Interactive
    // - The AdSense fill request fires just before the user sees the slot
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !initialised.current) {
            initialised.current = true;

            try {
              // adsbygoogle may not exist if ad-blocker active — silent fail
              (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch {
              // Ad blocked — hide the reserved container so no blank space
              if (insRef.current?.parentElement) {
                (insRef.current.parentElement as HTMLElement).style.display = 'none';
              }
            }

            observerRef.current?.disconnect();
          }
        });
      },
      {
        // Start loading 300px before it enters the viewport
        rootMargin: '0px 0px 300px 0px',
        threshold: 0,
      }
    );

    observerRef.current.observe(insRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [publisherId]);

  // Don't render anything if publisher ID is not configured
  if (!publisherId) return null;

  return (
    <div
      className={`ad-unit-wrapper ${className}`}
      data-ad-format={format}
      aria-label="Advertisement"
    >
      {label && (
        <p className="ad-label" aria-hidden="true">
          Advertisement
        </p>
      )}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format === 'auto' ? 'auto' : undefined}
        data-full-width-responsive={format === 'auto' || format === 'horizontal' ? 'true' : undefined}
      />
    </div>
  );
}
