# api13

API REST construída com **NestJS 12**, **Prisma ORM 7** e **PostgreSQL**, com cadastro de usuários e autenticação via **JWT**. O projeto segue a arquitetura modular do NestJS (módulos, controllers, services e DTOs) e usa injeção de dependência para desacoplar a estratégia de hash de senha.

## Tecnologias

| Categoria        | Ferramenta                                                    |
| ---------------- | ------------------------------------------------------------- |
| Runtime          | Node.js 24 (ES Modules)                                       |
| Framework        | NestJS 12 (`@nestjs/platform-express`)                        |
| Banco de dados   | PostgreSQL (local ou Supabase)                                |
| ORM              | Prisma 7 com driver adapter `@prisma/adapter-pg`              |
| Autenticação     | `@nestjs/jwt` + `bcrypt`                                      |
| Validação        | `class-validator` / `class-transformer` (`ValidationPipe` global) |
| Configuração     | `@nestjs/config` + `dotenv`                                   |
| Observabilidade  | `@nestjs/observe`                                             |
| Testes           | Vitest + Supertest                                            |
| Qualidade        | Oxlint (type-aware) + Prettier                                |

## Estrutura do projeto

```
api13/
├── prisma/
│   ├── schema.prisma          # Modelos do banco
│   └── migrations/            # Histórico de migrações
├── prisma7.config.ts          # Configuração do Prisma CLI (schema, migrações, datasource)
├── src/
│   ├── main.ts                # Bootstrap da aplicação + ValidationPipe global
│   ├── app/                   # Módulo raiz (ConfigModule, ObserveModule, rota "/")
│   ├── prisma/                # PrismaModule e PrismaService (cliente com adapter pg)
│   ├── generated/prisma/      # Prisma Client gerado (não editar)
│   ├── auth/
│   │   ├── auth.controller.ts # POST /auth
│   │   ├── auth.service.ts    # Valida credenciais e emite o JWT
│   │   ├── authservice/       # AbstractHashService + ConcreteHashService (bcrypt)
│   │   ├── config/            # jwt.config.ts (registerAs "jwt")
│   │   ├── dto/               # SignInDto
│   │   ├── param/             # Decorator @TokenPayloadParam()
│   │   ├── common/            # Constantes de autenticação
│   │   └── guard/             # Guard de token (em desenvolvimento)
│   └── user/
│       ├── user.controller.ts # CRUD /user
│       ├── user.service.ts
│       └── dto/               # CreateUserDto, UpdateUserDto
└── test/                      # Testes e2e
```

## Modelo de dados

```prisma
model User {
  id           String   @id @default(uuid())
  name         String?
  email        String   @unique
  passwordHash String   @unique
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("user")
}
```

## Pré-requisitos

- Node.js 24 ou superior
- npm
- Uma instância PostgreSQL acessível (local, Docker ou Supabase)

## Configuração

### 1. Instalar as dependências

```bash
npm install
```

### 2. Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Conexão com o PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/api13?schema=public"

# Porta HTTP (padrão: 3000)
PORT=3000

# JWT
JWT_SECRET="troque-por-um-segredo-forte"
JWT_TOKEN_AUDIENCE="localhost:3000"
JWT_ISSUER="localhost:3000"
JWT_TTL=3600
```

| Variável             | Descrição                                                   |
| -------------------- | ----------------------------------------------------------- |
| `DATABASE_URL`       | String de conexão do PostgreSQL                             |
| `PORT`               | Porta em que a API escuta                                   |
| `JWT_SECRET`         | Chave usada para assinar os tokens                          |
| `JWT_TOKEN_AUDIENCE` | Público (`aud`) do token                                    |
| `JWT_ISSUER`         | Emissor (`iss`) do token                                    |
| `JWT_TTL`            | Tempo de expiração do token (segundos ou formato `1h`, `7d`) |

> O arquivo `.env` está no `.gitignore` e não deve ser versionado.

### 3. Banco de dados (Prisma)

O arquivo de configuração do Prisma se chama `prisma7.config.ts`, então informe-o com `--config` ao usar o CLI:

```bash
# Aplicar as migrações no banco
npx prisma migrate dev --config prisma7.config.ts

