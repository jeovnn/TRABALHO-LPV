-- Script do banco da Biblioteca
-- Rode no banco TRABALHO_LPV (o mesmo do .env), por exemplo:
--   psql -U postgres -d TRABALHO_LPV -f database.sql

CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS editoras (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  contato VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS autores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  nacionalidade VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS livros (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  ano_publicacao INTEGER,
  editora_id INTEGER REFERENCES editoras(id),
  categoria_id INTEGER REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  email VARCHAR(100),
  telefone VARCHAR(11)
);

CREATE TABLE IF NOT EXISTS emprestimos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  livro_id INTEGER NOT NULL REFERENCES livros(id),
  data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
  data_prevista_devolucao DATE NOT NULL,
  data_devolucao DATE
);

-- Alguns dados para começar (só insere se a tabela estiver vazia)
INSERT INTO categorias (nome)
SELECT * FROM (VALUES ('Romance'), ('Ficção científica'), ('Tecnologia'), ('História')) AS v(nome)
WHERE NOT EXISTS (SELECT 1 FROM categorias);

INSERT INTO editoras (nome, contato)
SELECT * FROM (VALUES ('Companhia das Letras', 'contato@companhiadasletras.com.br'),
                      ('Rocco', 'contato@rocco.com.br'),
                      ('Novatec', 'contato@novatec.com.br')) AS v(nome, contato)
WHERE NOT EXISTS (SELECT 1 FROM editoras);
