const { produtosModel } = require("../models/produtosModel");
const { comprasModel } = require("../models/comprasModel");
const { usuariosModel } = require("../models/usuariosModel");
const { consultarCep } = require('./userController');

// ===== CONFIRMAR COMPRA (tela) =====
exports.confirmarCompraForm = async (req, res) => {
    try {
        const resultados = await produtosModel.findById(req.params.id);
        if (!resultados || resultados.length === 0) {
            return res.redirect('/ecoloja');
        }
        const produto = resultados[0];
        const usuarios = await usuariosModel.findById(req.session.usuarioId);
        const usuario = usuarios[0];
        let endereco = null;
        let erroCep = false;
        try {
            endereco = await consultarCep(usuario.cep_usuario);
        } catch (erroCepApi) {
            erroCep = true;
        }
        res.render('confirmar-compra', { titulo: 'Confirmar Compra', produto, usuario, endereco, erroCep });
    } catch (erro) {
        console.log(erro);
        res.redirect('/ecoloja');
    }
};

// ===== PROCESSAR COMPRA =====
exports.confirmarCompraSubmit = async (req, res) => {
    try {
        const resultados = await produtosModel.findById(req.params.id);
        if (!resultados || resultados.length === 0) {
            return res.redirect('/ecoloja');
        }
        const produto = resultados[0];

        const novaCompra = await comprasModel.create({
            id_usuario: req.session.usuarioId,
            id_produto: produto.id_produto,
            nome_produto: produto.nome_produto,
            preco_produto: produto.preco_produto,
            imagem_produto: produto.imagem_produto
        });

        // Guarda o id da compra na sessão para exibir na página de sucesso
        req.session.ultimaCompraId = novaCompra.insertId;
        req.session.ultimaCompraProduto = produto.nome_produto;
        req.session.ultimaCompraPreco = produto.preco_produto;
        req.session.flash = { status: 'success', text: 'Compra realizada com sucesso!' };

        res.redirect('/compra-sucesso');
    } catch (erro) {
        console.log(erro);
        res.redirect('/ecoloja');
    }
};

// ===== COMPRA SUCESSO =====
exports.compraSucesso = (req, res) => {
    const nomeProduto = req.session.ultimaCompraProduto || 'Produto';
    const precoProduto = req.session.ultimaCompraPreco || '0.00';
    const compraId = req.session.ultimaCompraId || '---';
    res.render('compra-sucesso', {
        titulo: 'Compra Realizada!',
        nomeProduto,
        precoProduto,
        compraId
    });
};
