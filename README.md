# 🗺️ NortheasTour — Planejamento de Roteiros Turísticos Regionais

O **NortheasTour** é uma aplicação Web full-stack completa voltada para o planejamento, 
compartilhamento e descoberta de roteiros turísticos no Nordeste. 

Projeto prático final desenvolvido para a disciplina de **Desenvolvimento Web Back-end** no curso de Tecnologia em Sistemas para Internet do IFRN Campus Currais Novos.

## 👥 Integrantes e Responsabilidades
* **Manoel Serafim** - [Responsabilidade]
* **João Emanuel** - [Responsabilidade]
* **Cauã Macêdo** - [Responsabilidade]
* **Romulo Cesar** - [Responsabilidade]

## 🚀 Tecnologias Utilizadas
* **Back-end:** NestJS (TypeScript) & Prisma ORM
* **Front-end:** Vue.js (Vite, Vue Router, Pinia)
* **Banco de Dados:** PostgreSQL (Ambiente Local via Docker / Produção no Neon DB)
* **Infraestrutura:** Docker & Docker Compose

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js instalado (v18 ou superior)
* Docker e Docker Compose instalados

### Passo a Passo
1. Clone o repositório para sua máquina.
2. Na raiz do projeto, duplique o arquivo `.env.example` e renomeie para `.env`.
3. Instale as dependências de todo o ecossistema rodando:
   ```bash
   npm install
   docker compose up -d
   npm run start:backend
   npm run start:frontend