# FuturoSimples — Monorepo v0.1

MVP: simular futuro financeiro (5/10/20 anos) e sugerir intervenções com impacto real.

## Rodando
1) `pnpm i`
2) Subir infra local: `docker compose -f infra/docker-compose.yml up -d`
3) Migrar/Push DB: `pnpm db:push`
4) Dev em paralelo: `pnpm dev`

## Apps
- Web: Next.js em `apps/web`
- API: NestJS em `packages/api`
- Engine: `packages/simulation-engine`
