'use client';

import { useEffect, useRef } from 'react';

type AdFormat = 'horizontal' | 'rectangle' | 'vertical' | 'auto';

interface AdUnitProps {
  slot: string;
  format?: AdFormat;
  className?: string;
  label?: boolean;
}

// Extend window type to include adsbygoogle
interface AdsWindow extends Window {
  adsbygoogle: object[];
}

export default function AdUnit({
  slot,
  format = 'auto',
  className = '',
  label = true,
}: AdUnitProps) {
  const insRef      = useRef<HTMLModElement>(null);
  const initialised = useRef(false);
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!publisherId || initialised.current || !insRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !initialised.current) {
            initialised.current = true;
            try {
              const w = window as unknown as AdsWindow;
              w.adsbygoogle = w.adsbygoogle || [];
              w.adsbygoogle.push({});
            } catch {
              if (insRef.current?.parentElement) {
                (insRef.current.parentElement as HTMLElement).style.display = 'none';
              }
            }
            observer.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px 300px 0px', threshold: 0 }
    );

    observer.observe(insRef.current);
    return () => observer.disconnect();
  }, [publisherId]);

  if (!publisherId) return null;

  return (
    <div className={`ad-unit-wrapper ${className}`} aria-label="Advertisement">
      {label && (
        <p className="ad-label" aria-hidden="true">Advertisement</p>
      )}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format === 'auto' ? 'auto' : undefined}
        data-full-width-responsive={
          format === 'auto' || format === 'horizontal' ? 'true' : undefined
        }
      />
    </div>
  );
}
```

5. Scroll down, click **"Commit changes"** → **"Commit changes"** again

---

## Step 3 — Verify the Commit Hash Changed

After committing both files, go to:
```
https://github.com/sitarammaaker-arch/govphoto/commits/main
