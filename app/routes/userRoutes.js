const express = require("express");
const router = express.Router();
const requireLogin = require("../middlewares/requireLogin");
const userController = require("../controllers/userController");

router.get('/perfil', requireLogin, userController.perfil);
router.post('/excluir-conta', requireLogin, userController.excluirConta);

module.exports = router;
