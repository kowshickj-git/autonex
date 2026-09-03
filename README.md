# Autonex Solutions

**Automation | Engineering | Innovation**

Marketing website and gallery management system for Autonex Solutions, Chennai.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4 and Framer Motion.

---

## Quick start

```bash
npm install
cp .env.example .env.local     # then edit it - see "Configuration" below
npm run admin:hash -- "your-admin-password"   # paste both lines into .env.local
npm run dev                    # http://localhost:3000
```

Out of the box the gallery uses the **local** storage driver, so you can sign in
at `/admin/login`, upload photos and see them on `/gallery` without any cloud
account. Switch to Supabase before going live — see
[Going to production](#going-to-production).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript, no emit |
| `npm run admin:hash -- "password"` | Generate `ADMIN_PASSWORD_HASH` + `ADMIN_AUTH_SECRET` |

---

## Configuration

All settings live in `.env.local`. Nothing secret is ever exposed to the
browser — only variables prefixed `NEXT_PUBLIC_` reach the client.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, used by metadata and `sitemap.xml` |
| `GALLERY_DRIVER` | `local` (development) or `supabase` (production) |
| `DATABASE_URL` / `STORAGE_URL` | Supabase project URL |
| `STORAGE_BUCKET` | Storage bucket name (default `gallery`) |
| `STORAGE_KEY` | Supabase **service-role** key — server only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (browser-safe) |
| `NEXT_PUBLIC_IMAGE_HOSTS` | Comma-separated hosts allowed by `next/image` |
| `ADMIN_AUTH_SECRET` | HMAC signing secret for the admin session cookie |
| `ADMIN_EMAIL` | The bootstrap owner account (see **Admin accounts**) |
| `ADMIN_NAME` | Display name for that owner (optional, defaults to "Owner") |
| `ADMIN_PASSWORD_HASH` | scrypt hash from `npm run admin:hash` |
| `ADMIN_PASSWORD` | Plain password — **development only**, refused in production |
| `ADMIN_SESSION_HOURS` | Session lifetime (default 12) |
| `MAX_UPLOAD_MB` | Per-image upload limit (default 10) |

> **Note on the hash format.** `ADMIN_PASSWORD_HASH` is
> `scrypt:<salt>:<key>` — colon-delimited, not the conventional `$`.
> Next.js loads `.env` files through dotenv-expand, which treats `$name` as a
> variable reference and would silently blank the value, making every login
> fail with no useful error.

---

## Editing site content

Most copy a non-developer would want to change is centralised:

| File | Contains |
|---|---|
| `src/lib/site.ts` | Company details, phone numbers, address, navigation, **statistics**, process steps, core values |
| `src/lib/services.ts` | The nine solutions, project categories, gallery categories |
| `src/lib/equipment.ts` | Lab equipment categories and product cards |

**Statistics are placeholders.** `homeStats` in `src/lib/site.ts` ships with
example figures (150+, 200+, 50+, 24/7). Replace them with real numbers before
launch, or delete entries you cannot substantiate.

---

## Going to production

### 1. Create the Supabase project

Run `supabase/schema.sql` in the Supabase SQL editor. It creates:

- `gallery_images` with indexes matching the public query path
- `enquiries` for contact-form submissions
- Row Level Security: anonymous users may read **visible** gallery rows and
  nothing else; no anonymous insert, update or delete policy exists anywhere
- The public `gallery` storage bucket and its read policy

### 2. Point the app at it

```env
GALLERY_DRIVER=supabase
STORAGE_URL=https://xxxxxxxx.supabase.co
STORAGE_KEY=<service-role key>
STORAGE_BUCKET=gallery
NEXT_PUBLIC_IMAGE_HOSTS=xxxxxxxx.supabase.co
```

`NEXT_PUBLIC_IMAGE_HOSTS` must include your Supabase host or `next/image`
refuses to optimise the files. If it is missing the gallery still renders —
images fall back to being served directly — but you lose the optimiser.

### 3. Set real admin credentials

```bash
npm run admin:hash -- "a long password"
```

Copy both printed lines into your production environment. Leave
`ADMIN_PASSWORD` empty — a plain-text password is rejected outright when
`NODE_ENV=production`.

### 4. Deploy

Any Node host works (Vercel, a VPS, a container). The only requirement beyond a
standard Next.js deployment is that `sharp` can run, which it does on all
mainstream Node runtimes.

> **The `local` driver is not a production driver.** It writes to
> `./.data` and `./public/uploads` on the application's own disk. Files survive
> a refresh, a sign-out and a restart — which is what makes the whole flow
> testable without credentials — but not a redeploy onto fresh infrastructure,
> and it cannot serve more than one instance. The admin dashboard shows a
> warning banner whenever it is active.
>
> It also has a sharp edge specific to `next start`: Next.js's production
> server only serves `public/` files that existed when the process launched —
> anything uploaded to `./public/uploads` *after* `next start` is already
> running 404s until the next restart. `npm run dev` does not have this
> limitation (new uploads are servable immediately), which is why local-driver
> testing throughout development works normally. If you ever run
> `next build && next start` locally against the local driver, restart the
> server after uploading before checking the result. This does not affect
> production, because production should be using `GALLERY_DRIVER=supabase`,
> whose files are served from Supabase Storage's own URL, never through
> Next's public folder.

### Adding another storage provider

`src/lib/gallery/types.ts` defines the `GalleryDriver` interface. Implement it
(S3, Cloudinary, anything) and add a case to `galleryStore()` in
`src/lib/gallery/index.ts`. Nothing else changes.

---

## Gallery system

### Flow

```
Admin → /admin/login → Gallery Management → + Add Photo
      → OS file picker (real <input type="file" multiple>)
      → preview & remove → category, title, visibility
      → Upload → sharp re-encodes to WebP (full + thumbnail)
      → object storage + database row
      → appears immediately in admin; public if Visible
```

### What happens to an uploaded file

1. **Validated** — declared MIME, size, and then the file's own magic bytes.
   A renamed executable is rejected here. SVG is refused outright: it is a
   scriptable document, not a photograph.
2. **Re-encoded** by `sharp` into two WebP variants — full (max 2000px, q82)
   and thumbnail (640px, q72). EXIF orientation is applied and the rest of the
   metadata dropped, which also strips GPS coordinates from phone photos taken
   on a client's site.
3. **Stored** at `gallery/YYYY/MM/<uuid>-<slug>.webp` — the original filename
   is never used verbatim, so collisions and path traversal are impossible.
4. **Recorded** in `gallery_images`.

Deleting a photo removes the database row **and both stored objects**. If the
insert fails after upload, the objects are rolled back. Neither path leaves
orphans.

### Public behaviour

`/gallery` server-renders only `is_visible = true` rows, ordered by
`display_order ASC, created_at DESC`, then filters client-side. A hidden photo
returns 404 from `/api/gallery/:id` exactly as if it did not exist.

**Only photographs the administrator uploads ever appear.** There is no stock
imagery anywhere in the gallery, and no import from Unsplash, Pexels, Google
Photos or social platforms. An empty gallery says "Our Gallery is Coming Soon"
rather than filling itself with placeholders.

### API

| Method | Route | Auth |
|---|---|---|
| GET | `/api/gallery` | Public — visible rows only |
| GET | `/api/gallery/:id` | Public — 404 if hidden |
| GET | `/api/admin/gallery` | Admin |
| POST | `/api/admin/gallery/upload` | Admin |
| PUT | `/api/admin/gallery/:id` | Admin |
| DELETE | `/api/admin/gallery/:id` | Admin |
| PUT | `/api/admin/gallery/:id/visibility` | Admin |
| PUT | `/api/admin/gallery/reorder` | Admin |
| GET | `/api/admin/stats` | Admin |
| GET | `/api/admin/users` | **Owner** |
| POST | `/api/admin/users` | **Owner** |
| PATCH | `/api/admin/users/:id` | **Owner** |
| DELETE | `/api/admin/users/:id` | **Owner** |
| POST | `/api/enquiries` | Public — rate limited + honeypot |

Bulk uploads return **207** when some files succeed and some fail, with a
per-file reason, which is what drives the "18 uploaded, 2 failed" result and
the one-click retry.

---

## Admin accounts

Two sources, checked in that order at login:

**1. The bootstrap owner** — `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` in the
environment. It has no database row, always works, and cannot be edited or
deleted from the UI. Without it, a fresh deploy against an empty database would
have no way to sign in and create the first account. Change its password with
`npm run admin:hash`.

**2. Staff accounts** — rows in `admin_users`, created from **Team** inside the
admin. This is the "sign up" step, deliberately placed behind an owner login
rather than on the public login page: anyone who can sign in can permanently
delete gallery photos from the live site, so accounts are issued, not
self-served.

### Roles

| Role | Can do |
|---|---|
| `owner` | Everything, including adding/removing team members |
| `editor` | Gallery and enquiries. Cannot see or change the Team screen |

Enforced in three independent places, so hiding the nav link is presentation
rather than security: `requireOwner()` on every `/api/admin/users` route, a
server-side redirect in `/admin/team`, and the `role` claim inside the signed
session cookie.

Guard rails that exist because recovering from them needs raw database access:
you cannot deactivate, demote or delete the account you are currently signed in
with, and a staff row cannot reuse the bootstrap owner's email.

### The `admin_users` table

| Column | Type | Purpose |
|---|---|---|
| `id` | uuid PK | Identity |
| `email` | text **unique** | Sign-in handle, stored lowercased |
| `password_hash` | text | scrypt only — no code path can read a password back |
| `name` | text | Shown in the team list and sidebar |
| `role` | text | `owner` \| `editor`, CHECK-constrained |
| `is_active` | boolean | Revoke access without destroying upload history |
| `last_login_at` | timestamptz | Spot dormant or unexpected accounts |
| `created_at` / `updated_at` | timestamptz | Audit trail |
| `created_by` | text | Which admin issued the account |

RLS is enabled with **no policy at all**, which denies everything: the anon key
cannot read a single row. Only the server's service-role key touches it. That
matters more here than on `gallery_images` — these rows are password hashes and
the email addresses of everyone with access.

In development the same data lives in `./.data/admin-users.json` (gitignored),
via the same driver switch as the gallery, so the whole flow is testable with
no credentials.

### Security

- `src/middleware.ts` guards every `/admin/**` route on the Edge runtime and
  sends `no-store`, `X-Robots-Tag: noindex`, `X-Frame-Options: DENY`.
- Admin API routes call `requireAdmin()` themselves and return 401 JSON, so an
  expired session surfaces as a message rather than an HTML redirect.
- Sessions are HMAC-SHA256 signed, HttpOnly, SameSite=Lax cookies. The token
  carries no secret and cannot be read from JavaScript.
- Login is rate limited (8 attempts / 10 minutes / IP) and returns the same
  message for a wrong email and a wrong password.
- The service-role key is used only in server modules.

---

## Animation system

One vocabulary, defined twice and kept in sync: CSS custom properties in
`src/app/globals.css` (`--ease-*`, `--duration-*`) and their exact counterparts
in `src/lib/motion.ts`.

| Token | Value | Used for |
|---|---|---|
| `micro` | 0.24s | Hover, focus, icon nudges |
| `control` | 0.32s | Buttons, accordions, chips |
| `base` / `reveal` | 0.64s / 0.7s | Element and card reveals |
| `section` | 0.96s | Hero choreography, large sections |

Easing is always a cubic-bezier. Linear is reserved for continuous background
loops — the drifting grid and travelling signal dashes — and never used for an
entrance.

### Building blocks

| Component | Purpose |
|---|---|
| `motion/Reveal` | Scroll reveal — opacity + translate, fires at ~22% visibility, once |
| `motion/RevealGroup` + `RevealItem` | Staggered grids, 0.05s cadence |
| `motion/CountUp` | Statistics, Intersection Observer driven |
| `motion/Parallax` | Subtle scroll parallax, desktop only |
| `motion/Magnetic` | 4px cursor pull — the primary CTA only |
| `motion/RevealImage` | Clip-path wipe for major imagery only |
| `hooks/useInViewOnce` | Plain Intersection Observer trigger |

### Reduced motion

`prefers-reduced-motion: reduce` disables parallax, particles, continuous
float, magnetic pull, the custom cursor and the intro screen. Every reveal
component returns its children in the final state — content can never be left
invisible.

### Performance

Only `transform` and `opacity` are animated, with two deliberate exceptions:
accordion and drawer height, where no transform expresses the change. Both are
single elements with no siblings reflowing beside them.

---

## Project structure

```
src/
  app/
    (site)/          Public pages — share the navbar, footer and chrome
    admin/
      login/         Standalone, outside the dashboard shell
      (dashboard)/   Dashboard, gallery, enquiries, placeholders
    api/             Public + admin route handlers
  components/
    motion/          Animation primitives
    layout/          Navbar, footer, cursor, chrome
    sections/        Page-level composed sections
    gallery/         Public gallery + admin gallery UI
    ui/              Buttons, cards, modals, headings
  hooks/             Motion preference, in-view
  lib/
    auth/            Session (Edge-safe), password (Node), guard
    gallery/         Types, validation, image pipeline, drivers
    motion.ts        Animation tokens and variants
    site.ts          Company data and navigation
supabase/schema.sql  Tables, indexes, RLS, storage bucket
```

---

## Known scope boundaries

- **Admin sections other than Gallery** (Services, Engineering Equipment,
  College Projects) are honest placeholders. That content lives in
  `src/lib/*.ts` today; each screen names its source file and the steps to make
  it database-backed. The spec scoped Gallery as the fully functional one.
- **Enquiries** are stored and listed in the admin, but no email notification
  is wired up — `saveEnquiry()` in `src/lib/enquiries.ts` is the single place
  to add one.
- **No stock photography** is used anywhere. Solution pages rely on written
  content rather than illustration; real photographs belong in the
  admin-managed Gallery.
