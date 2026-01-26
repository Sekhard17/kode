# KODE E-commerce Platform

Monorepo para e-commerce de ropa con Next.js, NestJS, Supabase y Flow.

## Stack Tecnológico

- **Frontend**: Next.js 15 (App Router) + TailwindCSS + shadcn/ui
- **Backend**: NestJS + Prisma
- **Database**: Supabase (PostgreSQL)
- **Payments**: Flow
- **Email**: Maileroo
- **Deploy**: Railway

## Estructura

```
kode/
├── kode-frontend/     # Next.js SSR frontend
├── kode-backend/      # NestJS REST API
└── packages/
    └── shared/        # Tipos y schemas compartidos
```

## Requisitos

- Node.js >= 20
- pnpm >= 9

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
# Todos los servicios
pnpm dev

# Solo frontend
pnpm --filter kode-frontend dev

# Solo backend
pnpm --filter kode-backend dev
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Desarrollo (todos los packages) |
| `pnpm build` | Build de producción |
| `pnpm lint` | Linting |
| `pnpm typecheck` | Verificación de tipos |
| `pnpm test` | Tests |
