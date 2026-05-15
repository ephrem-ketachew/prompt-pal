# Prompt Pal Backend API

Prompt Pal Backend is the API layer for a prompt-sharing platform. It handles authentication, prompt CRUD, moderation, blogs, analytics, and AI prompt optimization behind a TypeScript and Express stack.

## What It Does

- Email/password authentication with JWT cookies
- Google OAuth login
- Prompt creation, discovery, likes, shares, favorites, and moderation
- AI prompt optimization with quick and premium flows
- Blog and comment management
- Admin tools and analytics

## Stack

- Node.js + Express 5
- TypeScript
- MongoDB + Mongoose
- Zod validation
- Swagger/OpenAPI docs
- Cloudinary for media uploads
- Brevo or Mailtrap for email
- Google Gemini for prompt optimization

## Quick Start

### Prerequisites

- Node.js LTS
- pnpm 10.x
- MongoDB Atlas or a local MongoDB instance

### Install

```bash
pnpm install
```

### Configure Environment

Create a `config.env` file in the project root and set the values your deployment needs.

Required variables:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=<mongodb-connection-string>
DATABASE_PASSWORD=<mongodb-password>
JWT_SECRET=<jwt-secret>
JWT_EXPIRES_IN=90d
EMAIL_FROM=<sender-email>
```

Common optional variables:

```env
CORS_ORIGIN=http://localhost:3000
CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

MAILTRAP_HOST=<smtp-host>
MAILTRAP_PORT=<smtp-port>
MAILTRAP_USERNAME=<smtp-user>
MAILTRAP_PASSWORD=<smtp-password>

BREVO_HOST=<smtp-host>
BREVO_PORT=<smtp-port>
BREVO_USER=<smtp-user>
BREVO_SMTP_KEY=<smtp-key>

GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>
GOOGLE_REDIRECT_URI=postmessage

GOOGLE_AI_API_KEY=<gemini-api-key>
GEMINI_MODEL=gemini-2.5-flash
OPTIMIZATION_TEMPERATURE=0.7
OPTIMIZATION_MAX_TOKENS=2000

SUPER_ADMIN_EMAIL=<admin-email>
SUPER_ADMIN_PASSWORD=<admin-password>
SUPER_ADMIN_PHONE=<admin-phone>
```

### Run

```bash
pnpm dev
```

### Build and Start

```bash
pnpm build
pnpm start
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm format
pnpm seed:admin
pnpm migrate:moderation
pnpm test:endpoints
```

## API Docs

- Swagger UI: `/api-docs`
- Local: `http://localhost:3000/api-docs`
- Production: `https://prompt-pal-tyyl.onrender.com/api-docs`

## Project Structure

```text
src/
  config/        environment, database, logger, swagger
  controllers/   request handlers
  middleware/    auth, validation, error handling
  models/        Mongoose models
  routes/        API route definitions
  services/      business logic
  utils/         shared helpers
  validation/    Zod schemas
  _migrations/   database migrations
  _seeder/       seed scripts
```

## Deployment

- Production is deployed on Render
- MongoDB Atlas is used for persistence
- Cloudinary handles uploaded media
- Logging is handled with Pino

## Architecture Notes

See [ARCHITECTURE.md](ARCHITECTURE.md) for a deeper system breakdown.

## License

ISC
