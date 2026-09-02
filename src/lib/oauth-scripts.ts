const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const FACEBOOK_SCRIPT_SRC = 'https://connect.facebook.net/en_US/sdk.js';

let googleScriptPromise: Promise<void> | null = null;
let facebookScriptPromise: Promise<void> | null = null;

export const loadGoogleScript = (): Promise<void> => {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google SDK')));
      return;
    }

    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google SDK'));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
};

export const loadFacebookScript = (): Promise<void> => {
  if (window.FB) {
    return Promise.resolve();
  }

  if (facebookScriptPromise) {
    return facebookScriptPromise;
  }

  facebookScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${FACEBOOK_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Facebook SDK')));
      return;
    }

    window.fbAsyncInit = () => resolve();

    const script = document.createElement('script');
    script.src = FACEBOOK_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onerror = () => reject(new Error('Failed to load Facebook SDK'));
    document.head.appendChild(script);
  });

  return facebookScriptPromise;
};

export const initFacebookSdk = (appId: string): void => {
  if (!window.FB) return;
  window.FB.init({
    appId,
    cookie: true,
    xfbml: false,
    version: 'v19.0',
  });
};
