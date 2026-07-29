const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const upload = require('../middlewares/upload');

const adminAuthController = require('../controllers/admin/adminAuthController');
const adminDashboardController = require('../controllers/admin/adminDashboardController');
const adminUsuarioController = require('../controllers/admin/adminUsuarioController');
const adminDiagnosticoController = require('../controllers/admin/adminDiagnosticoController');
const adminPedidoController = require('../controllers/admin/adminPedidoController');
const adminProdutoController = require('../controllers/admin/adminProdutoController');

// LOGIN / LOGOUT
router.get('/admin-login', adminAuthController.loginForm);
router.post('/admin-login', adminAuthController.loginSubmit);
router.get('/admin-logout', adminAuthController.logout);

// DASHBOARD
router.get('/admin', adminAuth, adminDashboardController.dashboard);

// USUÁRIOS
router.get('/admin/usuarios', adminAuth, adminUsuarioController.listar);
router.get('/admin/usuarios/deletar/:id', adminAuth, adminUsuarioController.deletar);

// DIAGNÓSTICOS
router.get('/admin/diagnosticos', adminAuth, adminDiagnosticoController.listar);
router.get('/admin/diagnosticos/deletar/:id', adminAuth, adminDiagnosticoController.deletar);

// PEDIDOS
router.get('/admin/pedidos', adminAuth, adminPedidoController.listar);
router.post('/admin/pedidos/:id/status', adminAuth, adminPedidoController.atualizarStatus);

// PRODUTOS
router.get('/admin/produtos', adminAuth, adminProdutoController.listar);
router.get('/admin/produtos/novo', adminAuth, adminProdutoController.novoForm);
router.post('/admin/produtos', adminAuth, upload.single('imagem'), adminProdutoController.criar);
router.get('/admin/produtos/:id/editar', adminAuth, adminProdutoController.editarForm);
router.post('/admin/produtos/:id', adminAuth, upload.single('imagem'), adminProdutoController.atualizar);
router.get('/admin/produtos/:id/deletar', adminAuth, adminProdutoController.deletar);

module.exports = router;
