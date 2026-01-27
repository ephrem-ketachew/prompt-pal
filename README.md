# Prompt Pal Backend API

A comprehensive REST API backend for **Prompt Pal**, a platform for sharing, discovering, and optimizing AI prompts. Built with modern technologies and best practices for scalability, security, and maintainability.

## 🚀 Live Deployment

- **Production URL**: [https://prompt-pal.onrender.com](https://prompt-pal.onrender.com)
- **API Base**: `https://prompt-pal.onrender.com/api/v1`
- **API Documentation**: [https://prompt-pal.onrender.com/api-docs](https://prompt-pal.onrender.com/api-docs)
- **Health Check**: [https://prompt-pal.onrender.com](https://prompt-pal.onrender.com)

## 🛠️ Technology Stack

- **Runtime**: Node.js with Express.js v5
- **Language**: TypeScript (type-safe development)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (httpOnly cookies) + Google OAuth 2.0
- **File Storage**: Cloudinary (image uploads & CDN)
- **Email Service**: Brevo (production) / Mailtrap (development)
- **AI Integration**: Google Gemini API (prompt optimization)
- **Documentation**: Swagger/OpenAPI (auto-generated)
- **Validation**: Zod schemas
- **Security**: Helmet, CORS, Rate Limiting, Input Sanitization

## ✨ Core Features

### Authentication & Authorization
- **Email/Password Registration**: Email verification, password reset
- **Google OAuth 2.0**: Social authentication with automatic account creation
- **JWT-based Auth**: Secure token storage in httpOnly cookies
- **Role-Based Access Control (RBAC)**: User, Admin, SuperAdmin roles
- **User Status Management**: Pending, Approved, Blocked states

### Prompt Management
- **CRUD Operations**: Create, read, update, delete prompts
- **Public Feed**: Paginated feed with filtering (tags, AI model, search)
- **Social Features**: Like/unlike, share, view tracking
- **Search & Filtering**: Full-text search, tag filtering, AI model filtering
- **Content Moderation**: Flagging system, hidden/deleted prompts
- **Multiple Outputs**: Support for multiple media outputs per prompt

### AI-Powered Prompt Optimizer
- **Quick Optimization**: Fast grammar and structure improvements
- **Premium Optimization**: Interactive question-based optimization using Google Gemini
- **Intent Preservation**: Ensures user intent is never altered
- **Quality Scoring**: Metrics for prompt quality assessment
- **Caching**: Performance optimization with in-memory caching

### Blog System
- **Blog Posts**: Create, read, update, delete blog posts
- **Comments**: Nested comment system with replies
- **Content Moderation**: Admin moderation tools
- **Rich Content**: Support for images, formatting, and metadata

### Admin Dashboard
- **User Management**: View, update, block/unblock users
- **Content Moderation**: Hide/delete prompts and blogs, manage flags
- **Analytics**: User statistics, content metrics, engagement data
- **Blog Administration**: Manage blog posts, comments, and content

### Additional Features
- **Profile Management**: User profiles with image uploads
- **Content Flagging**: User reporting system for inappropriate content
- **Analytics**: Comprehensive analytics for admins
- **Email Notifications**: Verification emails, password resets
- **Request Validation**: Zod schema validation for all endpoints
- **Error Handling**: Centralized error handling with proper HTTP status codes

## 📋 API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /google` - Google OAuth authentication
- `POST /forgot-password` - Request password reset
- `PATCH /reset-password/:token` - Reset password

### Users (`/api/v1/user`)
- `GET /me` - Get current user profile
- `PATCH /me` - Update user profile
- `PATCH /update-password` - Update password

### Prompts (`/api/v1/prompts`)
- `GET /` - Get public prompts feed (paginated, filterable)
- `GET /:id` - Get prompt by ID
- `POST /` - Create new prompt
- `PATCH /:id` - Update prompt
- `DELETE /:id` - Delete prompt
- `POST /:id/like` - Like/unlike prompt
- `POST /:id/share` - Share prompt
- `POST /:id/flag` - Flag inappropriate content
- `GET /my` - Get user's own prompts
- `GET /favorites` - Get user's favorite prompts

### Prompt Optimizer (`/api/v1/prompt-optimizer`)
- `POST /quick-optimize` - Quick prompt optimization
- `POST /analyze` - Analyze prompt quality
- `POST /premium-optimize` - Premium interactive optimization
- `GET /history` - Get optimization history

### Blogs (`/api/v1/blogs`)
- `GET /` - Get blog posts (paginated)
- `GET /:id` - Get blog post by ID
- `POST /` - Create blog post
- `PATCH /:id` - Update blog post
- `DELETE /:id` - Delete blog post
- `POST /:id/like` - Like/unlike blog post
- `GET /:id/comments` - Get comments for blog post

### Admin (`/api/v1/admin`)
- `GET /users` - Get all users (paginated)
- `GET /users/:id` - Get user details
- `PATCH /users/:id` - Update user (role, status)
- `GET /prompts` - Get all prompts (with moderation filters)
- `PATCH /prompts/:id` - Moderate prompt
- `GET /analytics` - Get analytics data
- `GET /blogs` - Get all blogs (admin view)
- `PATCH /blogs/:id` - Moderate blog post

## 🏗️ Architecture

### Project Structure
```
src/
├── config/          # Configuration files (DB, env, logger, swagger)
├── controllers/     # Request handlers (MVC controllers)
├── middleware/      # Custom middleware (auth, validation, error handling)
├── models/          # Mongoose schemas and models
├── routes/           # Express route definitions
├── services/         # Business logic layer
├── types/            # TypeScript type definitions
├── utils/            # Utility functions (email, cloudinary, etc.)
├── validation/      # Zod validation schemas
├── _migrations/      # Database migrations
└── _seeder/          # Database seeders
```

### Design Patterns
- **MVC Architecture**: Separation of concerns (Routes → Controllers → Services → Models)
- **Service Layer**: Business logic abstraction from controllers
- **Middleware Pattern**: Authentication, validation, error handling
- **Repository Pattern**: Database operations through Mongoose models

### Security Features
- **Helmet.js**: Security headers protection
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: 100 requests/hour per IP (configurable)
- **Input Sanitization**: Mongoose sanitize plugin + DOMPurify
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: httpOnly cookies (XSS protection)
- **Request Validation**: Zod schema validation
- **Request Size Limits**: 10kb limit for JSON/URL-encoded data

## 🚦 Getting Started

### Prerequisites
- **Node.js**: Latest LTS version
- **pnpm**: Version 10.x (package manager)
- **MongoDB**: Atlas (cloud) or local instance

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kech-backend-v2
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment**
   ```bash
   # Copy example config file
   cp config.env.example config.env
   
   # Edit config.env with your values
   ```

4. **Required Environment Variables**
   ```env
   NODE_ENV=development|production
   PORT=3000
   DATABASE_URL=<mongodb-connection-string>
   DATABASE_PASSWORD=<mongodb-password>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRES_IN=90d
   EMAIL_FROM=<your-email>
   ```

5. **Optional Environment Variables**
   ```env
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=<your-cloud-name>
   CLOUDINARY_API_KEY=<your-api-key>
   CLOUDINARY_API_SECRET=<your-api-secret>
   
   # Google OAuth
   GOOGLE_CLIENT_ID=<your-client-id>
   GOOGLE_CLIENT_SECRET=<your-client-secret>
   GOOGLE_REDIRECT_URI=<your-redirect-uri>
   
   # Email Service (Brevo or Mailtrap)
   BREVO_HOST=<smtp-host>
   BREVO_PORT=<smtp-port>
   BREVO_USER=<smtp-user>
   BREVO_SMTP_KEY=<smtp-key>
   
   # Google Gemini (for prompt optimization)
   GEMINI_API_KEY=<your-gemini-api-key>
   ```

6. **Run development server**
   ```bash
   pnpm dev
   ```

7. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

### Database Setup

1. **Seed super admin** (optional)
   ```bash
   pnpm seed:admin
   ```

2. **Run migrations** (if needed)
   ```bash
   pnpm migrate:moderation
   ```

## 📚 Documentation

### API Documentation
- **Swagger UI**: Available at `/api-docs` (auto-generated from code comments)
- **Local**: `http://localhost:3000/api-docs`
- **Production**: `https://prompt-pal.onrender.com/api-docs`

### Additional Documentation
- `ARCHITECTURE.md` - System architecture and design decisions
- `REQUEST_LIFECYCLE.md` - Request flow documentation
- `GOOGLE_OAUTH_FLOW.md` - Google OAuth implementation details
- `PROMPT_OPTIMIZER_GUIDE.md` - Prompt optimizer module guide
- `GEMINI_API_KEY_SETUP.md` - Gemini API configuration guide

## 🧪 Scripts

```bash
pnpm dev              # Start development server (watch mode)
pnpm build            # Build TypeScript to JavaScript
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm seed:admin       # Seed super admin user
pnpm migrate:moderation  # Run moderation fields migration
```

## 🔒 Security Best Practices

- **JWT Tokens**: Stored in httpOnly cookies (prevents XSS attacks)
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Zod schemas validate all user inputs
- **SQL Injection Prevention**: Mongoose ODM with parameterized queries
- **XSS Protection**: DOMPurify for content sanitization
- **CORS Configuration**: Restricted to allowed origins only
- **Rate Limiting**: Prevents brute-force and DDoS attacks
- **Security Headers**: Helmet.js sets secure HTTP headers
- **Environment Variables**: Sensitive data never committed to git

## 📊 Database Models

- **User**: Authentication, profiles, roles, status
- **Prompt**: User-generated prompts with metadata
- **PromptOptimization**: AI optimization history
- **Blog**: Blog posts with rich content
- **Comment**: Nested comments for prompts and blogs
- **ContentFlag**: User reporting system

## 🌐 Deployment

### Production Environment
- **Platform**: Render.com
- **Database**: MongoDB Atlas
- **CDN**: Cloudinary for image delivery
- **Monitoring**: Built-in logging with Pino

### Environment Configuration
- All sensitive data stored in environment variables
- `config.env` file is gitignored
- Production and development configurations separated

## 🤝 Contributing

See `CONTRIBUTING.md` for contribution guidelines.

## 📝 License

ISC

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Maintained by**: PromptPal Backend Team
