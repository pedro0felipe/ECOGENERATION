const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/auth');
const { adminModel } = require('../../models/adminModel');

// LOGIN ADMIN 
router.get('/admin-login', (req, res) => {
  res.render('admin-login', { titulo: 'Login Admin', erro: '' });
});

router.post('/admin-login', (req, res) => {
  const { usuario, senha } = req.body;
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'EcoGen@2026';

  if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
    req.session.adminLoggedIn = true;
    req.session.adminUser = usuario;
    res.redirect('/admin');
  } else {
    res.render('admin-login', {
      titulo: 'Login Admin',
      erro: 'Usuário ou senha inválidos!'
    });
  }
});

//LOGOUT ADMIN 
router.get('/admin-logout', (req, res) => {
  req.session.adminLoggedIn = false;
  res.redirect('/');
});

//dashboard  
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const totalUsuarios = await adminModel.countUsuarios();
    const totalDiagnosticos = await adminModel.countDiagnosticos();
    const totalProdutos = await adminModel.countProdutos();
    const usuariosRecentes = await adminModel.getUsuariosRecentes();
    const diagnosticosRecentes = await adminModel.getDiagnosticosRecentes();
    const produtosBaixoEstoque = await adminModel.getProdutosBaixoEstoque();

    res.render('admin-dashboard', {
      titulo: 'Painel de Administração',
      totalUsuarios,
      totalDiagnosticos,
      totalProdutos,
      usuariosRecentes,
      diagnosticosRecentes,
      produtosBaixoEstoque
    });
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin-login');
  }
});

// ===== USUÁRIOS =====
router.get('/admin/usuarios', adminAuth, async (req, res) => {
  try {
    const usuarios = await adminModel.getAllUsuarios();
    res.render('admin-usuarios', { titulo: 'Gerenciar Usuários', usuarios });
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin');
  }
});

router.get('/admin/usuarios/deletar/:id', adminAuth, async (req, res) => {
  try {
    await adminModel.deleteUsuario(req.params.id);
    res.redirect('/admin/usuarios');
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin/usuarios');
  }
});

// ===== DIAGNÓSTICOS =====
router.get('/admin/diagnosticos', adminAuth, async (req, res) => {
  try {
    const diagnosticos = await adminModel.getAllDiagnosticos();
    res.render('admin-diagnosticos', { titulo: 'Gerenciar Diagnósticos', diagnosticos });
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin');
  }
});

router.get('/admin/diagnosticos/deletar/:id', adminAuth, async (req, res) => {
  try {
    await adminModel.deleteDiagnostico(req.params.id);
    res.redirect('/admin/diagnosticos');
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin/diagnosticos');
  }
});

// ===== PRODUTOS =====
router.get('/admin/produtos', adminAuth, async (req, res) => {
  try {
    const produtos = await adminModel.getAllProdutos();
    res.render('admin-produtos', { titulo: 'Gerenciar Produtos', produtos });
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin');
  }
});

router.get('/admin/produtos/novo', adminAuth, (req, res) => {
  res.render('admin-produto-editar', {
    titulo: 'Novo Produto',
    produto: null,
    isNovo: true
  });
});

router.post('/admin/produtos', adminAuth, async (req, res) => {
  try {
    const { nome, categoria, preco, descricao, estoque } = req.body;
    await adminModel.addProduto({
      nome,
      categoria,
      preco: parseFloat(preco),
      descricao,
      estoque: parseInt(estoque)
    });
    res.redirect('/admin/produtos');
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin/produtos');
  }
});

router.get('/admin/produtos/:id/editar', adminAuth, async (req, res) => {
  try {
    const produto = await adminModel.getProduto(req.params.id);
    if (!produto) return res.redirect('/admin/produtos');
    res.render('admin-produto-editar', {
      titulo: 'Editar Produto',
      produto,
      isNovo: false
    });
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin/produtos');
  }
});

router.post('/admin/produtos/:id', adminAuth, async (req, res) => {
  try {
    const { nome, categoria, preco, descricao, estoque } = req.body;
    await adminModel.updateProduto(req.params.id, {
      nome,
      categoria,
      preco: parseFloat(preco),
      descricao,
      estoque: parseInt(estoque)
    });
    res.redirect('/admin/produtos');
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin/produtos');
  }
});

router.get('/admin/produtos/:id/deletar', adminAuth, async (req, res) => {
  try {
    await adminModel.deleteProduto(req.params.id);
    res.redirect('/admin/produtos');
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin/produtos');
  }
});

module.exports = router;
