// Middleware de autenticação para o painel admin
// Verifica se o usuário está logado como admin

const adminAuth = (req, res, next) => {
  // Verifica se o usuário está logado como admin
  if (req.session && req.session.adminLoggedIn) {
    return next();
  }

  // Se não está autenticado, redireciona para login
  res.redirect('/admin-login');
};

module.exports = adminAuth;
