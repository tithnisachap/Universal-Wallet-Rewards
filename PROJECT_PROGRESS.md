# Universal Wallet & Rewards — Project Progress

_Last updated: Step 3 — Frontend Integration_

This document tracks what has been built, what remains, and the assumptions
made along the way. It is meant to be updated at the end of every step.

---

## 1. Database Schema

PostgreSQL, via Laravel migrations. 7 new tables were added on top of
Laravel's defaults (`users`, `cache`, `jobs`, `personal_access_tokens`,
`sessions`, `password_reset_tokens`).

### `users` (extended)
Laravel's default table, extended for Google-only auth and role-based access.

| Column | Type | Notes |
|---|---|---|
| google_id | string, nullable | unique — populated once OAuth is wired |
| avatar | string, nullable | Google profile photo URL |
| role | enum(`customer`,`vendor`,`admin`) | indexed |
| password | string, nullable | kept nullable — Google is the only auth path |

### `customers`
| Column | Type | Notes |
|---|---|---|
| user_id | FK → users | unique, cascade delete |
| customer_code | string | unique, e.g. `CUS-000125` |

### `vendors`
| Column | Type | Notes |
|---|---|---|
| user_id | FK → users | unique, cascade delete |
| business_name, category, logo_path, phone, email, address, website | | free-text |
| status | enum(`pending`,`approved`,`rejected`,`suspended`) | default `pending`, indexed |
| submitted_at, reviewed_at | timestamp, nullable | |
| reviewed_by | FK → users, nullable | null-on-delete |
| review_note | text, nullable | |

**No `not_completed` status.** That state is the absence of a `vendors` row
for a given user — checked at the application layer, not stored.

### `branches`
| Column | Type | Notes |
|---|---|---|
| vendor_id | FK → vendors | cascade delete, indexed |
| name, address, phone, photo_path | string | |
| opening_hours | **jsonb**, nullable | `{"mon_fri": {"open","close"}, "sat_sun": {...}}` |
| latitude, longitude | decimal(10,7), nullable | for the map/location feature |
| is_main | boolean | default false |

**Postgres feature:** partial unique index —
`CREATE UNIQUE INDEX branches_one_main_per_vendor ON branches (vendor_id) WHERE is_main = true`
— at most one main branch per vendor, enforced by the database.

### `promotions`
| Column | Type | Notes |
|---|---|---|
| vendor_id | FK → vendors | cascade delete |
| type | enum(`stamps`,`points`) | |
| category | string | free-text (Drinks/Food/Discount/…), not an enum |
| title, description, terms | | |
| required_amount | unsigned int | stamps needed or points cost |
| starts_at, ends_at | date | |
| is_active | boolean | default true — vendor-controlled deactivation |

**Postgres feature:** partial unique index —
`CREATE UNIQUE INDEX promotions_one_active_stamp_per_vendor ON promotions (vendor_id) WHERE type = 'stamps' AND is_active = true`
— enforces the confirmed business rule: **at most one active Stamps promotion
per vendor**, while **Points promotions are unrestricted** (a vendor can run
as many as they like, since customers never browse them — redemption is
verbal, vendor-initiated).

