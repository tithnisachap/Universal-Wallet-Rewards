# Universal Wallet & Rewards — Project Progress

_Last updated: Step 2A — Backend Foundation_

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

## 4. Remaining Work

- **Step 2B (assumed next):** Controllers, API routes, API Resources/policies
  wiring the Form Requests already built to real HTTP endpoints; Sanctum
  token issuance.
- **Google OAuth (Socialite)** — explicitly out of scope for this step. The
  `users` table is shaped to receive it (`google_id`, `avatar`, nullable
  `password`) but no auth flow exists yet.
- **File storage** for `logo_path` / `photo_path` (local disk vs. DigitalOcean
  Spaces per the SDA's physical view) — not configured yet.
- **QR code generation/validation logic** for `reward_redemptions.code` (the
  timed-claim flow) — schema exists, no service logic yet.
- **Business logic for balance mutation** (incrementing/decrementing
  `customer_loyalty` when a `customer_activities` row is written) — currently
  seeded data has consistent balances, but nothing enforces that consistency
  automatically yet (no model observers/events).
- Frontend (Step 1) still runs entirely on its own placeholder data in
  `resources/js/data/mock.js` — it has not been connected to this backend.
- No automated tests written yet for models/factories/constraints.

---

## 5. Assumptions Made

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
