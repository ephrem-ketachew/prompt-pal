# Prompt Pal Backend API

Backend REST API for **Prompt Pal**, built with **Node.js + Express (v5) + TypeScript**, using **MongoDB (Mongoose)**, **JWT (httpOnly cookie)** auth, and **Swagger** docs.

## Quick links

### Production (Live)

- **Base URL**: [https://prompt-pal.onrender.com](https://prompt-pal.onrender.com)
- **API prefix**: `https://prompt-pal.onrender.com/api/v1`
- **Swagger UI**: [https://prompt-pal.onrender.com/api-docs](https://prompt-pal.onrender.com/api-docs)
- **Health check**: [https://prompt-pal.onrender.com](https://prompt-pal.onrender.com)

### Local Development

- **Base URL**: `http://localhost:3000`
- **API prefix**: `http://localhost:3000/api/v1`
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health check**: `GET /`

## Features

- **Auth**: email/password + Google OAuth (JWT stored in `jwt` httpOnly cookie)
- **Users**: profile fetch + update
- **Admin**: manage users (role/status) with RBAC
- **Prompts**: create/feed/read/update/delete + like/unlike + view tracking + search
- **Uploads**: Cloudinary support for images (optional in dev)
- **Validation**: Zod request validation
- **Docs**: Swagger via `swagger-jsdoc` + `swagger-ui-express`

## Getting started (Windows / macOS / Linux)

### Prerequisites

- Node.js (recommended: latest LTS)
- pnpm (project uses `pnpm@10.x`)
- MongoDB (Atlas or local)

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment

This project loads env vars from **`config.env`** (not `.env`) via `src/config/env.config.ts`.

1. Copy the example:

```bash
copy config.env.example config.env
```

(On macOS/Linux:)

```bash
cp config.env.example config.env
```

2. Update values in `config.env`.

> Important: `config.env` is gitignored. Don’t commit secrets.

### 3) Run in dev

```bash
pnpm dev
```

Server runs on `PORT` (default: **3000**).

### 4) Build & run production build

```bash
pnpm build
pnpm start
```

## API Documentation (Swagger)

Swagger UI is available at:

- **Production**: [https://prompt-pal.onrender.com/api-docs](https://prompt-pal.onrender.com/api-docs)
- **Local**: `http://localhost:3000/api-docs`

Swagger scans:

- `./src/routes/*.ts`
- `./src/models/*.ts`

## Main routes

All routes are mounted under `/api/v1`:

- **Auth**: `/api/v1/auth`
- **User**: `/api/v1/user`
- **Admin**: `/api/v1/admin`
- **Prompts**: `/api/v1/prompts`

## Scripts

From `package.json`:

- **dev**: `pnpm dev` (watch mode via `tsx`)
- **build**: `pnpm build` (TypeScript compile + alias rewrite)
- **start**: `pnpm start` (run `dist/server.js`)
- **lint**: `pnpm lint`
- **format**: `pnpm format`
- **seed super admin**: `pnpm seed:admin`

## Environment variables

See `config.env.example` for the full list. Highlights:

### Required (app will exit if missing)

- **NODE_ENV**: `development` | `production`
- **PORT**
- **DATABASE_URL**, **DATABASE_PASSWORD**
- **JWT_SECRET**, **JWT_EXPIRES_IN**
- **EMAIL_FROM**

### Optional (feature-dependent)

- **CLOUDINARY_CLOUD_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET**
- **MAILTRAP_HOST**, **MAILTRAP_PORT**, **MAILTRAP_USERNAME**, **MAILTRAP_PASSWORD**
- **BREVO_HOST**, **BREVO_PORT**, **BREVO_USER**, **BREVO_SMTP_KEY**
- **GOOGLE_CLIENT_ID**, **GOOGLE_CLIENT_SECRET**, **GOOGLE_REDIRECT_URI**
- **CLIENT_URL**, **CORS_ORIGIN**
- **SUPER_ADMIN_EMAIL**, **SUPER_ADMIN_PASSWORD**, **SUPER_ADMIN_PHONE**

## Security notes

- **Auth cookie**: JWT is stored in a cookie named **`jwt`** (httpOnly).
- **CORS**: uses `CORS_ORIGIN` (comma-separated list) and `credentials: true`.
- **Rate limiting**: code exists but is currently commented out in `src/app.ts`.

## Project docs

- `ARCHITECTURE.md`: system overview and integrations
- `REQUEST_LIFECYCLE.md`: request flow (route → controller → service → model)
- `GOOGLE_OAUTH_FLOW.md`: Google OAuth notes
- `AUTH_SWAGGER_CORRECTIONS.md`: auth Swagger alignment notes

## License

ISC
