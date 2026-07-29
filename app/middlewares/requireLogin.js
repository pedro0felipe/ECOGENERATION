// Protege rotas que exigem usuário comum logado.
module.exports = function requireLogin(req, res, next) {
    if (!req.session.usuarioLogado) {
        return res.redirect('/login');
    }
    next();
};
