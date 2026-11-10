const db = require('../configs');

const listar = async () => {
  const sql = 'SELECT * FROM editoras ORDER BY nome';
  return db.query(sql).then(response => response.rows);
};

const buscarPorId = async (id) => {
  const sql = 'SELECT * FROM editoras WHERE id = $1';
  return db.query(sql, [id]).then(response => response.rows[0]);
};

const criar = async ({ nome, contato }) => {
  const sql = 'INSERT INTO editoras (nome, contato) VALUES ($1, $2) RETURNING *';
  return db.query(sql, [nome, contato]).then(response => response.rows[0]);
};

const atualizar = async (id, { nome, contato }) => {
  const sql = 'UPDATE editoras SET nome = $1, contato = $2 WHERE id = $3 RETURNING *';
  return db.query(sql, [nome, contato, id]).then(response => response.rows[0]);
};

const excluir = async (id) => {
  const sql = 'DELETE FROM editoras WHERE id = $1 RETURNING *';
  return db.query(sql, [id]).then(response => response.rows[0]);
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
