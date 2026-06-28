# Hivex — Native apps (iOS + Android)

This folder wraps the **existing Hivex web app** in a native shell using
[Capacitor](https://capacitorjs.com), so you ship to the **App Store** and
**Google Play** without rebuilding the product.

## How it works

- The app loads the live site (`https://www.hivex.pt`) inside a native WebView
  (`server.url` in `capacitor.config.json`). The mobile UI you already polished
  *is* the app.
- **Most updates need no re-submission.** When you push to Vercel, the app picks
  up the new site on next launch — like a website. You only re-submit to the
  stores for *native* changes (app icon, splash, plugins, OS-version bumps).
- The native shell adds: a branded splash screen, status-bar theming, native
  share, and native geolocation permission prompts for the map.
- `../hive/frontend/index.html` detects the native context and points the API
  client at `https://www.hivex.pt/api` automatically (see the `HIVEX_NATIVE`
  hook in `<head>`).

---

## 0. Prerequisites

| Need | Android | iOS |
|---|---|---|
| OS to build on | Windows / macOS / Linux ✅ | **macOS only** (Xcode is Mac-only) |
| Tooling | [Android Studio](https://developer.android.com/studio) + JDK 17 | Xcode 15+ + CocoaPods |
| Developer account | Google Play — **$25 once** | Apple Developer — **$99 / year** |

- **Node.js 18+** is required for both.
- **You are on Windows**, so you can build and ship **Android** from this PC.
  For **iOS** you need a Mac, or a cloud-Mac build — see [§6](#6-ios-build--submit).
- I can scaffold and document everything here, but **creating the developer
  accounts and pressing "Submit" is yours to do** — store submission is a signed,
  identity-bound process that can't be automated by a third party.

---

## 1. One-time setup

```bash
cd mobile
npm install

# Generate the native projects. Android works on any OS:
npx cap add android
# iOS only on a Mac:
npx cap add ios
```

This creates `android/` (and `ios/` on a Mac) — real Android Studio / Xcode
projects. Commit them if you want CI builds; they're otherwise regenerable.

## 2. App icons & splash screen

A starter icon was copied to `assets/icon.png` (512×512). **Replace it with a
1024×1024 PNG** for crisp store icons, then:

```bash
npm run assets
```

This generates every icon/splash size for both platforms from `assets/icon.png`
(and `assets/splash.png` if you add one). Re-run after changing the icon.

## 3. Sync after any change

```bash
npx cap sync
```

Run this whenever you change `capacitor.config.json`, add a plugin, or update
`www/`. It copies web assets and updates the native projects.

---

## 4. Permissions to declare

The map uses geolocation, so the stores require you to declare it.

**Android** — `android/app/src/main/AndroidManifest.xml` (add inside `<manifest>`):
```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

**iOS** — `ios/App/App/Info.plist`:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>A Hivex usa a sua localização para mostrar empresas perto de si no mapa.</string>
```

---

## 5. Android — build & submit

1. Open the project:
   ```bash
   npx cap open android
   ```
2. In Android Studio, **Run ▶** on an emulator or a USB-connected phone to test.
3. Set the version in `android/app/build.gradle` (`versionCode`, `versionName`).
4. Create a release signing key (once), keep it safe — losing it blocks future updates:
   ```bash
   keytool -genkey -v -keystore hivex-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias hivex
   ```
5. **Build ▸ Generate Signed Bundle / APK ▸ Android App Bundle (.aab)**, sign with that key.
6. Go to the [Google Play Console](https://play.google.com/console) ($25 one-time),
   create the app, and upload the `.aab` under **Production** (or start with
   **Internal testing** to try it on your own device fast).

## 6. iOS — build & submit

> Requires a Mac. No Mac? Use a cloud-Mac build: **Codemagic**, **Ionic Appflow**,
> or a **GitHub Actions `macos-latest` runner**. Each can run `pod install` →
> `xcodebuild archive` → upload to App Store Connect from your committed `ios/` project.

On a Mac:
1. `cd mobile && npm install && npx cap add ios && npx cap sync`
2. `npx cap open ios` (opens Xcode).
3. In **Signing & Capabilities**, select your Apple Developer team.
4. Set the version/build number, pick a real device or "Any iOS Device".
5. **Product ▸ Archive ▸ Distribute App ▸ App Store Connect**.
6. In [App Store Connect](https://appstoreconnect.apple.com) ($99/yr), complete the
   listing and submit for review. Use **TestFlight** first to try it on your phone.

---

## 7. Store listing checklist (both stores)

- App name, subtitle, description (PT + EN recommended).
- **Privacy policy URL** (required by both). You already have `hivex.pt` legal
  pages — add a dedicated privacy URL if you don't have one.
- Screenshots: phone screenshots in the required sizes (Play: 1080×1920 ish;
  App Store: 6.7" 1290×2796 + 6.5"). Capture from a device/emulator.
- App icon (from §2).
- Category: **Business** / **Lifestyle**. Content rating / age questionnaire.
- **Google Play Data safety** form + **Apple App Privacy** "nutrition label":
  declare what you collect (account email, approximate/precise location, usage).

## 8. ⚠️ Apple "minimum functionality" (Guideline 4.2)

Apple sometimes rejects apps that are "just a website in a wrapper." Hivex has
real functionality (map, search, accounts, quotes), which helps, but to be safe:

- Keep the **native geolocation** prompt (already wired via the Geolocation plugin).
- Strongly consider adding **native push notifications**
  (`@capacitor/push-notifications`) — a real native capability reviewers look for
  (e.g. "new company in your area", quote replies).
- Make sure the splash/icon are polished and the app doesn't show browser chrome.

Google Play is far more lenient about web-backed apps.

## 9. Roadmap (v2 — optional, sturdier)

The current build loads the live site. A more robust, fully-offline-capable
version would:
1. **Bundle** the frontend into `www/` instead of `server.url`, and
2. switch auth from the httpOnly **cookie** to a **bearer token** stored in native
   secure storage (the cookie won't cross the `capacitor://localhost` ↔ `hivex.pt`
   origin boundary when bundled). This needs a small backend change so
   `requireAuth` also accepts `Authorization: Bearer <jwt>`.

Until then, login/quotes work because the app is same-origin with `hivex.pt`.

## 10. Troubleshooting

- **White screen on launch / offline:** the device had no connection at launch;
  `www/index.html` shows a retry screen. Relaunch with a connection.
- **`cap add ios` fails on Windows:** expected — iOS needs a Mac.
- **Login doesn't persist:** confirm the app is loading `https://www.hivex.pt`
  (same origin as the cookie). Check `capacitor.config.json` → `server.url`.
- **Map shows no location:** confirm the location permission strings in §4 and
  that you accepted the OS prompt.
