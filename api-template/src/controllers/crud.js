// Controller genérico: as 6 tabelas fazem as mesmas 5 operações
// (listar, buscar, cadastrar, atualizar e excluir), só muda o service.
//   service     -> arquivo da pasta services com as consultas SQL
//   obrigatorios -> campos que precisam vir no body para cadastrar/atualizar

// traduz os erros mais comuns do Postgres para uma mensagem amigável
const tratarErro = (res, error) => {
  if (error.code === '23503') {
    return res.status(400).json({
      status: 'error',
      message: 'Registro vinculado a outro cadastro (verifique os códigos informados ou se ele está em uso)'
    });
  }
  if (error.code === '23505') {
    return res.status(400).json({ status: 'error', message: 'Já existe um cadastro com esses dados' });
  }
  return res.status(500).json({ status: 'error', message: 'Erro no servidor', error: error.message });
};

module.exports = (service, obrigatorios = []) => {
  const faltando = (body) => obrigatorios.filter(campo => body[campo] === undefined || body[campo] === null || body[campo] === '');

  const listar = async (req, res) => {
    try {
      const data = await service.listar();
      return res.status(200).json({ status: 'ok', data });
    } catch (error) {
      return tratarErro(res, error);
    }
  };

  const buscarPorId = async (req, res) => {
    try {
      const data = await service.buscarPorId(req.params.id);
      if (!data) return res.status(404).json({ status: 'error', message: 'Registro não encontrado' });
      return res.status(200).json({ status: 'ok', data });
    } catch (error) {
      return tratarErro(res, error);
    }
  };

  const criar = async (req, res) => {
    try {
      const campos = faltando(req.body);
      if (campos.length) {
        return res.status(400).json({ status: 'error', message: `Campos obrigatórios: ${campos.join(', ')}` });
      }
      const data = await service.criar(req.body);
      return res.status(201).json({ status: 'ok', message: 'Cadastro realizado', data });
    } catch (error) {
      return tratarErro(res, error);
    }
  };

  const atualizar = async (req, res) => {
    try {
      const campos = faltando(req.body);
      if (campos.length) {
        return res.status(400).json({ status: 'error', message: `Campos obrigatórios: ${campos.join(', ')}` });
      }
      const data = await service.atualizar(req.params.id, req.body);
      if (!data) return res.status(404).json({ status: 'error', message: 'Registro não encontrado' });
      return res.status(200).json({ status: 'ok', message: 'Cadastro atualizado', data });
    } catch (error) {
      return tratarErro(res, error);
    }
  };

  const excluir = async (req, res) => {
    try {
      const data = await service.excluir(req.params.id);
      if (!data) return res.status(404).json({ status: 'error', message: 'Registro não encontrado' });
      return res.status(200).json({ status: 'ok', message: 'Cadastro excluído', data });
    } catch (error) {
      return tratarErro(res, error);
    }
  };

  return { listar, buscarPorId, criar, atualizar, excluir };
};
