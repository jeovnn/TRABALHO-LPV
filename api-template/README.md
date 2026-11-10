## API da Biblioteca

API em Node + Express + PostgreSQL
### Como rodar

1. `npm install`
2. Copie o `.env.example` para `.env` e coloque a senha do seu Postgres
3. Crie o banco `TRABALHO_LPV` e rode o script das tabelas:
   `psql -U postgres -d TRABALHO_LPV -f database.sql`
4. `npm run dev` (a API sobe na porta 3000)
5. Opcional: com a API rodando, `npm run teste` testa todas as rotas usando axios

### Organização

- `src/routers` – define as rotas (URL + método)
- `src/controllers` – recebe a requisição e devolve a resposta (`crud.js` é o controller genérico)
- `src/services` – as consultas SQL de cada tabela

### Rotas

Cada recurso tem as mesmas 5 rotas:

| Método | Rota | O que faz |
|---|---|---|
| GET | `/livros` | lista todos |
| GET | `/livros/:id` | busca um |
| POST | `/livros` | cadastra |
| PUT | `/livros/:id` | atualiza |
| DELETE | `/livros/:id` | exclui |

Recursos: `/livros`, `/autores`, `/categorias`, `/editoras`, `/usuarios`, `/emprestimos`.

Campos enviados no body:

- **categorias**: `nome`
- **editoras**: `nome`, `contato`
- **autores**: `nome`, `nacionalidade`
- **usuarios**: `nome`, `cpf`, `email`, `telefone`
- **livros**: `titulo`, `ano_publicacao`, `editora_id`, `categoria_id`
- **emprestimos**: `usuario_id`, `livro_id`, `data_emprestimo`, `data_prevista_devolucao`, `data_devolucao`
  (para registrar a devolução, faça um PUT preenchendo `data_devolucao`)

Todas as respostas seguem o formato `{ status, message?, data }`.