### `customer_loyalty`
Running balance per customer **per vendor** (shared across all of that
vendor's branches).

| Column | Type | Notes |
|---|---|---|
| customer_id, vendor_id | FK | both cascade delete |
| points_balance, stamps_count | unsigned int | default 0 |
| *unique* | (customer_id, vendor_id) | |

### `customer_activities`
The ledger — powers both the Customer History screen and the Vendor Activity
screen, and is the source for analytics aggregates.

| Column | Type | Notes |
|---|---|---|
| customer_id, vendor_id | FK | cascade delete |
| branch_id | FK, nullable | null-on-delete — which branch performed it |
| promotion_id | FK, nullable | null-on-delete — which campaign, if relevant |
| type | enum(`points_earned`,`points_deducted`,`stamp_earned`,`reward_redeemed`) | |
| amount | signed integer | delta; matches the "+25 / -150" UI display directly |
| note | string, nullable | e.g. "1 Free Drink" tag shown in history |
| occurred_at | timestamp | display/sort time, independent of `created_at` |

### `reward_redemptions`
The timed-QR **stamp** claim lifecycle only (Points redemptions are logged
directly as a `customer_activities` row with no QR step, per the confirmed
business rule).

| Column | Type | Notes |
|---|---|---|
| customer_id, vendor_id | FK | cascade delete |
| promotion_id | FK | **restrict on delete** — preserves redemption history |
| code | string | unique QR token |
| status | enum(`pending`,`redeemed`,`expired`) | default `pending` |
| expires_at, redeemed_at | timestamp | |

### Design rules applied consistently
1. **Enums reserved for true state machines** (`role`, `vendor.status`,
   `promotion.type`, `customer_activities.type`, `reward_redemptions.status`).
   Free-text labels (business category, promotion category) stay plain
   strings for flexibility.
2. **Single owner-account model** — no vendor-staff table. The vendor's one
   user account performs every scan/action (per the user stories: "manage
   from a single account").
3. **Cascade strategy is deliberate, not blanket**: tightly-owned children
   (branches, promotions) cascade with their vendor; ledger rows cascade with
   their customer/vendor but null out an optionally-referenced branch or
   promotion; `reward_redemptions.promotion_id` **restricts** deletion to
   protect redemption history.

---

## 2. Model Relationships

```
User
 ├─ hasOne   Customer
 ├─ hasOne   Vendor
 └─ hasMany  Vendor (as reviewedVendors, via reviewed_by)

Customer
 ├─ belongsTo User
 ├─ hasMany  CustomerLoyalty
 ├─ hasMany  CustomerActivity
 └─ hasMany  RewardRedemption

Vendor
 ├─ belongsTo User
 ├─ belongsTo User (as reviewer, via reviewed_by)
 ├─ hasMany  Branch
 ├─ hasMany  Promotion
 ├─ hasMany  CustomerLoyalty
 ├─ hasMany  CustomerActivity
 └─ hasMany  RewardRedemption

Branch
 ├─ belongsTo Vendor
 └─ hasMany  CustomerActivity

Promotion
 ├─ belongsTo Vendor
 ├─ hasMany  CustomerActivity
 └─ hasMany  RewardRedemption

CustomerLoyalty
 ├─ belongsTo Customer
 └─ belongsTo Vendor

CustomerActivity
 ├─ belongsTo Customer
 ├─ belongsTo Vendor
 ├─ belongsTo Branch (nullable)
 └─ belongsTo Promotion (nullable)

RewardRedemption
 ├─ belongsTo Customer
 ├─ belongsTo Vendor
 └─ belongsTo Promotion
```

Casts of note: `Branch.opening_hours` → `array`; `Branch.latitude/longitude`
→ `decimal:7`; all `*_at` columns → `datetime`/`date`; `Promotion.is_active`
and `Branch.is_main` → `boolean`.

---

## 3. Completed Work (Step 2A)

- [x] Schema designed and approved before implementation.
- [x] `users` migration extended (google_id, avatar, role); 7 new migrations
      created (customers, vendors, branches, promotions, customer_loyalty,
      customer_activities, reward_redemptions).
- [x] Foreign keys, indexes, unique constraints, and cascade rules on every
      table; two Postgres partial unique indexes enforcing real business
      rules at the database level (verified by intentionally triggering
      both and confirming Postgres rejects the violation).
- [x] 7 new Eloquent models with full relationship graphs and appropriate
      casts.
- [x] 7 new factories (plus an extended `UserFactory` with
      `customer()`/`vendor()`/`admin()` states) with realistic Faker data
      and meaningful named states (`approved()`, `rejected()`, `suspended()`,
      `stamps()`, `points()`, `expired()`, `scheduled()`, `main()`, etc.).
- [x] 11 Form Request classes covering every write action implied by the
      Step 1 UI (vendor shop setup/edit, branch create/edit, promotion
      create/edit with the active-stamp-promotion rule re-validated at the
      HTTP layer, vendor QR actions, admin vendor review, customer profile
      edit). **Not yet wired to routes** — no controllers exist yet.
- [x] Three seeders (`AdminSeeder`, `VendorSeeder`, `CustomerSeeder`) chained
      through `DatabaseSeeder`. The seeded data intentionally mirrors the
      Step 1 frontend's `mock.js` placeholder values exactly for the "hero"
      demo account (Vitou Raksmey / CUS-000125 / The Coffee Bean with its 4
      branches and 5 promotions, matching balances and ledger entries down
      to the timestamp) so Step 2B can swap mock data for real API calls
      with no visible discontinuity. Plus ~20 vendors across every status,
      ~20 customers, and realistic activity volume for analytics.
- [x] `migrate:fresh` and `db:seed` both verified to run clean with no
      errors.

### Seeded data snapshot
| Table | Rows |
|---|---|
| users | 42 |
| customers | 20 |
| vendors | 20 (13 approved, 3 pending, 3 rejected, 1 suspended) |
| branches | 17 |
| promotions | 17 |
| customer_loyalty | 40 |
| customer_activities | 91 |
| reward_redemptions | 2 (1 pending, 1 expired) |

---

## 4. Step 2B — REST API (completed)

38 endpoints across `/api/customer/*`, `/api/vendor/*`, `/api/admin/*`, all
behind `auth:sanctum` + a `role:` middleware, plus a shared `/api/me`
bootstrap endpoint. Highlights:

- **18 controllers**, thin, delegating to services.
- **8 API Resources**, viewer-aware (e.g. a vendor's `review_note` is only
  visible to that vendor or an admin).
- **4 Policies** (Vendor, Branch, Promotion, Customer) for per-record
  ownership checks, auto-discovered by Laravel's naming convention.
- **`LoyaltyService`** — every points/stamps mutation
  (`addStamps`/`addPoints`/`deductPoints`/`claimStampReward`/`redeemCode`)
  runs inside `DB::transaction()` with `lockForUpdate()` on the
  `customer_loyalty` row, so concurrent scans can't corrupt a balance.
- **`VendorReviewService`** — approve/reject/suspend/reinstate state
  transitions.
- **63 tests, all passing**, run against a real Postgres test database
  (`wallet_rewards_test`), not SQLite — specifically so the two partial
  unique indexes from Step 2A get exercised for real.
- Two real bugs the test suite caught and fixed: Eloquent not reflecting a
  Postgres column default back into the in-memory model after `create()`
  (made a fresh promotion look "deactivated" until reloaded), and a
  `redeemCode()` early-exit that tried to persist "mark this code expired"
  *inside* the same transaction as the exception that aborts it — Postgres
  rolled that write back too. Both fixed; see `LoyaltyService` and
  `PromotionController@store`.

## 5. Step 3 — Frontend Integration (completed)

The Step 1 frontend now runs entirely on real data. `resources/js/data/mock.js`
has been deleted — nothing imports it anymore.

### Interim auth (temporary — not Google OAuth)
Google OAuth is still out of scope, but the API requires a real Sanctum
session. Added `POST /api/auth/dev-login` (`app/Http/Controllers/Api/Auth/DevLoginController.php`):
looks up a seeded user **by email only, no password**, issues a real
Sanctum token. Guarded with `abort_unless(app()->environment(['local','testing']), 404)`
so it can never be reachable outside local dev/tests. Wired into the
existing Login → Choose Account flow with **zero UI changes** — the account
chooser now lists real seeded emails (`resources/js/data/demoAccounts.js`)
and clicking one calls the real endpoint. **This must be deleted once
Socialite login is wired up** — it is a deliberate, clearly-labeled stand-in,
not a permanent auth path.

### Frontend architecture added
- **TanStack Query** (`@tanstack/react-query`) for all server state — no
  component holds fetched data in local `useState` anymore.
- `resources/js/lib/apiClient.js` — one axios instance; a request interceptor
  attaches the bearer token and spoofs `PUT`/`PATCH` as `POST` with `_method`
  when the body is `FormData` (Laravel can't parse multipart on PUT/PATCH);
  every hook goes through an `api.get/post/put` wrapper that normalizes every
  failure into `{ status, message, errors }` so error handling is identical
  everywhere.
- `resources/js/queries/{auth,customer,vendor,admin}.js` — one hook per
  endpoint (~35 hooks total), each with clear cache-invalidation rules (e.g.
  adding stamps invalidates the vendor dashboard, activity log, and
  analytics queries at once).
- `resources/js/context/SessionContext.jsx` — now holds a real bearer token
  (localStorage-backed) instead of a per-role boolean flag; `RequireAuth`
  fetches `/me` and redirects if the token is missing, invalid, or belongs
  to the wrong role.
- `components/ui/{LoadingState,ErrorState,QueryState}.jsx` — every
  data-driven screen follows the same loading → error (with retry) → empty →
  content branch via `QueryState`, so this is handled consistently rather
  than per-page.
- Vendor/branch "logo" placeholders now render the real uploaded image
  (`/storage/{path}`) when present, falling back to the original
  colored-initial circle otherwise (`components/VendorAvatar.jsx`).

### Known gaps / deliberate simplifications
- **No camera-based QR scanning.** No such library was in scope or already
  installed, and adding one would mean new UI, which was off-limits this
  step. The vendor Scanner screen keeps its exact original look; tapping it
  opens a `window.prompt()` asking for the customer code a real scan would
  have decoded, then calls the real `/vendor/scan` endpoint with it.
- **The vendor-side "redeem a customer's reward QR" endpoint
  (`POST /vendor/redemptions/redeem`) has no screen wired to it.** Step 1
  never built a distinct "confirm redemption" screen — the single Scanner
  screen's copy ("Scan Customer QR") maps to customer identification, not
  reward redemption, so wiring the redeem endpoint in would have meant
  inventing new UI. The endpoint is fully built and tested (Step 2B); it's
  just not reachable from the current screens.
- **Location screen's map pins stay decorative.** There's no map SDK in the
  Step 1 design (just a gradient background with a few absolutely-positioned
  dots), so real nearby-branch data feeds the "Nearby Stores" list at the
  bottom (via the browser's real Geolocation API, falling back to a Phnom
  Penh center point), but the pins on the fake map are not truly
  geo-positioned.
- **Vendor Activity date filter** only correctly filters "Today" (the API
  takes a single exact date). "This Week" / "This Month" fall back to
  showing everything rather than fabricating a range endpoint that wasn't
  built.
- Two placeholder edit actions ("Edit Profile" on the customer Profile
  screen) use `window.prompt()` rather than a new inline form, since Step 1
  never designed one and adding form UI was out of scope for this step.

### Verification
- Backend: full 62-test suite re-run clean after the one Step 3 backend
  change (see below).
- Frontend: `npm run build` succeeds; a full Playwright run drove real
  logins (via dev-login) and real data through all three roles — including
  the two most important write paths end-to-end through actual UI clicks:
  a vendor adding a stamp (`10 stamps → 11 stamps`, confirmed via screenshot
  diff) and an admin approving a pending vendor (vendor disappeared from the
  pending list after clicking Approve). Zero console errors, zero failed
  API requests across the whole run.
- One small **Step 3 backend fix**: `Api\Admin\VendorController@index`/`@show`
  weren't eager-loading the vendor's `user` relation, so the "Owner" name
  the admin Vendor Approvals screen has always shown would have rendered
  broken once real data replaced the mock. Fixed by adding `'user:id,name,email'`
  to the eager-load list; re-verified against the full test suite.

---

## 6. Remaining Work

- **Google OAuth (Socialite)** — still not implemented. `DevLoginController`
  and its two routes must be deleted once it lands.
- **Camera-based QR scanning** on the vendor Scanner screen (currently a
  `window.prompt()` stand-in).
- **A "confirm redemption" screen** for the vendor to consume a customer's
  stamp-reward QR code — the backend endpoint exists and is tested, but no
  Step 1 screen maps to it.
- **File storage** for `logo_path` / `photo_path` — currently the local
  `public` disk (via `php artisan storage:link`), not yet DigitalOcean Spaces
  per the SDA's physical view.
- Bundle size warning from Vite (~900 kB main chunk) — candidate for
  route-based code-splitting later, not addressed this step.
- No automated frontend tests (component/unit) — verification so far is
  backend feature tests + manual/scripted browser smoke testing.

---

## 7. Assumptions Made

1. **Vendor "not completed" state** is modeled as *no `vendors` row exists*
   rather than a stored status, since Step 1's mockups show it purely as a
   pre-registration UI state.
2. **One business per user, one owner account per business.** No
   vendor-staff/multi-user table — matches the user story "manage from a
   single account."
3. **Stamp progress lives on `customer_loyalty`, not per-promotion.** Since
   only one Stamps promotion can be active per vendor at a time, the current
   stamp count always unambiguously represents progress toward *the* active
   campaign. What happens to in-progress stamps if a vendor deactivates one
   Stamps promotion and activates a different one is left as a product
   decision for Step 2B (candidates: carry over, or reset to 0).
4. **Points promotions are informational only for the vendor**, per your
   explicit decision — never exposed to customers, unlimited concurrent
   count, redemption is a manual vendor-side deduction with no QR/ledger
   linkage beyond the `customer_activities` row itself.
5. **`customer_activities.amount` is a signed delta**, not an unsigned
   magnitude, so the ledger can be summed directly to reconstruct a balance
   without branching on `type`.
6. **`reward_redemptions` models the Stamps QR flow exclusively.** A
   Points-based "Reward Redeemed" ledger entry does not require a row here.
7. **Business/promotion categories are free-text**, not enumerated at the DB
   level, despite the Step 1 UI offering a fixed picklist — treated as a
   frontend/UX concern, not a structural database constraint, to avoid
   migration churn if the picklist grows.
8. Seed data uses fixed demo credentials (e.g. `admin@universalwallet.test`,
   `Tou@gmail.com`) purely for local development continuity with the Step 1
   mockups — not meant to represent real accounts.
9. **The dev-login stand-in authenticates by email with no password check.**
   Explicitly scoped to unblock frontend integration while Google OAuth is
   still out of scope, and hard-guarded to `local`/`testing` environments.
   Not a security shortcut for production — it must be removed, not just
   left disabled, once Socialite lands.
10. **A single bearer token represents one active session.** Logging in as a
    different role (e.g. switching from the customer app to the vendor app in
    the same browser) replaces the stored token rather than keeping multiple
    concurrent role sessions — this matches how a real Google-authenticated
    session would behave and kept `SessionContext` simple.
11. **The vendor Scanner's "tap to scan" is a `window.prompt()`, not a new
    input field**, to satisfy "keep the current UI unchanged" literally: no
    library exists yet to decode a real QR from the camera, and adding a
    text-input UI would have been a UI change this step explicitly excluded.
