# 🍎 Daily Diet

Esta API foi desenvolvida para que o usuário possa gerenciar suas refeições de forma simples e prática.

<p align="center">
  <img src="https://img.shields.io/static/v1?logo=Fastify&logoColor=000000&label=Fastify&message=Fastify&color=000000" alt="Logo Fastify" />
  <img src="https://img.shields.io/static/v1?logo=Node.js&logoColor=339933&label=Node.js&message=Node.js&color=339933" alt="Logo Node.js" />
  <img src="https://img.shields.io/static/v1?logo=SQLite&logoColor=003B57&label=SQLite&message=SQLite&color=003B57" alt="Logo SQLite" />
  <img src="https://img.shields.io/static/v1?logo=PostgreSQL&logoColor=4169E1&label=PostgreSQL&message=PostgreSQL&color=4169E1" alt="Logo PostgreSQL" />
  <img src="https://img.shields.io/static/v1?logo=Vitest&logoColor=6E9F18&label=Vitest&message=Vitest&color=6E9F18" alt="Logo Vitest" />
</p>

---

## 🧭 Como rodar o projeto

Instale as dependências

```bash
npm install
```

Crie e preencha as variáveis de ambiente no arquivo `.env`

```bash
cp .env.example .env
```

Execute as migrations

Em sistemas UNIX

```bash
npm run knex -- migrate:latest
```

No Windows

```bash
npm run knex:migrate:latest
```

Rode o projeto

```bash
npm run dev
```

---

## 🎯 Funcionalidades da aplicação

### RF

- [ ] Deve ser possível criar um usuário
- [ ] Deve ser possível registrar uma refeição feita, com as seguintes informações (_As refeições devem ser relacionadas a um usuário._):
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- [ ] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [ ] Deve ser possível apagar uma refeição
- [ ] Deve ser possível listar todas as refeições de um usuário
- [ ] Deve ser possível visualizar uma única refeição
- [ ] Deve ser possível recuperar as métricas de um usuário - Quantidade total de refeições registradas - Quantidade total de refeições dentro da dieta - Quantidade total de refeições fora da dieta - Melhor sequência por dia de refeições dentro da dieta

### RN

- [ ] Deve ser possível identificar o usuário entre as requisições
- [ ] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou

---

## 🔍 Contexto

É comum ao estar desenvolvendo uma API, imaginar como esses dados vão estar sendo utilizados pelo cliente web e/ou mobile.

Por isso, deixamos abaixo o link para o layout da aplicação que utilizaria essa API.

- [Link Daily Diet Figma](https://www.figma.com/community/file/1218573349379609244/Daily-Diet)

---

## 🧪 Testes

Utilize o comando a seguir para executar os testes unitários

```bash
cp .env.test.example .env.test
```

```bash
npm run test:unit
```
