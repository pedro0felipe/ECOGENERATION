const { adminModel } = require("../../models/adminModel");

exports.listar = async (req, res) => {
  try {
    const produtos = await adminModel.getAllProdutos();
    res.render('admin-produtos', { titulo: 'Gerenciar Produtos', produtos });
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin');
  }
};

exports.novoForm = (req, res) => {
  res.render('admin-produto-editar', {
    titulo: 'Novo Produto',
    produto: null,
    isNovo: true
  });
};

exports.criar = async (req, res) => {
  try {
    const { nome, categoria, preco, descricao, estoque } = req.body;
    const imagem = req.file ? req.file.filename : null;
    await adminModel.addProduto({ nome, categoria, preco: parseFloat(preco), descricao, estoque: parseInt(estoque), imagem });
    req.session.flash = { status: 'success', text: `Produto "${nome}" criado com sucesso!` };
    res.redirect('/admin/produtos');
  } catch (erro) {
    console.log(erro);
    req.session.flash = { status: 'error', text: 'Erro ao criar produto. Tente novamente.' };
    res.redirect('/admin/produtos');
  }
};

exports.editarForm = async (req, res) => {
  try {
    const produto = await adminModel.getProduto(req.params.id);
    if (!produto) return res.redirect('/admin/produtos');
    res.render('admin-produto-editar', { titulo: 'Editar Produto', produto, isNovo: false });
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin/produtos');
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { nome, categoria, preco, descricao, estoque } = req.body;
    const imagem = req.file ? req.file.filename : null;
    await adminModel.updateProduto(req.params.id, { nome, categoria, preco: parseFloat(preco), descricao, estoque: parseInt(estoque), imagem });
    req.session.flash = { status: 'success', text: `Produto "${nome}" atualizado com sucesso!` };
    res.redirect('/admin/produtos');
  } catch (erro) {
    console.log(erro);
    req.session.flash = { status: 'error', text: 'Erro ao atualizar produto. Tente novamente.' };
    res.redirect('/admin/produtos');
  }
};

exports.deletar = async (req, res) => {
  try {
    await adminModel.deleteProduto(req.params.id);
    req.session.flash = { status: 'success', text: 'Produto removido com sucesso.' };
    res.redirect('/admin/produtos');
  } catch (erro) {
    console.log(erro);
    req.session.flash = { status: 'error', text: 'Erro ao remover produto. Tente novamente.' };
    res.redirect('/admin/produtos');
  }
};
