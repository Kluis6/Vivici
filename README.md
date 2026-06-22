# Vivici

Base do projeto imobiliário `Vivici`, construída com:

- Next.js 16
- React 19
- shadcn/ui
- Prisma 7
- Supabase
- Zod
- Motion
- Vercel

## Setup

1. Instale as dependências:

```bash
npm install
```

2. Crie seu arquivo local de ambiente:

```bash
cp .env.example .env
```

3. Preencha as variáveis do Supabase e do Postgres.

4. Gere o client do Prisma:

```bash
npm run db:generate
```

5. Inicie o projeto:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

## Estrutura Inicial

- `app/`: App Router do Next.js
- `components/`: componentes de interface
- `lib/`: env, Prisma e clientes Supabase
- `prisma/`: schema e migrations
- `generated/`: Prisma Client gerado localmente

## Ambientes

Use `DATABASE_URL` para conexão da aplicação e `DIRECT_URL` para operações diretas do Prisma em bancos Supabase/Postgres.
