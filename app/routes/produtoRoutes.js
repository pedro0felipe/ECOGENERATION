const express = require("express");
const router = express.Router();
const produtoController = require("../controllers/produtoController");

router.get("/", produtoController.home);
router.get("/ecoloja", produtoController.ecoloja);
router.get("/produto/:id", produtoController.detalhePorId);
router.get("/search", produtoController.busca);

router.get("/sobre-nos", produtoController.sobreNos);
router.get("/entrada", produtoController.entrada);
router.get("/medio", produtoController.medio);
router.get("/avancado", produtoController.avancado);
router.get("/lampada", produtoController.lampada);
router.get("/calculadora-tela-inicial", produtoController.calculadoraTelaInicial);
router.get("/calculadora-perguntas", produtoController.calculadoraPerguntas);

// Rotas amigáveis de produtos individuais (mesma lógica: busca pela própria rota)
const rotasDeProduto = [
    "ventilador", "lumi", "miniventilador", "painel-solar", "powerbank",
    "ventiladorsolar", "lampadasolar", "kitenergiasolarportatil", "carregador",
    "painelsolarmedio", "carregadorusb", "luminariasolar", "minipainel",
    "ventiladormedio", "estacao", "kitmedioo", "estacaodeenergiaportatil",
    "bluetti", "estacaoeolica", "kitgerador", "estacaogeradorsolar",
    "ecoflow", "esttacao", "placamil", "luminaria"
];
rotasDeProduto.forEach((rota) => {
    router.get(`/${rota}`, produtoController.detalhePorRota);
});

module.exports = router;
