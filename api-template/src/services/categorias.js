const db = require('../configs');

const listar = async () => {
  const sql = 'SELECT * FROM categorias ORDER BY nome';
  return db.query(sql).then(response => response.rows);
};

const buscarPorId = async (id) => {
  const sql = 'SELECT * FROM categorias WHERE id = $1';
  return db.query(sql, [id]).then(response => response.rows[0]);
};

const criar = async ({ nome }) => {
  const sql = 'INSERT INTO categorias (nome) VALUES ($1) RETURNING *';
  return db.query(sql, [nome]).then(response => response.rows[0]);
};

const atualizar = async (id, { nome }) => {
  const sql = 'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *';
  return db.query(sql, [nome, id]).then(response => response.rows[0]);
};

const excluir = async (id) => {
  const sql = 'DELETE FROM categorias WHERE id = $1 RETURNING *';
  return db.query(sql, [id]).then(response => response.rows[0]);
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
