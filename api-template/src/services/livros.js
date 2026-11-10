const db = require('../configs');

// traz o nome da editora e da categoria junto com o livro
const SELECT_LIVROS = `
  SELECT l.id, l.titulo, l.ano_publicacao,
         l.editora_id, e.nome AS editora,
         l.categoria_id, c.nome AS categoria
  FROM livros l
  LEFT JOIN editoras e ON e.id = l.editora_id
  LEFT JOIN categorias c ON c.id = l.categoria_id
`;

const listar = async () => {
  const sql = `${SELECT_LIVROS} ORDER BY l.titulo`;
  return db.query(sql).then(response => response.rows);
};

const buscarPorId = async (id) => {
  const sql = `${SELECT_LIVROS} WHERE l.id = $1`;
  return db.query(sql, [id]).then(response => response.rows[0]);
};

const criar = async ({ titulo, ano_publicacao, editora_id, categoria_id }) => {
  const sql = `INSERT INTO livros (titulo, ano_publicacao, editora_id, categoria_id)
               VALUES ($1, $2, $3, $4) RETURNING *`;
  return db.query(sql, [titulo, ano_publicacao, editora_id, categoria_id]).then(response => response.rows[0]);
};

const atualizar = async (id, { titulo, ano_publicacao, editora_id, categoria_id }) => {
  const sql = `UPDATE livros SET titulo = $1, ano_publicacao = $2, editora_id = $3, categoria_id = $4
               WHERE id = $5 RETURNING *`;
  return db.query(sql, [titulo, ano_publicacao, editora_id, categoria_id, id]).then(response => response.rows[0]);
};

const excluir = async (id) => {
  const sql = 'DELETE FROM livros WHERE id = $1 RETURNING *';
  return db.query(sql, [id]).then(response => response.rows[0]);
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
