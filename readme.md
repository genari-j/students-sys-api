# Students Sys:

O Students Sys é um Sistema Web projetado que visa o meio educacional. A Aplicação permite a Gestão de Colaboradores, Professores, Alunos e Salas de aula. A ideia é que os Colaboradores efetuem o cadastro de Alunos e Salas, facilitando a distribuição entre às turmas.

# Techs/Libs/Frameworks:

- Node.js;
- Typescript;
- Express;
- ESLint;
- cors;
- dotenv;
- mysql;
- mysql-migrations;
- nodemon;
- bcrypt;
- joi;
- jsonwebtoken;

# Estrutura:

A Estrutura está divida seguindo o padrão de arquitetura MVC - `routes`, `controllers` e `repositories`;

- `adapters` -> Atende a conexão com o Database;
- `controllers` -> Armazena entre pastas os controllers;
- `helpers` -> Funções genéricas, que possuem responsabilidades distintas das demais;
- `middlewares` -> Middlewares específicos para bloqueio de ações;
- `repositories` -> Querys específicas criadas para serem executados de acordo com a necessidade de cada controller;
- `routes` -> Pastas separadas com cada grupo de rotas;
- `validators` -> Pastas criadas para atender a validação do envio de formulários/campos de texto;

# Como executar/rodar a aplicação:

## Pré-requisitos:

- Node.js instalado na máquina;
- Clone o repositório em sua máquina;
- Abra o projeto em um Editor de Código;
- O arquivo `.env-example`, mostra quais variáveis de ambiente devem ser preenchidas;
- Crie um arquivo `.env` na raiz da aplicação;
- Crie um Banco de dados para inserção no `.env` (siga o .env-example);
- Instale as dependências do projeto utilizando o comando `npm install` ou `npm i`;
- Verifique no arquivo Package.json os Scripts para rodar a aplicação `npm run dev` ou `npm start`;
- Acesse a API em sua máquina através do endereço `http://localhost:APP_PORT` - Insira o número da porta `APP_PORT` inserida no `.env`;

# Endpoints disponíveis:

### Login:

| Endpoint              | HTTP Method           | Description           |
| --------------------- | --------------------- | --------------------- |
| /signin               | POST                  | Get all people        |

### Colaborator (Create):

| Endpoint              | HTTP Method           | Description           |
| --------------------- | --------------------- | --------------------- |
| /signup               | POST                  | Create colaborator    |

### Colaborator (Ready - Update - Delete)

| Endpoint              | HTTP Method           | Description           |
| --------------------- | --------------------- | --------------------- |
| /colaborators         | GET                   | Get all colaborators  |
| /colaborators/:id     | GET                   | Get colaborator by id |
| /colaborators/:id     | PUT                   | Update colaborator    |
| /colaborators/:id     | DELETE                | Disable colaborator   |

### Get all departments:

| Endpoint              | HTTP Method           | Description           |
| --------------------- | --------------------- | --------------------- |
| /departments          | GET                   | Get all departments   |