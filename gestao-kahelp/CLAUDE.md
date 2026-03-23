# GestãoKahelp — Instruções do Projeto

## Visão Geral

Sistema de gestão de times e sprints multi-tenant para a empresa Kahelp.
Permite que múltiplas organizações gerenciem equipes, sprints e tarefas com controle de acesso por papel (Role).
Integração futura com a plataforma Flow (intranet da NewStandard).

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
├── prototype/
│   └── sprint-control.html    # Protótipo HTML de referência
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Schema do banco de dados
│   │   ├── prisma.config.ts    # Configuração do Prisma 7
│   │   └── migrations/         # Histórico de migrations
│   ├── src/
│   │   ├── prisma/
│   │   │   ├── prisma.service.ts   # PrismaClient como serviço NestJS
│   │   │   └── prisma.module.ts    # Módulo global do Prisma
│   │   ├── auth/               # Autenticação JWT (login, register, profile)
│   │   ├── users/              # CRUD de usuários
│   │   ├── organizations/      # Gestão de organizações (tenants)
│   │   ├── teams/              # Gestão de times + membros
│   │   ├── projects/           # Gestão de projetos (Delphi, Automação, etc.)
│   │   ├── sprints/            # Gestão de sprints (CRUD + ativar/arquivar)
│   │   ├── tasks/              # Gestão de tarefas (CRUD + backlog/sprint)
│   │   ├── dashboard/          # Monitor de execução + alertas de desvio
│   │   ├── history/            # Relatórios de alocação por colaborador
│   │   ├── flow-sync/          # Integração com API do Flow (placeholder)
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
| Project       | Projeto (ex: Delphi 3.0, Automação)            |
| Sprint        | Sprint de um time com status e datas           |
| SprintTask    | Tarefa com projeto, sprint (opcional), assignee |
| Notification  | Notificação por usuário dentro da organização  |

## API Endpoints

### Auth (públicas)
- `POST /api/auth/register` — Registrar org + usuário OWNER
- `POST /api/auth/login` — Login com email/senha → JWT
- `GET  /api/auth/profile` — Perfil do usuário autenticado 🔒

### Organizations 🔒
- `GET   /api/organizations/me` — Dados da organização
- `PATCH /api/organizations/me` — Atualizar organização (OWNER)

### Users 🔒
- `POST   /api/users` — Criar usuário (OWNER/ADMIN)
- `GET    /api/users` — Listar usuários da org
- `GET    /api/users/:id` — Detalhes do usuário
- `PATCH  /api/users/:id` — Atualizar usuário (OWNER/ADMIN)
- `DELETE /api/users/:id` — Remover usuário (OWNER)

### Teams 🔒
- `POST   /api/teams` — Criar time (OWNER/ADMIN)
- `GET    /api/teams` — Listar times
- `GET    /api/teams/:id` — Detalhes com membros
- `PATCH  /api/teams/:id` — Atualizar time (OWNER/ADMIN)
- `POST   /api/teams/:id/members` — Adicionar membro (OWNER/ADMIN)
- `DELETE /api/teams/:id/members/:userId` — Remover membro (OWNER/ADMIN)
- `DELETE /api/teams/:id` — Remover time (OWNER)

### Projects 🔒
- `POST   /api/projects` — Criar projeto (OWNER/ADMIN)
- `GET    /api/projects` — Listar projetos
- `GET    /api/projects/:id` — Detalhes do projeto
- `PATCH  /api/projects/:id` — Atualizar projeto (OWNER/ADMIN)
- `DELETE /api/projects/:id` — Remover projeto (OWNER)

### Sprints 🔒
- `POST   /api/sprints` — Criar sprint (OWNER/ADMIN)
- `GET    /api/sprints?teamId=` — Listar sprints (filtro por time)
- `GET    /api/sprints/:id` — Detalhes com tarefas
- `PATCH  /api/sprints/:id` — Atualizar sprint (OWNER/ADMIN)
- `POST   /api/sprints/:id/activate` — Ativar sprint (OWNER/ADMIN)
- `POST   /api/sprints/:id/archive` — Arquivar sprint (OWNER/ADMIN)
- `DELETE /api/sprints/:id` — Remover sprint (OWNER)

### Tasks 🔒
- `POST   /api/tasks` — Criar tarefa (OWNER/ADMIN)
- `GET    /api/tasks?sprintId=&projectId=&assignedToId=&status=&backlog=true` — Listar com filtros
- `GET    /api/tasks/:id` — Detalhes da tarefa
- `PATCH  /api/tasks/:id` — Atualizar tarefa (OWNER/ADMIN)
- `POST   /api/tasks/:id/assign-sprint/:sprintId` — Mover para sprint (OWNER/ADMIN)
- `POST   /api/tasks/:id/remove-sprint` — Mover para backlog (OWNER/ADMIN)
- `DELETE /api/tasks/:id` — Remover tarefa (OWNER)

### Dashboard 🔒
- `GET /api/dashboard/monitor?projectId=&assignedToId=` — Monitor de execução + desvios
- `GET /api/dashboard/sprint-summary` — Resumo das últimas sprints

### History 🔒
- `GET /api/history/allocation?sprintId=&projectId=` — Relatório por colaborador
- `GET /api/history/sprints` — Histórico de sprints

### Flow Sync 🔒
- `POST /api/flow-sync/import` — Importar do Flow (OWNER/ADMIN)
- `GET  /api/flow-sync/status` — Status de sincronização

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
- Guards de autorização: `RolesGuard` + decorator `@Roles()` para verificar papel do usuário

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
- ADMIN pode gerenciar times, sprints, projetos e tarefas
- VIEWER tem acesso somente leitura

## Mapeamento Protótipo → API

| Tela do Protótipo          | Endpoint da API                           |
|---------------------------|------------------------------------------|
| Monitor de Execução       | `GET /api/dashboard/monitor`             |
| Montar Sprint (Planning)  | `GET /api/tasks?backlog=true` + `POST /api/tasks/:id/assign-sprint/:sprintId` |
| Configurar Calendário     | `GET/POST/PATCH /api/sprints` + `POST /api/sprints/:id/activate` |
| Histórico                 | `GET /api/history/allocation`            |
| Importar do Flow          | `POST /api/flow-sync/import`             |
