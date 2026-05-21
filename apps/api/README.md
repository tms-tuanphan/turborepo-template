# With-NestJs | API

## Local development (PostgreSQL in Docker)

```bash
# From repository root
cp .env.example .env
docker compose up -d
cp apps/api/.env.example apps/api/.env

pnpm --filter @repo/database db:generate
pnpm --filter @repo/database db:migrate
pnpm --filter @repo/database db:seed   # optional

pnpm run dev
```

- **Env:** root `.env` = Docker only · `apps/api/.env` = API + `DATABASE_URL` (see `.env.example` in each folder).
- Prisma schema and migrations live in `packages/database`.
- Stop DB: `docker compose down` · Reset data: `docker compose down -v`

## Getting Started

First, run the development server:

```bash
pnpm run dev
# Also works with NPM, YARN, BUN, ...
```

By default, your server will run at [localhost:3000](http://localhost:3000). You can use your favorite API platform like [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/) to test your APIs

### Important Note 🚧

If you plan to `build` or `test` the app. Please make sure to build the `packages/*` first.

## Learn More

Learn more about `NestJs` with following resources:

- [Official Documentation](https://docs.nestjs.com) - A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [Official NestJS Courses](https://courses.nestjs.com) - Learn everything you need to master NestJS and tackle modern backend applications at any scale.
- [GitHub Repo](https://github.com/nestjs/nest)
