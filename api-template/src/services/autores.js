const db = require('../configs');

const listar = async () => {
  const sql = 'SELECT * FROM autores ORDER BY nome';
  return db.query(sql).then(response => response.rows);
};

const buscarPorId = async (id) => {
  const sql = 'SELECT * FROM autores WHERE id = $1';
  return db.query(sql, [id]).then(response => response.rows[0]);
};

const criar = async ({ nome, nacionalidade }) => {
  const sql = 'INSERT INTO autores (nome, nacionalidade) VALUES ($1, $2) RETURNING *';
  return db.query(sql, [nome, nacionalidade]).then(response => response.rows[0]);
};

const atualizar = async (id, { nome, nacionalidade }) => {
  const sql = 'UPDATE autores SET nome = $1, nacionalidade = $2 WHERE id = $3 RETURNING *';
  return db.query(sql, [nome, nacionalidade, id]).then(response => response.rows[0]);
};

const excluir = async (id) => {
  const sql = 'DELETE FROM autores WHERE id = $1 RETURNING *';
  return db.query(sql, [id]).then(response => response.rows[0]);
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
