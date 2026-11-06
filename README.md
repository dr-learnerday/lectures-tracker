# Lectures Tracker

Arabic lecture progress tracker.

## Install on a phone

Serve the repository over HTTPS (for example GitHub Pages), keeping all files together. Relative manifest and icon URLs support both a custom domain and a repository subdirectory such as /lectures-tracker/.

- **Android / Chrome:** tap the page's install button when Chrome offers installation, or use Chrome's menu → Add to Home screen / Install app.
- **iPhone / iPad:** in Chrome use Share → Add to Home Screen → Add (More may be needed). If unavailable, open in Safari and use Share → Add to Home Screen. Enable Open as Web App when offered.
- Once launched from its home screen icon, the app opens in standalone mode and hides the installation panel.

Installation requires user interaction; websites cannot add themselves automatically. The lecture API still requires an internet connection. No service worker or offline caching is added, so lecture data continues to load fresh and progress remains in the existing browser-local storage. iOS may use separate website storage for the installed app; existing browser progress may not carry over.

## Verification

Run `node --test tests/install.test.cjs` for installation UI lifecycle checks. Check the manifest and icons in Chrome DevTools → Application, then verify installation on a physical Android phone and iPhone.

