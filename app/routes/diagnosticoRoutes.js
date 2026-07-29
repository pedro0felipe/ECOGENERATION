const express = require("express");
const router = express.Router();
const requireLogin = require("../middlewares/requireLogin");
const diagnosticoController = require("../controllers/diagnosticoController");

router.get('/diagnostico', requireLogin, diagnosticoController.form);
router.post('/diagnostico', requireLogin, diagnosticoController.calcular);
router.get('/resultado', diagnosticoController.redirecionarResultado);

module.exports = router;
