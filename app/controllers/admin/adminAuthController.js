// ===== LOGIN ADMIN =====
exports.loginForm = (req, res) => {
  res.render('admin-login', { titulo: 'Login Admin', erro: '' });
};

exports.loginSubmit = (req, res) => {
  const { usuario, senha } = req.body;
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
    req.session.adminLoggedIn = true;
    req.session.adminUser = usuario;
    req.session.flash = { status: 'success', text: 'Login administrativo realizado com sucesso!' };
    res.redirect('/admin');
  } else {
    res.render('admin-login', {
      titulo: 'Login Admin',
      erro: 'Usuário ou senha inválidos!'
    });
  }
};

// ===== LOGOUT ADMIN =====
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