# Gerar o Prisma Client em src/generated/prisma
npx prisma generate --config prisma7.config.ts

# (Opcional) Abrir o Prisma Studio
npx prisma studio --config prisma7.config.ts
```

## Executando

```bash
# desenvolvimento
npm run start

# desenvolvimento com hot reload
npm run start:dev

# depuração
npm run start:debug

# produção
npm run build
npm run start:prod
```

A API ficará disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

## Endpoints

### Aplicação

| Método | Rota | Descrição                    |
| ------ | ---- | ---------------------------- |
| GET    | `/`  | Health check (`Hello World!`) |

### Usuários — `/user`

| Método | Rota        | Descrição                         |
| ------ | ----------- | --------------------------------- |
| POST   | `/user`     | Cria um usuário (senha com bcrypt) |
| GET    | `/user`     | Lista todos os usuários           |
| GET    | `/user/:id` | Busca um usuário pelo ID          |
| PATCH  | `/user/:id` | Atualiza nome e/ou e-mail         |
| DELETE | `/user/:id` | Remove um usuário                 |

**Regras de validação (`CreateUserDto`):**

- `name`: string, obrigatória, de 3 a 10 caracteres
- `email`: e-mail válido, obrigatório
- `password`: string, obrigatória, de 6 a 20 caracteres

O `UpdateUserDto` aceita os mesmos campos de forma opcional, **exceto** `password`.

Exemplo:

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{"name":"Marcos","email":"marcos@email.com","password":"123456"}'
```

### Autenticação — `/auth`

| Método | Rota    | Descrição                               |
| ------ | ------- | --------------------------------------- |
| POST   | `/auth` | Autentica com e-mail e senha e retorna um JWT |

Requisição:

```bash
curl -X POST http://localhost:3000/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"marcos@email.com","password":"123456"}'
```

Resposta:

```json
{
  "id": "4f1c...-uuid",
  "name": "Marcos",
  "email": "marcos@email.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

O payload do token contém `sub` (ID do usuário) e `email`, assinado com `JWT_SECRET` e com `aud`, `iss` e expiração definidos pelas variáveis de ambiente.

**Possíveis erros:**

| Status | Mensagem                 |
| ------ | ------------------------ |
| 400    | Falha de validação do corpo |
| 404    | Usuário não encontrado   |
| 401    | Senha inválida           |

## Hash de senha

A geração e verificação de hash são abstraídas por `AbstractHashService`, com a implementação `ConcreteHashService` baseada em `bcrypt`. O `AuthModule` (global) registra o provider:

```ts
{ provide: AbstractHashService, useClass: ConcreteHashService }
```

Assim, é possível trocar o algoritmo (por exemplo, para Argon2) criando outra implementação, sem alterar os services que o consomem.

## Observabilidade

O `AppModule` registra o `ObserveModule` do `@nestjs/observe` com `serviceId: 'api13'`. Os campos `appKey` e `appSecret` estão com valores de exemplo; para ativar a telemetria, crie uma conta em [observe.nestjs.com](https://observe.nestjs.com) e substitua-os (de preferência lendo de variáveis de ambiente).

## Testes e qualidade de código

```bash
# testes unitários
npm run test

# testes em modo watch
npm run test:watch

# testes e2e
npm run test:e2e

# cobertura
npm run test:cov

# lint (Oxlint com checagem de tipos)
npm run lint

# formatação (Prettier)
npm run format
```

## Status e próximos passos

O projeto está em desenvolvimento. Itens já previstos, mas ainda não implementados:

- [ ] Implementar o guard de token (`src/auth/guard/auth.token.guard.ts`) e proteger as rotas de `/user`
- [ ] Não retornar `passwordHash` nas respostas de `/user`
- [ ] Documentação da API com Swagger
- [ ] Validação de variáveis de ambiente com Zod
- [ ] Segurança HTTP com Helmet, CORS e Rate Limiting
- [ ] Mover as credenciais do Observe para variáveis de ambiente
- [ ] Ampliar a cobertura de testes unitários e e2e

## Licença

Projeto privado — `UNLICENSED`.
