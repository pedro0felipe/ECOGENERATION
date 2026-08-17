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
  req.session.flash = { status: 'success', text: 'Você saiu da administração. Até logo!' };
  req.session.adminLoggedIn = null;
  req.session.adminNome = null;
  req.session.adminEmail = null;
  console.log('FLASH GRAVADO (admin logout):', req.session.flash);
  req.session.save(() => {
    // Destruir sessão APÓS a próxima página renderizar (via timeout curto)
    setTimeout(() => {
      req.session.destroy(() => {});
    }, 100);
    res.redirect('/');
  });
};
