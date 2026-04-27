# Google Sign-In setup

The `/api/auth/google` route accepts a Google ID token and exchanges it for a
Hive session cookie. To enable the "Continue with Google" button in the login
and register modals you need to (1) create an OAuth 2.0 client in Google Cloud
and (2) set the resulting client ID as a Vercel environment variable.

If `GOOGLE_CLIENT_ID` is not set, the rest of the app keeps working; the
Google buttons just stay hidden.

## 1. Create the OAuth client

1. Go to https://console.cloud.google.com/ and create (or select) a project.
2. **APIs & Services → OAuth consent screen**
   - User type: **External**
   - App name, support email, developer email — fill in.
   - Scopes: leave the default (email, profile, openid).
   - Test users: add your own Google account during development.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:9091` (or whatever port serves the frontend in dev)
     - `https://<your-vercel-domain>.vercel.app`
     - your custom domain if you have one
   - Authorized redirect URIs: not required for the GIS button flow, but adding
     the same origins doesn't hurt.
4. Copy the **Client ID** (looks like `1234567890-abc...apps.googleusercontent.com`).

## 2. Set the env var

Local dev:

```bash
echo "GOOGLE_CLIENT_ID=1234567890-abc...apps.googleusercontent.com" >> hive/backend/.env
```

Vercel (production + preview):

```bash
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_ID preview
```

Or set it via the dashboard: **Project → Settings → Environment Variables**.

After setting it, redeploy so the function picks up the new value.

## 3. Verify

- Open the deployed site, click **Entrar**.
- The "Continue with Google" button should render above the email/password
  fields.
- Click it, sign in with a Google account, and you should land logged in.
- Browser DevTools → Application → Cookies should show a `hive_token` cookie.

## How accounts are linked

- New user signs in with Google → a Hive user is created with `type='cliente'`
  by default. If they signed in via the register tab after picking "Sou
  Empresa", they're created as `empresa`.
- Existing user signs in with Google and there's already a password account
  with that email → the Google ID is linked to the existing account, so the
  user can use either login method afterwards.
- Existing Google user signs in again → matched by `google_id`, logged in.

## Database

The `users` table now has these extra columns (auto-applied on cold start by
the schema migration in `app.js`):

- `password_hash` is now nullable (Google-only users have no password).
- `google_id TEXT UNIQUE` — Google's stable user ID (`sub` claim).
- `picture TEXT` — avatar URL from the Google profile.
