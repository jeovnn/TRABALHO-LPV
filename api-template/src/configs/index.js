const { Pool, types } = require('pg');

// devolve as colunas DATE como texto 'aaaa-mm-dd' (sem conversão de fuso horário)
types.setTypeParser(1082, (valor) => valor);

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASS,
  port: process.env.POSTGRES_PORT,
});

module.exports = {
  query: (sql, params) => pool.query(sql, params)
};
