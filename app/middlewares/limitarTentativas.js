// Limita tentativas seguidas vindas do mesmo endereço IP (proteção contra
// força bruta). Passado o limite, a própria página mostra o aviso, com o
// status HTTP 429 (Too Many Requests).
const { rateLimit } = require('express-rate-limit');

const MENSAGEM = 'Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.';

const criarLimite = ({ maximo, minutos, contarSoFalhas, responder }) => rateLimit({
    windowMs: minutos * 60 * 1000,
    limit: maximo,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    // Nas telas de login, uma tentativa certa termina em redirecionamento (3xx)
    // e não conta; só contam as que voltam para o formulário com erro.
    skipSuccessfulRequests: contarSoFalhas,
    requestWasSuccessful: (req, res) => res.statusCode >= 300 && res.statusCode < 400,
    handler: (req, res, next, opcoes) => {
        res.status(opcoes.statusCode);
        responder(req, res);
    }
});

const erroGeral = (view) => (req, res) =>
    res.render(view, { errors: { geral: { msg: MENSAGEM } }, old: req.body || {} });

module.exports = {
    limiteLogin: criarLimite({ maximo: 10, minutos: 15, contarSoFalhas: true, responder: erroGeral('login') }),
    limiteCadastro: criarLimite({ maximo: 10, minutos: 60, contarSoFalhas: false, responder: erroGeral('cadastro') }),
    // Cada pedido de recuperação envia um e-mail: conta todos
    limiteRecuperarSenha: criarLimite({ maximo: 5, minutos: 15, contarSoFalhas: false, responder: erroGeral('recuperar-senha') }),
    limiteAdminLogin: criarLimite({
        maximo: 5, minutos: 15, contarSoFalhas: true,
        responder: (req, res) => res.render('admin-login', { titulo: 'Login Admin', erro: MENSAGEM })
    })
};
