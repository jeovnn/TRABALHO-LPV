// Testa todas as rotas da API usando axios (igual ao que o front faz).
// Com a API rodando (npm run dev), em outro terminal: npm run teste
const axios = require('axios');

const api = axios.create({ baseURL: 'http://localhost:3000' });

const mostrar = (titulo, dados) => console.log(`\n== ${titulo}\n`, JSON.stringify(dados, null, 2));

async function testar() {
  // cadastros simples
  const categoria = (await api.post('/categorias', { nome: 'Fantasia' })).data.data;
  const editora = (await api.post('/editoras', { nome: 'Editora Teste', contato: '(49) 99999-0000' })).data.data;
  const autor = (await api.post('/autores', { nome: 'Machado de Assis', nacionalidade: 'Brasileira' })).data.data;
  const usuario = (await api.post('/usuarios', {
    nome: 'Maria Silva',
    cpf: String(Date.now()).slice(-11),
    email: 'maria@email.com',
    telefone: '49999990000'
  })).data.data;
  mostrar('Cadastrados', { categoria, editora, autor, usuario });

  // livro usa editora e categoria
  const livro = (await api.post('/livros', {
    titulo: 'Dom Casmurro',
    ano_publicacao: 1899,
    editora_id: editora.id,
    categoria_id: categoria.id
  })).data.data;
  mostrar('Livro (com nome da editora e categoria)', (await api.get(`/livros/${livro.id}`)).data.data);

  // empréstimo usa usuário e livro
  const emprestimo = (await api.post('/emprestimos', {
    usuario_id: usuario.id,
    livro_id: livro.id,
    data_prevista_devolucao: '2026-12-01'
  })).data.data;

  // devolução = atualizar o empréstimo preenchendo data_devolucao
  await api.put(`/emprestimos/${emprestimo.id}`, { ...emprestimo, data_devolucao: '2026-11-20' });
  mostrar('Empréstimo devolvido', (await api.get(`/emprestimos/${emprestimo.id}`)).data.data);

  // erro esperado: campo obrigatório faltando
  try {
    await api.post('/livros', {});
  } catch (e) {
    mostrar(`Erro esperado (${e.response.status})`, e.response.data);
  }

  // limpa o que foi criado (ordem importa por causa das chaves estrangeiras)
  await api.delete(`/emprestimos/${emprestimo.id}`);
  await api.delete(`/livros/${livro.id}`);
  await api.delete(`/usuarios/${usuario.id}`);
  await api.delete(`/autores/${autor.id}`);
  await api.delete(`/editoras/${editora.id}`);
  await api.delete(`/categorias/${categoria.id}`);
  console.log('\nTudo certo! Todas as rotas responderam.');
}

testar().catch(e => console.error('Falhou:', e.response?.data || e.message));
