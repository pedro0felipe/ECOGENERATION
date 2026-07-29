const bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');
const { usuariosModel } = require("../models/usuariosModel");

// ===== CADASTRO =====
exports.cadastroForm = (req, res) => {
    res.render('cadastro', { titulo: 'Cadastro', old: {}, errors: {} });
};

exports.cadastroSubmit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('cadastro', { old: req.body, errors: errors.mapped() });
    }
    try {
        const existente = await usuariosModel.findByEmail(req.body.email);
        if (existente.length > 0) {
            return res.render('cadastro', {
                old: req.body,
                errors: { email: { msg: 'Este e-mail já está cadastrado.' } }
            });
        }
        await usuariosModel.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha
        });
        req.session.flash = { status: 'success', text: 'Cadastro realizado com sucesso! Faça login para continuar.' };
        console.log('FLASH GRAVADO (cadastro):', req.session.flash);
        req.session.save(() => res.redirect('/login'));
    } catch (erro) {
        console.log(erro);
        res.render('cadastro', { old: req.body, errors: { geral: { msg: 'Erro ao cadastrar. Tente novamente.' } } });
    }
};

// ===== LOGIN =====
exports.loginForm = (req, res) => {
    res.render('login', { errors: {}, old: {} });
};

exports.loginSubmit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login', { errors: errors.mapped(), old: req.body });
    }
    try {
        const usuarios = await usuariosModel.findByEmail(req.body.email);
        if (usuarios.length === 0) {
            return res.render('login', {
                errors: { geral: { msg: 'E-mail não cadastrado.' } },
                old: req.body
            });
        }
        const usuario = usuarios[0];
        const senhaCorreta = await bcrypt.compare(req.body.senha, usuario.senha_usuario);
        if (!senhaCorreta) {
            return res.render('login', {
                errors: { geral: { msg: 'Email ou senha inválidos.' } },
                old: req.body
            });
        }
        req.session.usuarioLogado = true;
        req.session.usuarioId = usuario.id_usuario;
        req.session.usuarioNome = usuario.nome_usuario;
        req.session.flash = { status: 'success', text: `Bem-vindo(a) de volta, ${usuario.nome_usuario.split(' ')[0]}!` };
        console.log('FLASH GRAVADO (login):', req.session.flash);
        console.log('SESSION ID:', req.sessionID);
        req.session.save(() => res.redirect('/'));
    } catch (erro) {
        console.log(erro);
        res.render('login', {
            errors: { geral: { msg: 'Erro ao fazer login. Tente novamente.' } },
            old: req.body
        });
    }
};

// ===== LOGOUT =====
exports.logout = (req, res) => {
    req.session.flash = { status: 'success', text: 'Você saiu da sua conta. Até logo!' };
    console.log('FLASH GRAVADO (logout):', req.session.flash);
    req.session.save(() => {
        req.session.destroy();
        res.redirect('/login');
    });
};