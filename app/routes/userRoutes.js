const express = require("express");
const router = express.Router();
const requireLogin = require("../middlewares/requireLogin");
const userController = require("../controllers/userController");
const profileUpload = require('../middlewares/profileUpload');

router.get('/perfil', requireLogin, userController.perfil);
router.post('/perfil', requireLogin, (req, res, next) => {
	profileUpload.single('imagem')(req, res, (erro) => {
		if (erro) {
			req.session.flash = { status: 'error', text: 'Imagem inválida ou maior que 5 MB.' };
			return res.redirect('/perfil');
		}
		next();
	});
}, userController.atualizarPerfil);
router.post('/excluir-conta', requireLogin, userController.excluirConta);

module.exports = router;
