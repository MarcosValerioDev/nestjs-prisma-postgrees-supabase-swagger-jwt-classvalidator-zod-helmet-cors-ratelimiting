# NestJS API

REST API built with NestJS, Prisma ORM and PostgreSQL (Supabase), featuring JWT authentication,
Swagger docs, validation with class-validator and Zod, Helmet, CORS and rate limiting.

## Setup

```bash
npm install
cp .env.example .env   # fill in Supabase connection strings and JWT secret
npx prisma migrate dev # or: npx prisma db push
npm run start:dev
```

Swagger UI: `http://localhost:3000/docs`

## Structure

- `src/config` – environment validation (Zod)
- `src/prisma` – global Prisma module/service
- `src/auth` – register/login, JWT strategy and guard (login body validated with Zod)
- `src/users` – protected CRUD (DTOs validated with class-validator)

## Scripts

`npm run build`, `npm test`, `npm run lint`
