import { TrackingPixelsConfig, DEFAULT_TRACKING_PIXELS } from '../types';

export const TRACKING_PIXELS_STORAGE_KEY = 'raba_tracking_pixels';

export function getStoredTrackingPixels(): TrackingPixelsConfig {
  try {
    const raw = localStorage.getItem(TRACKING_PIXELS_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_TRACKING_PIXELS };
    const parsed = JSON.parse(raw);
    return {
      meta: { ...DEFAULT_TRACKING_PIXELS.meta, ...(parsed.meta || {}) },
      tiktok: { ...DEFAULT_TRACKING_PIXELS.tiktok, ...(parsed.tiktok || {}) },
      snapchat: { ...DEFAULT_TRACKING_PIXELS.snapchat, ...(parsed.snapchat || {}) },
      gtm: { ...DEFAULT_TRACKING_PIXELS.gtm, ...(parsed.gtm || {}) },
      custom_head: { ...DEFAULT_TRACKING_PIXELS.custom_head, ...(parsed.custom_head || {}) },
      custom_body: { ...DEFAULT_TRACKING_PIXELS.custom_body, ...(parsed.custom_body || {}) }
    };
  } catch {
    return { ...DEFAULT_TRACKING_PIXELS };
  }
}

export function saveStoredTrackingPixels(config: TrackingPixelsConfig): void {
  try {
    localStorage.setItem(TRACKING_PIXELS_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to store tracking pixels locally', err);
  }
  window.dispatchEvent(new CustomEvent('raba_tracking_pixels_updated', { detail: config }));
  applyTrackingPixels(config);
}

// Injects or updates active pixels on the live site
export function applyTrackingPixels(config: TrackingPixelsConfig): void {
  if (typeof document === 'undefined') return;

  // 1. Google Tag Manager (GTM)
  const existingGtm = document.getElementById('raba-gtm-script');
  if (config.gtm?.is_active && config.gtm.id?.trim()) {
    const gtmId = config.gtm.id.trim();
    if (!existingGtm || existingGtm.getAttribute('data-gtm-id') !== gtmId) {
      if (existingGtm) existingGtm.remove();
      const script = document.createElement('script');
      script.id = 'raba-gtm-script';
      script.setAttribute('data-gtm-id', gtmId);
      script.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');`;
      document.head.appendChild(script);
    }
  } else if (existingGtm) {
    existingGtm.remove();
  }

  // 2. Meta (Facebook) Pixel
  const existingMeta = document.getElementById('raba-meta-pixel');
  if (config.meta?.is_active && config.meta.id?.trim()) {
    const metaId = config.meta.id.trim();
    if (!existingMeta || existingMeta.getAttribute('data-pixel-id') !== metaId) {
      if (existingMeta) existingMeta.remove();
      const script = document.createElement('script');
      script.id = 'raba-meta-pixel';
      script.setAttribute('data-pixel-id', metaId);
      script.text = `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${metaId}');
      fbq('track', 'PageView');`;
      document.head.appendChild(script);
    }
  } else if (existingMeta) {
    existingMeta.remove();
  }

  // 3. TikTok Pixel
  const existingTikTok = document.getElementById('raba-tiktok-pixel');
  if (config.tiktok?.is_active && config.tiktok.id?.trim()) {
    const ttId = config.tiktok.id.trim();
    if (!existingTikTok || existingTikTok.getAttribute('data-pixel-id') !== ttId) {
      if (existingTikTok) existingTikTok.remove();
      const script = document.createElement('script');
      script.id = 'raba-tiktok-pixel';
      script.setAttribute('data-pixel-id', ttId);
      script.text = `!function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load('${ttId}');
        ttq.page();
      }(window, document, 'ttq');`;
      document.head.appendChild(script);
    }
  } else if (existingTikTok) {
    existingTikTok.remove();
  }

  // 4. Snapchat Pixel
  const existingSnapchat = document.getElementById('raba-snapchat-pixel');
  if (config.snapchat?.is_active && config.snapchat.id?.trim()) {
    const snapId = config.snapchat.id.trim();
    if (!existingSnapchat || existingSnapchat.getAttribute('data-pixel-id') !== snapId) {
      if (existingSnapchat) existingSnapchat.remove();
      const script = document.createElement('script');
      script.id = 'raba-snapchat-pixel';
      script.setAttribute('data-pixel-id', snapId);
      script.text = `(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
      {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
      a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
      r.src=n;var m=t.getElementsByTagName(s)[0];
      m.parentNode.insertBefore(r,m);})(window,document,
      'https://sc-static.net/scevent.min.js');
      snaptr('init', '${snapId}');
      snaptr('track', 'PAGE_VIEW');`;
      document.head.appendChild(script);
    }
  } else if (existingSnapchat) {
    existingSnapchat.remove();
  }

  // 5. Custom Head Script
  const existingCustomHead = document.getElementById('raba-custom-head-container');
  if (config.custom_head?.is_active && config.custom_head.script?.trim()) {
    if (!existingCustomHead) {
      const container = document.createElement('div');
      container.id = 'raba-custom-head-container';
      container.innerHTML = config.custom_head.script;
      document.head.appendChild(container);
    } else {
      existingCustomHead.innerHTML = config.custom_head.script;
    }
  } else if (existingCustomHead) {
    existingCustomHead.remove();
  }

  // 6. Custom Body Script
  const existingCustomBody = document.getElementById('raba-custom-body-container');
  if (config.custom_body?.is_active && config.custom_body.script?.trim()) {
    if (!existingCustomBody) {
      const container = document.createElement('div');
      container.id = 'raba-custom-body-container';
      container.innerHTML = config.custom_body.script;
      document.body.appendChild(container);
    } else {
      existingCustomBody.innerHTML = config.custom_body.script;
    }
  } else if (existingCustomBody) {
    existingCustomBody.remove();
  }
}
