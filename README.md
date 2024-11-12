<h1 align="center">NodeJs Avançado com Clean Architecture, Nestjs e Typescript</h1>
<p align="center">Aplicando DDD, Testes Automatizados e princípios Solid</p>

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), [Docker](https://www.docker.com/).
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

### 🎲 Baixando projeto pelo git

```bash
# Clone este repositório em algum diretório
$ git clone <https://github.com/raziisz/nestjs-clean-arch.git>

```
### 🎲 Subindio API em .Net Core

```bash
# Acesse a pasta do projeto no terminal/cmd
$ cd nestjs-clean-arch

# Instale as dependências
$ npm install

# Subindo o banco de dados
$ docker-compose build --no-cache
$ docker-compose up -d

#Subira um container do banco de dados Postgres com user = postgres e senha = docker

# Crie respectivamente os arquivos .env .env.development e .env.test configurando de acordo com arquivo .env.example

# Na pasta backend execute o comando no terminal para rodar as migrações e criar banco de dados
$ npx dotenv-cli -e .env.development -- npx prisma migrate dev --schema .\src\shared\infrastructure\database\prisma\schema.prisma

# Execute o comando no terminal para aplicação carregar em modo de desenvolvimento
$ npm run start:dev

# O servidor inciará na porta:3000 - acesse <http://localhost:3000>
```

### 🎲 Rodando o Web

```bash
# na pasta baixada pelo repositorio navegue no terminal/cmd
$ cd web

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm start

# O servidor inciará na porta:3000 - acesse <http://localhost:3000> ou ip da sua máquina na porta 3000 (melhor experiencia)
```

### 🛠 Tecnologias - API

As seguintes ferramentas foram usadas na construção do projeto na camada backend:

- [Node.js](https://nodejs.org/en/)
- [Nestjs](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Jwt](https://jwt.io/)
- [Docker](https://www.docker.com/)
- [Jest](https://jestjs.io/pt-BR/)

### Autor
---

<a href="http://raziisz.github.io/">
 <img style="border-radius: 50%;" src="https://avatars2.githubusercontent.com/u/42245201?s=460&u=ce3bae80de213ad246855873906246051fba4458&v=4" width="100px;" alt=""/>
 <br />
 <sub><b>Luiz Felipe</b></sub></a> <a href="http://raziisz.github.io/" title="Dev">🚀</a>


Feito com ❤️ por Luiz Felipe 👋🏽 Entre em contato!

[![Linkedin Badge](https://img.shields.io/badge/-Felipe-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/felipelibert30/)](https://www.linkedin.com/in/felipelibert30/)
[![Outlook Badge](https://img.shields.io/badge/-raziel_libertino@hotmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:raziel_libertino@hotmail.com)](mailto:raziel_libertino@hotmail.com)

