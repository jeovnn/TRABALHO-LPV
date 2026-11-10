const db = require('../configs');

// traz o nome do usuário e o título do livro junto com o empréstimo
const SELECT_EMPRESTIMOS = `
  SELECT emp.id,
         emp.usuario_id, u.nome AS usuario,
         emp.livro_id, l.titulo AS livro,
         emp.data_emprestimo, emp.data_prevista_devolucao, emp.data_devolucao
  FROM emprestimos emp
  JOIN usuarios u ON u.id = emp.usuario_id
  JOIN livros l ON l.id = emp.livro_id
`;

const listar = async () => {
  const sql = `${SELECT_EMPRESTIMOS} ORDER BY emp.data_emprestimo DESC, emp.id DESC`;
  return db.query(sql).then(response => response.rows);
};

const buscarPorId = async (id) => {
  const sql = `${SELECT_EMPRESTIMOS} WHERE emp.id = $1`;
  return db.query(sql, [id]).then(response => response.rows[0]);
};

const criar = async ({ usuario_id, livro_id, data_emprestimo, data_prevista_devolucao, data_devolucao }) => {
  const sql = `INSERT INTO emprestimos (usuario_id, livro_id, data_emprestimo, data_prevista_devolucao, data_devolucao)
               VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4, $5) RETURNING *`;
  const params = [usuario_id, livro_id, data_emprestimo || null, data_prevista_devolucao, data_devolucao || null];
  return db.query(sql, params).then(response => response.rows[0]);
};

const atualizar = async (id, { usuario_id, livro_id, data_emprestimo, data_prevista_devolucao, data_devolucao }) => {
  const sql = `UPDATE emprestimos
               SET usuario_id = $1, livro_id = $2, data_emprestimo = $3,
                   data_prevista_devolucao = $4, data_devolucao = $5
               WHERE id = $6 RETURNING *`;
  const params = [usuario_id, livro_id, data_emprestimo, data_prevista_devolucao, data_devolucao || null, id];
  return db.query(sql, params).then(response => response.rows[0]);
};

const excluir = async (id) => {
  const sql = 'DELETE FROM emprestimos WHERE id = $1 RETURNING *';
  return db.query(sql, [id]).then(response => response.rows[0]);
};

module.exports = { listar, buscarPorId, criar, atualizar, excluir };
