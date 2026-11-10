-- Script do banco da Biblioteca
-- Rode no banco TRABALHO_LPV (o mesmo do .env), por exemplo:
--   psql -U postgres -d TRABALHO_LPV -f database.sql
-- Pode rodar mais de uma vez: as tabelas só são criadas se não existirem
-- e os dados só são inseridos se a tabela estiver vazia.

-- =========================================================
-- TABELAS
-- =========================================================

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

-- =========================================================
-- DADOS DE EXEMPLO
-- =========================================================

INSERT INTO categorias (nome)
SELECT * FROM (VALUES
  ('Romance'),
  ('Ficção científica'),
  ('Tecnologia'),
  ('História'),
  ('Fantasia'),
  ('Biografia')
) AS v(nome)
WHERE NOT EXISTS (SELECT 1 FROM categorias);

INSERT INTO editoras (nome, contato)
SELECT * FROM (VALUES
  ('Companhia das Letras', 'contato@companhiadasletras.com.br'),
  ('Rocco', 'contato@rocco.com.br'),
  ('Novatec', 'contato@novatec.com.br'),
  ('Aleph', 'contato@editoraaleph.com.br'),
  ('Intrínseca', 'contato@intrinseca.com.br')
) AS v(nome, contato)
WHERE NOT EXISTS (SELECT 1 FROM editoras);

INSERT INTO autores (nome, nacionalidade)
SELECT * FROM (VALUES
  ('Machado de Assis', 'Brasileira'),
  ('Clarice Lispector', 'Brasileira'),
  ('George Orwell', 'Britânica'),
  ('Isaac Asimov', 'Norte-americana'),
  ('J. R. R. Tolkien', 'Britânica'),
  ('Yuval Noah Harari', 'Israelense'),
  ('Robert C. Martin', 'Norte-americana')
) AS v(nome, nacionalidade)
WHERE NOT EXISTS (SELECT 1 FROM autores);

-- editora e categoria são buscadas pelo nome, para não depender dos ids gerados
INSERT INTO livros (titulo, ano_publicacao, editora_id, categoria_id)
SELECT v.titulo, v.ano, e.id, c.id
FROM (VALUES
  ('Dom Casmurro', 1899, 'Companhia das Letras', 'Romance'),
  ('A Hora da Estrela', 1977, 'Rocco', 'Romance'),
  ('1984', 1949, 'Companhia das Letras', 'Ficção científica'),
  ('Eu, Robô', 1950, 'Aleph', 'Ficção científica'),
  ('Fundação', 1951, 'Aleph', 'Ficção científica'),
  ('O Hobbit', 1937, 'Intrínseca', 'Fantasia'),
  ('Sapiens: Uma Breve História da Humanidade', 2011, 'Companhia das Letras', 'História'),
  ('Código Limpo', 2008, 'Novatec', 'Tecnologia')
) AS v(titulo, ano, editora, categoria)
JOIN editoras e ON e.nome = v.editora
JOIN categorias c ON c.nome = v.categoria
WHERE NOT EXISTS (SELECT 1 FROM livros);

-- dados fictícios
INSERT INTO usuarios (nome, cpf, email, telefone)
SELECT * FROM (VALUES
  ('Ana Souza', '12345678901', 'ana.souza@email.com', '54991112222'),
  ('Bruno Lima', '23456789012', 'bruno.lima@email.com', '54992223333'),
  ('Carla Mendes', '34567890123', 'carla.mendes@email.com', '54993334444'),
  ('Diego Rocha', '45678901234', 'diego.rocha@email.com', '54994445555'),
  ('Elisa Martins', '56789012345', 'elisa.martins@email.com', '54995556666')
) AS v(nome, cpf, email, telefone)
WHERE NOT EXISTS (SELECT 1 FROM usuarios);

-- usuário buscado pelo CPF e livro pelo título
-- data_devolucao NULL = livro ainda não devolvido
INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo, data_prevista_devolucao, data_devolucao)
SELECT u.id, l.id, v.data_emprestimo::date, v.data_prevista::date, v.data_devolucao::date
FROM (VALUES
  ('12345678901', 'Dom Casmurro', '2026-10-01', '2026-10-15', '2026-10-14'),
  ('23456789012', '1984', '2026-10-05', '2026-10-19', '2026-10-22'),
  ('34567890123', 'O Hobbit', '2026-10-20', '2026-11-03', NULL),
  ('45678901234', 'Código Limpo', '2026-11-01', '2026-11-15', NULL),
  ('56789012345', 'Fundação', '2026-11-05', '2026-11-19', NULL),
  ('12345678901', 'Sapiens: Uma Breve História da Humanidade', '2026-11-08', '2026-11-22', NULL)
) AS v(cpf, titulo, data_emprestimo, data_prevista, data_devolucao)
JOIN usuarios u ON u.cpf = v.cpf
JOIN livros l ON l.titulo = v.titulo
WHERE NOT EXISTS (SELECT 1 FROM emprestimos);
