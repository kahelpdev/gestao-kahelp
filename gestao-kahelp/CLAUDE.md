# GestãoKahelp — Instruções do Projeto

## Visão Geral

Sistema de gestão de times e sprints multi-tenant para a empresa Kahelp.
Permite que múltiplas organizações gerenciem equipes, sprints e tarefas com controle de acesso por papel (Role).

## Stack

| Camada     | Tecnologia                          |
|------------|-------------------------------------|
| Backend    | NestJS (Node.js + TypeScript)        |
| ORM        | Prisma 7                            |
| Banco      | PostgreSQL (147.93.9.236:5432)       |
| Auth       | JWT + Passport                      |
| Validação  | class-validator + class-transformer  |
| Gerenciador| pnpm                                |

## Estrutura de Diretórios

```
gestao-kahelp/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Schema do banco de dados
│   │   ├── prisma.config.ts    # Configuração do Prisma 7
│   │   └── migrations/         # Histórico de migrations
│   ├── src/
│   │   ├── prisma/
│   │   │   ├── prisma.service.ts   # PrismaClient como serviço NestJS
│   │   │   └── prisma.module.ts    # Módulo global do Prisma
│   │   ├── auth/               # Autenticação JWT
│   │   ├── users/              # CRUD de usuários
│   │   ├── organizations/      # Gestão de organizações (tenants)
│   │   ├── teams/              # Gestão de times
│   │   ├── sprints/            # Gestão de sprints
│   │   ├── tasks/              # Gestão de tarefas
│   │   ├── notifications/      # Notificações
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env                    # Variáveis de ambiente (não versionar)
│   └── package.json
└── CLAUDE.md
```

## Variáveis de Ambiente (backend/.env)

```env
DATABASE_URL="postgresql://kahelp_user:GestaoKahelp@2026!@147.93.9.236:5432/gestaokahelp"
JWT_SECRET="GestaoKahelp_JWT_2026_SecretKey!"
JWT_EXPIRES_IN="7d"
PORT=3001
```

## Schema do Banco (Multi-tenant)

Todos os models possuem `organizationId` para isolamento de dados por tenant.

### Enums
- `Role`: `OWNER | ADMIN | VIEWER`
- `SprintStatus`: `PLANNING | ACTIVE | COMPLETED | CANCELLED`
- `TaskStatus`: `TODO | IN_PROGRESS | REVIEW | DONE`

### Models
| Model         | Descrição                                      |
|---------------|------------------------------------------------|
| Organization  | Tenant raiz do sistema                         |
| User          | Usuário vinculado a uma organização com Role   |
| Team          | Time dentro de uma organização                 |
| TeamMember    | Relação N:N entre User e Team (com role)       |
| Sprint        | Sprint de um time com status e datas           |
| SprintTask    | Tarefa dentro de uma sprint com assignee       |
| Notification  | Notificação por usuário dentro da organização  |

## Comandos Úteis

```bash
# Instalar dependências
cd backend && pnpm install

# Rodar em desenvolvimento
cd backend && pnpm run start:dev

# Criar nova migration
cd backend && npx prisma migrate dev --name <nome>

# Regenerar Prisma Client
cd backend && npx prisma generate

# Abrir Prisma Studio
cd backend && npx prisma studio

# Build para produção
cd backend && pnpm run build
cd backend && pnpm run start:prod
```

## Convenções de Código

- Todos os módulos NestJS seguem o padrão: `module`, `controller`, `service`, `dto/`
- DTOs usam `class-validator` para validação
- Serviços recebem `PrismaService` via injeção de dependência (disponível globalmente via `PrismaModule`)
- Prefixo global da API: `/api`
- Porta padrão: `3001`
- Guards de autenticação: `JwtAuthGuard` para rotas protegidas
- Guards de autorização: verificar `role` do usuário dentro do contexto da organização

## Padrão de Módulo

Ao criar um novo módulo, seguir a estrutura:

```
src/<modulo>/
├── dto/
│   ├── create-<modulo>.dto.ts
│   └── update-<modulo>.dto.ts
├── <modulo>.controller.ts
├── <modulo>.module.ts
└── <modulo>.service.ts
```

## Autenticação

- Login retorna `access_token` JWT
- Token contém: `sub` (userId), `email`, `role`, `organizationId`
- Rotas públicas: `POST /api/auth/login`, `POST /api/auth/register`
- Todas as demais rotas requerem `Authorization: Bearer <token>`

## Multi-tenant

- Toda query ao banco deve filtrar por `organizationId`
- O `organizationId` é extraído do JWT token, nunca do body da requisição
- OWNER pode gerenciar tudo na organização
- ADMIN pode gerenciar times, sprints e tarefas
- VIEWER tem acesso somente leitura
