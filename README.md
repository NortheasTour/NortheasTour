# 🗺️ NortheasTour — Planejamento de Roteiros Turísticos Regionais

O **NortheasTour** é uma aplicação web full-stack para planejamento, compartilhamento e descoberta de roteiros turísticos no Nordeste.

Projeto prático final desenvolvido para a disciplina de **Desenvolvimento Web Back-end** no curso de Tecnologia em Sistemas para Internet do IFRN Campus Currais Novos.

## 👥 Integrantes e Responsabilidades

- **Manoel Serafim** - (Dev Core & Regras de Negócio): Responsável pelo domínio principal (Pontos Turísticos e Roteiros) e aplicação dos fluxos de estado.
- **João Emanuel** - (Dev Segurança & Auth): Responsável por Autenticação, Proteção de Rotas, Guards, JWT e Perfil de Acesso.
- **Cauã Macêdo** - (Dev Integrações & Recursos Extras): Responsável por Upload de Arquivos, Cache, Observabilidade e Integração com API Externa.
- **Romulo Cesar** - (Dev Infra & Dados): Responsável pelo Setup, Docker, Banco de Dados (Prisma/PostgreSQL) e Estrutura Inicial.

## 🚀 Tecnologias Utilizadas

- **Back-end:** NestJS, Prisma ORM
- **Front-end:** Vue 3, Vite, Vue Router, Pinia
- **Banco de Dados:** PostgreSQL
- **Infraestrutura:** Docker e Docker Compose

## 📦 Pré-requisitos

Antes de começar, tenha instalado:

- Node.js 18 ou superior
- Docker e Docker Desktop
- Docker Compose

## ⚙️ Variáveis de ambiente

O projeto usa arquivos de exemplo para facilitar a configuração:

- `.env.example` na raiz do monorepo
- `apps/backend/.env` para execução local do backend

Os valores padrão já estão prontos para desenvolvimento local com o banco no Docker.

## 🐳 Opção 1: rodar tudo com Docker

Use esta opção se quiser subir banco, backend e frontend em containers.

### Passo a passo

1. Copie o arquivo de exemplo de ambiente, se ainda não existir um `.env` na raiz:

   ```bash
   copy .env.example .env
   ```

2. Suba a stack completa:

   ```bash
   npm run docker:up
   ```

3. Acesse os serviços:

   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000
   - Banco PostgreSQL: localhost:5433

4. Para parar e remover os volumes do ambiente:

   ```bash
   npm run docker:down
   ```

### O que acontece nessa opção

- O PostgreSQL sobe primeiro.
- O backend espera o banco ficar saudável.
- O backend executa `prisma generate` e `prisma db push` automaticamente.
- O frontend sobe em modo de desenvolvimento com hot reload.

## 🖥️ Opção 2: banco no Docker e resto local

Use esta opção se quiser manter apenas o banco em container e executar backend e frontend na sua máquina.

### Passo a passo

1. Suba somente o banco:

   ```bash
   docker compose up -d postgres
   ```

2. Verifique se o banco está ativo:

   ```bash
   docker compose ps
   ```

3. Confirme se o backend local está apontando para o banco do Docker.

   O arquivo `apps/backend/.env` deve usar:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/northeasTour?schema=public"
   ```

4. Instale as dependências do monorepo, se ainda não tiver feito isso:

   ```bash
   npm install
   ```

5. Inicie o backend em modo desenvolvimento:

   ```bash
   npm run start:backend
   ```

6. Em outro terminal, inicie o frontend:

   ```bash
   npm run start:frontend
   ```

7. Acesse os serviços:

   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 🔧 Comandos úteis

- `npm run docker:up` - sobe toda a stack com build
- `npm run docker:down` - para a stack e remove volumes
- `npm run start:backend` - backend local em modo watch
- `npm run start:frontend` - frontend local com Vite
- `docker compose up -d postgres` - sobe apenas o banco

## 🧠 Boas práticas adotadas

- O backend usa `DATABASE_URL` separado para desenvolvimento local.
- O frontend roda com hot reload e host exposto para acesso fora do container.
- O Prisma é sincronizado automaticamente no ambiente Docker de desenvolvimento.

## 📝 Observações

- Se o Docker estiver em execução, mas algum serviço não subir, confira as portas `3000`, `5173` e `5433`.
- Para produção, o ideal é substituir `prisma db push` por migrations versionadas.
- Se mudar a URL do banco local, lembre-se de atualizar o `apps/backend/.env`.