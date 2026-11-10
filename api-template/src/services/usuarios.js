const db = require('../configs');

const listar = async () => {
  const sql = 'SELECT * FROM usuarios ORDER BY nome';
  return db.query(sql).then(response => response.rows);
};

const buscarPorId = async (id) => {
  const sql = 'SELECT * FROM usuarios WHERE id = $1';
  return db.query(sql, [id]).then(response => response.rows[0]);
};

const criar = async ({ nome, cpf, email, telefone }) => {
  const sql = `INSERT INTO usuarios (nome, cpf, email, telefone)
               VALUES ($1, $2, $3, $4) RETURNING *`;
  return db.query(sql, [nome, cpf, email, telefone]).then(response => response.rows[0]);
};

const atualizar = async (id, { nome, cpf, email, telefone }) => {
  const sql = `UPDATE usuarios SET nome = $1, cpf = $2, email = $3, telefone = $4
               WHERE id = $5 RETURNING *`;
  return db.query(sql, [nome, cpf, email, telefone, id]).then(response => response.rows[0]);
};

const excluir = async (id) => {
  const sql = 'DELETE FROM usuarios WHERE id = $1 RETURNING *';
  return db.query(sql, [id]).then(response => response.rows[0]);
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
