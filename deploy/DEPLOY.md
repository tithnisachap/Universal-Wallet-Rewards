# Deployment runbook — two-droplet setup (app + existing DB droplet)

This is a checklist, not a script — most of these steps are account-level
actions (DigitalOcean dashboard, Cloudflare, Google Cloud Console) that need
to happen in your own accounts.

## 0. Before you start

- [ ] Decide on a hostname: a real domain, or a free `sslip.io` hostname
      derived from the app droplet's IP (e.g. `wallet.164.90.12.34.sslip.io`
      once the droplet exists and you know its IP).
- [ ] Confirm the DB droplet's Postgres is reachable — you'll need its
      **private network IP** (DigitalOcean VPC), not its public one.

## 1. DB droplet — lock it down

- [ ] Enable DigitalOcean VPC/private networking between the DB droplet and
      the (soon-to-exist) app droplet, if not already on the same VPC.
- [ ] In `pg_hba.conf`, only allow connections from the app droplet's
      private IP (not `0.0.0.0/0`).
- [ ] In the DigitalOcean Cloud Firewall for the DB droplet, only allow port
      5432 from the app droplet — never expose it publicly.
- [ ] Create the app's database + role (matches `.env.production.example`):
      ```sql
      CREATE ROLE wallet_rewards WITH LOGIN PASSWORD 'CHANGE_ME_STRONG_PASSWORD';
      CREATE DATABASE wallet_rewards OWNER wallet_rewards;
      ```
- [ ] Set up a daily backup — simplest option, a cron'd `pg_dump`:
      ```bash
      # /etc/cron.d/wallet-rewards-backup
      0 3 * * * postgres pg_dump -U wallet_rewards wallet_rewards | gzip > /var/backups/wallet_rewards_$(date +\%F).sql.gz
      ```

## 2. App droplet — provision

- [ ] Spin up a Droplet (Ubuntu 24.04 LTS is a safe default), same region +
      VPC as the DB droplet.
- [ ] Install: `nginx`, `php8.3-fpm`, `php8.3-pgsql`, `php8.3-mbstring`,
      `php8.3-bcmath`, `php8.3-xml`, `php8.3-curl`, `composer`, `nodejs` + `npm`
      (Node only needed to build assets — can build locally and `scp` the
      `public/build/` folder instead, if you'd rather not install Node on
      the droplet).
- [ ] Clone the repo into `/var/www/wallet-rewards`.
- [ ] `composer install --no-dev --optimize-autoloader`
- [ ] `npm ci && npm run build` (produces `public/build/`)
- [ ] Copy `.env.production.example` → `.env`, fill in every `CHANGE_ME`.
- [ ] `php artisan key:generate`
- [ ] `php artisan storage:link`
- [ ] `php artisan migrate --seed --force`
      (`--force` is required because `APP_ENV=production` otherwise refuses
      to run migrations without it — that's a deliberate Laravel safety
      check, not a bug.)
- [ ] `php artisan config:cache && php artisan route:cache && php artisan view:cache`

## 3. Nginx

- [ ] Copy `deploy/nginx.conf` to `/etc/nginx/sites-available/wallet-rewards`,
      replacing `server_name` with your real hostname.
- [ ] `ln -s /etc/nginx/sites-available/wallet-rewards /etc/nginx/sites-enabled/`
- [ ] `nginx -t` (must pass before reloading)
- [ ] `systemctl reload nginx`

## 4. Cloudflare (recommended even without a paid domain)

- [ ] Point your domain (or set up the sslip.io hostname) to the app
      droplet's public IP.
- [ ] If using a real domain: add it to Cloudflare, set the DNS record to
      "Proxied" (orange cloud) — this gets you free SSL, DDoS mitigation,
      and static-asset caching at the edge with no origin cert to manage.
- [ ] SSL/TLS mode: "Flexible" is simplest (Cloudflare↔browser is HTTPS,
      Cloudflare↔origin is plain HTTP, which is what `deploy/nginx.conf`
      assumes). Fine for a demo; not what you'd use for a real product.

## 5. Google OAuth

- [ ] In Google Cloud Console → your OAuth client → Authorized redirect
      URIs, add: `https://<your-hostname>/auth/google/callback`
      (must exactly match `GOOGLE_REDIRECT_URI` derived from `APP_URL`).

## 6. Verify

- [ ] Visit the site over HTTPS, confirm the login page loads and Google
      login round-trips correctly.
- [ ] Spot-check one flow per role (customer coupon scan, vendor promotion
      creation, admin vendor approval).
- [ ] Enable DigitalOcean's built-in droplet monitoring (Droplet → Graphs)
      on both droplets — free, and gives you CPU/memory/disk graphs, which
      also doubles as evidence for "what happens under load" if asked.

## 7. Optional, if time permits

- [ ] Sentry: `composer require sentry/sentry-laravel`, add `SENTRY_LARAVEL_DSN`
      to `.env`, publish config. A few minutes of work, gives you real error
      visibility during the demo window.
- [ ] DigitalOcean Spaces for file storage: add a `spaces` disk in
      `config/filesystems.php` (S3-compatible, Spaces' own endpoint), swap
      the 2-3 `->store(..., 'public')` calls in `ProfileController` /
      `BranchController` to the new disk name, set `AWS_*` env vars.
- [ ] Load test: `k6` or `ab` against `/api/...` endpoints to get a real
      req/sec number before the rate limiter kicks in — turns the "what
      about 10k requests" answer from theory into a measured result.
