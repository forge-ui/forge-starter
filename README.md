# Forge Starter

**Agent-native admin scaffold** for 0→1 B-side / internal apps.

Next.js 16 + Tailwind v4 + [`@forge-ui-official/core`]. Coding Agent is the primary IDE: skills split backend vs UI, real pages act as copyable samples — same *method* as [ShipAny Next](https://docs.shipany.ai/zh/shipany-next), **not** a SaaS feature pack (no payments / credits / CMS / landing factory).

| | |
|--|--|
| English | Forge Starter |
| 中文 | Forge 后台脚手架 |
| GitHub | https://github.com/forge-ui/forge-starter |

## Quick Start

```bash
pnpm install
cp .env.example .env
# Optional local Postgres (required for AUTH_MODE=local and all business CRUD):
# docker compose up -d
# AUTH_MODE=local
# AUTH_SECRET=<at-least-16-chars>
# DATABASE_URL=postgresql://forge:forge@127.0.0.1:5432/forge_starter
pnpm db:push
pnpm dev
```

Open `http://localhost:3000`. Login uses demo mode by default (`AUTH_MODE=demo` — any username/password works; **demo does not store business data**).

> **CRUD always needs Postgres.** `AUTH_MODE=demo` only skips the login-user table. Accounts, approvals, and any new module require `DATABASE_URL` + `pnpm db:push`.

## What this is / is not

| Is | Is not |
|----|--------|
| Forge-only admin shell + dual UI samples | ShipAny full SaaS (billing, credits, RBAC product, CMS) |
| Skill pipeline: module → page | One-shot “generate whole product” |
| `/ref/*` layout gallery for agents | Product features in the sidebar |
| Postgres + SMTP + password auth | Multi-DB / OAuth / cloud mail SDKs |

Agent contract (must-read): **`AGENTS.md`**. Product intent: **`PRODUCT.md`**.

## Agent workflow

```text
1. Read AGENTS.md + docs/forge-components.md
2. Brand / env        → forge-starter-quick-start
3. Each business object:
     a. forge-starter-new-module  → schema + service + API
     b. forge-starter-new-page    → list / form / detail + menu
4. Pure board / non-CRUD screen → new-page only
5. pnpm typecheck · browser-check the main path (no curl-only QA)
```

**Detail shape has no global default:**

- **Heavy** (tabs, archive, multi-block) → clone **`accounts`** (full page detail)
- **Light** (few fields, back to list) → clone **`approvals`** (detail modal)
- Unsure → ask the user

**Component pick order:** live samples → `/ref/*` → forge monorepo cases (if present).

## Runnable samples

| Path | Role |
|------|------|
| `/accounts` · `/accounts/[id]` | Collection + modal form + **full-page detail** |
| `/approvals` | Collection + create modal + **detail modal** + queue actions |
| `/dashboard` | Workbench (ecommerce-2 style) |
| `/settings/*` | Profile, security, apps, notifications |
| **`/ref/`** | **AI reference gallery** (real routes, **not** in product menu) |

`/ref` is on in development by default; production returns 404 unless `SHOW_REF_PAGES=true`. Index and catalog: `docs/reference-pages.md`, `lib/reference/catalog.ts`.

Includes layout paradigms such as list table/cards, CRM person & product multi-tab, full-page form, calendar, chat, files, kanban, dashboards, invoice, tickets, API keys, credits ledger, billing, and more — **mock UI for cloning**, not SaaS product modules.

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **UI:** `@forge-ui-official/core` (Forge UI Kit) + Tailwind CSS v4 + solar-icon-set
- **Auth:** Username/email + password · `jose` sessions · demo \| local
- **DB:** PostgreSQL only · Drizzle ORM
- **Mail:** SMTP only (nodemailer); no cloud email SDK

## Project structure

```text
app/
  (auth)/          # login · register · forgot/reset password
  (app)/           # dashboard · accounts · approvals · settings · ref/*
  api/             # auth · accounts · approvals
components/        # app-shell · *-store · *-dialog · ui/modal
config/            # site · menu · apps
lib/               # auth · db · accounts · approvals · reference
docs/              # agent-native · page-roles · forge-components · …
.agents/skills/    # quick-start · new-module · new-page  (sync .claude/skills)
AGENTS.md PRODUCT.md
```

## Skills

| Skill | Scope |
|-------|--------|
| `forge-starter-quick-start` | Brand, accent, menu labels, env, module backlog |
| `forge-starter-new-module` | **Backend only:** schema + service + API |
| `forge-starter-new-page` | **UI only:** list / form / detail + menu (needs API first) |

Canonical path: `.agents/skills/`. Keep `.claude/skills/` in sync when editing.

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript check |
| `pnpm db:push` | Push schema (dev) |
| `pnpm db:generate` | Generate migrations |
| `pnpm db:studio` | Drizzle Studio |

## Environment

```env
# demo | local  (demo = skip login user table only)
AUTH_MODE=demo
AUTH_SECRET=change-me-to-a-long-random-string

APP_URL=http://localhost:3000
DATABASE_URL=postgresql://forge:forge@127.0.0.1:5432/forge_starter

# Optional: force login even in demo
# AUTH_GUARD=true

# Optional: AI reference pages in production
# SHOW_REF_PAGES=true

# Optional SMTP (forgot-password logs link to console if unset)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Forge Starter <noreply@example.com>"
```

See `.env.example`. Docker Postgres: `docker compose up -d` (see `docker-compose.yml`).

## Docs

| Doc | Purpose |
|-----|---------|
| `AGENTS.md` | Agent contract (must-read) |
| `PRODUCT.md` | Product intent & non-goals |
| `docs/agent-native.md` | Workflow & skill boundaries |
| `docs/forge-components.md` | Role → kit components → samples |
| `docs/page-roles.md` | Page roles & detail choice |
| `docs/module-template.md` | Module + page dual samples |
| `docs/reference-pages.md` | `/ref/*` catalog |

## Boundaries

- **Forge only** — no MUI / Ant / second component kit; missing capability → `FORGE-GAP`
- Colors: `fg-*` tokens · controls: `color={siteConfig.accent}`
- List filters: **one row** pills + search
- No dead / decorative buttons; implement or hide
- Ship gate: `pnpm typecheck` + **browser** main path (not curl-only)

---

**Forge Starter** — scaffold for agents building real admin UIs on Forge.
