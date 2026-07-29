const { usuariosModel } = require("../models/usuariosModel");
const { diagnosticosModel } = require("../models/diagnosticosModel");
const { comprasModel } = require("../models/comprasModel");

// ===== PERFIL DO USUÁRIO =====
exports.perfil = async (req, res) => {
    try {
        const usuarios = await usuariosModel.findById(req.session.usuarioId);
        const usuario = usuarios[0];
        const diagnosticos = await diagnosticosModel.findByUsuario(req.session.usuarioId);
        const compras = await comprasModel.findByUsuario(req.session.usuarioId);
        res.render('perfil', {
            titulo: 'Meu Perfil',
            usuario,
            diagnosticos,
            compras
        });
    } catch (erro) {
        console.log(erro);
        res.redirect('/');
    }
};

// ===== EXCLUIR CONTA =====
exports.excluirConta = async (req, res) => {
    try {
        await usuariosModel.delete(req.session.usuarioId);
        req.session.flash = { status: 'success', text: 'Sua conta foi removida com sucesso.' };
        req.session.save(() => {
            req.session.destroy();
            res.redirect('/login');
        });
    } catch (erro) {
        console.log(erro);
        req.session.flash = { status: 'error', text: 'Erro ao excluir conta. Tente novamente.' };
        res.redirect('/perfil');
    }
};
