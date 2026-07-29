const express = require("express");
const router = express.Router();
const requireLogin = require("../middlewares/requireLogin");
const compraController = require("../controllers/compraController");

router.get('/confirmar-compra/:id', requireLogin, compraController.confirmarCompraForm);
router.post('/confirmar-compra/:id', requireLogin, compraController.confirmarCompraSubmit);
router.get('/compra-sucesso', requireLogin, compraController.compraSucesso);

module.exports = router;
