var express = require("express");
const bcrypt = require("bcryptjs");
const { produtosModel } = require("../models/produtosModel");
const { diagnosticosModel } = require("../models/diagnosticosModel");
const { usuariosModel } = require("../models/usuariosModel");
const { comprasModel } = require("../models/comprasModel");
var router = express.Router();
const { validationResult, check } = require('express-validator');

// ===== IMPORTAR ROTAS DE ADMIN =====
const routerAdmin = require('../admin/routes/router-adm');

// ===== VALIDADORES CUSTOMIZADOS =====
const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11) return false;
    
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
};

const validarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]/g, '');
    if (cnpj.length !== 14) return false;
    
    if (cnpj === '00000000000000') return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
};

// ===== MIDDLEWARE — protege rotas que precisam de login =====
function requireLogin(req, res, next) {
    if (!req.session.usuarioLogado) {
        return res.redirect('/login');
    }
    next();
}

// ===== PAGINA INICIAL =====
router.get("/", async function (req, res) {
    try {
        const rotasDestaque = ["ventilador", "powerbank", "lampadasolar"];
        let produtosDestaque = await produtosModel.findByRotaList(rotasDestaque);
        if (!Array.isArray(produtosDestaque) || produtosDestaque.length === 0) {
            produtosDestaque = await produtosModel.findAll(3);
        }
        res.render("index", { titulo: "Pagina inicial", produtosDestaque });
    } catch (erro) {
        console.log(erro);
        res.render("index", { titulo: "Pagina inicial", produtosDestaque: [] });
    }
});

// ===== ECOLOJA =====
router.get("/ecoloja", async function (req, res) {
    try {
        const PER_PAGE = 8;
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const total = await produtosModel.countAll();
        const totalPages = Math.ceil(total / PER_PAGE);
        const currentPage = Math.min(page, totalPages || 1);
        const produtos = await produtosModel.findPaginated(currentPage, PER_PAGE);

        res.render("ecoloja", {
            titulo: "EcoLoja",
            produtos,
            currentPage,
            totalPages
        });
    } catch (erro) {
        console.log(erro);
    }
});

// ===== DETALHE DO PRODUTO =====
router.get('/produto/:id', async function (req, res) {
    try {
        const resultados = await produtosModel.findById(req.params.id);
        if (!resultados || resultados.length === 0) {
            return res.status(404).render('404', { titulo: 'Produto não encontrado' });
        }
        const produto = resultados[0];
        res.render('produto', { titulo: produto.nome_produto, produto });
    } catch (erro) {
        console.log(erro);
        res.status(500).send('Erro interno do servidor');
    }
});

// ===== CONFIRMAR COMPRA =====
router.get('/confirmar-compra/:id', requireLogin, async function (req, res) {
    try {
        const resultados = await produtosModel.findById(req.params.id);
        if (!resultados || resultados.length === 0) {
            return res.redirect('/ecoloja');
        }
        const produto = resultados[0];
        res.render('confirmar-compra', { titulo: 'Confirmar Compra', produto });
    } catch (erro) {
        console.log(erro);
        res.redirect('/ecoloja');
    }
});

// ===== PROCESSAR COMPRA =====
router.post('/confirmar-compra/:id', requireLogin, async function (req, res) {
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

        res.redirect('/compra-sucesso');
    } catch (erro) {
        console.log(erro);
        res.redirect('/ecoloja');
    }
});

// ===== COMPRA SUCESSO =====
router.get('/compra-sucesso', requireLogin, function (req, res) {
    const nomeProduto = req.session.ultimaCompraProduto || 'Produto';
    const precoProduto = req.session.ultimaCompraPreco || '0.00';
    const compraId = req.session.ultimaCompraId || '---';
    res.render('compra-sucesso', {
        titulo: 'Compra Realizada!',
        nomeProduto,
        precoProduto,
        compraId
    });
});

// ===== PERFIL DO USUÁRIO =====
router.get('/perfil', requireLogin, async (req, res) => {
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
});

// ===== EXCLUIR CONTA =====
router.post('/excluir-conta', requireLogin, async (req, res) => {
    try {
        await usuariosModel.delete(req.session.usuarioId);
        req.session.destroy();
        res.redirect('/?conta=excluida');
    } catch (erro) {
        console.log(erro);
        res.redirect('/perfil');
    }
});

// ===== CADASTRO =====
router.get('/cadastro', (req, res) => {
    res.render('cadastro', { titulo: 'Cadastro', old: {}, errors: {} });
});

router.post('/cadastro',
    [
        check('nome').notEmpty().withMessage('Nome é obrigatório'),
        check('email').isEmail().withMessage('Email inválido'),
        check('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
        check('cpf').optional({ checkFalsy: true }).custom(validarCPF).withMessage('CPF inválido'),
        check('cnpj').optional({ checkFalsy: true }).custom(validarCNPJ).withMessage('CNPJ inválido'),
        check('telefone').optional({ checkFalsy: true }).matches(/^\(\d{2}\)\s?\d{5}-\d{4}$/).withMessage('Telefone inválido. Formato: (XX) XXXXX-XXXX'),
        check('rg').optional({ checkFalsy: true }).isLength({ min: 5 }).withMessage('RG deve ter no mínimo 5 caracteres'),
    ],
    async (req, res) => {
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
            res.redirect('/login');
        } catch (erro) {
            console.log(erro);
            res.render('cadastro', { old: req.body, errors: { geral: { msg: 'Erro ao cadastrar. Tente novamente.' } } });
        }
    }
);

// ===== LOGIN =====
router.get('/login', (req, res) => {
    res.render('login', { errors: {}, old: {} });
});

router.post('/login',
    [
        check('email').isEmail().withMessage('Email inválido'),
        check('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
    ],
    async (req, res) => {
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
            res.redirect('/');
        } catch (erro) {
            console.log(erro);
            res.render('login', {
                errors: { geral: { msg: 'Erro ao fazer login. Tente novamente.' } },
                old: req.body
            });
        }
    }
);

// ===== LOGOUT =====
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// ===== DIAGNÓSTICO =====
router.get('/diagnostico', requireLogin, (req, res) => {
    res.render('diagnostico', { titulo: 'Diagnóstico de Autonomia Energética' });
});

router.post('/diagnostico', requireLogin, async (req, res) => {
    const { frequencia, duracao, preparacao, prioridade, moradia, orcamento } = req.body;

    // ── VULNERABILIDADE (0–10) ───────────────────────────────
    let vulnerabilidade = 0;
    switch (frequencia) {
    case 'nunca':          vulnerabilidade += 0; break;
    case 'poucas':         vulnerabilidade += 1; break;
    case 'regularmente':   vulnerabilidade += 3; break;
    case 'algumas':        vulnerabilidade += 4; break;
    case 'frequentemente': vulnerabilidade += 5; break;
}
    switch (duracao) {
        case 'menos1h':  vulnerabilidade += 0; break;
        case '1a4h':     vulnerabilidade += 1; break;
        case '4a12h':    vulnerabilidade += 3; break;
        case 'mais12h':  vulnerabilidade += 5; break;
    }

    // ── PREPARO (0–10) ───────────────────────────────────────
    let preparo = 0;
    const preparacoes = Array.isArray(preparacao) ? preparacao : preparacao ? [preparacao] : [];
    if (preparacoes.includes('nenhuma')) {
        preparo = 0;
    } else {
        preparacoes.forEach((item) => {
            switch (item) {
                case 'sistema_completo': preparo += 10; break;
                case 'gerador':          preparo += 7;  break;
                case 'power_bank':       preparo += 3;  break;
                case 'lanternas':        preparo += 1;  break;
            }
        });
        preparo = Math.min(preparo, 10);
    }

    // ── PERFIL ───────────────────────────────────────────────
    let perfil;
    if (preparo >= 8) {
        perfil = 'independente';
    } else if (vulnerabilidade >= 6 && preparo <= 3) {
        perfil = 'critico';
    } else if (vulnerabilidade >= 3 || preparo >= 2) {
        perfil = 'medio';
    } else {
        perfil = 'preventivo';
    }

    // ── CATEGORIA DE PRODUTO ─────────────────────────────────
    const categoriaPorPerfil = {
        independente: 'avancado',
        critico:      'entrada',
        medio:        'medio',
        preventivo:   'entrada'
    };

    const niveisCategoria = ['entrada', 'medio', 'avancado'];
    const fatorPrioridade = {
        iluminacao: 0,
        carregamento: 0,
        climatizacao: 1,
        trabalho: 1
    };

    let categoriaFinal = categoriaPorPerfil[perfil] || 'entrada';

    // Ajusta a categoria com base no orçamento e na prioridade do usuário.
    const indiceOrcamento = {
        ate200: 0,
        '200a500': 1,
        '500a1000': 2,
        acima1000: 2
    };

    const indiceAtual = niveisCategoria.indexOf(categoriaFinal);
    const indiceMaximo = Math.min(
        2,
        Math.max(indiceAtual, indiceOrcamento[orcamento] || 0) + (fatorPrioridade[prioridade] || 0)
    );

    categoriaFinal = niveisCategoria[indiceMaximo];

    // ── SALVAR ───────────────────────────────────────────────
    try {
        await diagnosticosModel.create({
            id_usuario:      req.session.usuarioId ? parseInt(req.session.usuarioId) : null,
            frequencia,
            impacto:         duracao,
            preparacao:      preparacoes.join(', '),
            prioridade,
            tolerancia:      moradia,
            nivel_autonomia: perfil
        });
    } catch (erro) {
        console.log('Erro ao salvar diagnóstico:', erro);
    }

    // ── PRODUTOS ─────────────────────────────────────────────
    // Tenta buscar pela categoria do perfil; se não houver, busca todos e filtra por preço
    let produtosRecomendados = await produtosModel.findByCategoria(categoriaFinal);

    // Se não encontrou nada (categoria não cadastrada no banco), pega todos os produtos
    if (!produtosRecomendados || !Array.isArray(produtosRecomendados) || produtosRecomendados.length === 0) {
        produtosRecomendados = await produtosModel.findAll();
    }

    // Garante que sempre é array mesmo em caso de erro de banco
    if (!Array.isArray(produtosRecomendados)) {
        produtosRecomendados = [];
    }

    // Ordena por preço e limita a 4
    produtosRecomendados = produtosRecomendados
        .sort((a, b) => parseFloat(a.preco_produto || 0) - parseFloat(b.preco_produto || 0))
        .slice(0, 4);

    const nivelParaView = perfil === 'independente' ? 'alta'
                        : perfil === 'critico'      ? 'baixa'
                        : 'media';

    res.render('resultado', {
        nivel: nivelParaView,
        perfil,
        produtosRecomendados,
        prioridade,
        vulnerabilidade,
        preparo
    });
});

// Redireciona GET /resultado para o diagnóstico (evita erro no F5)
router.get('/resultado', (req, res) => {
    res.redirect('/diagnostico');
});

// ===== PÁGINAS DE PRODUTOS INDIVIDUAIS =====
router.get("/sobre-nos", (req, res) => res.render("sobre-nos", { titulo: "Sobre Nós" }));
router.get("/entrada", (req, res) => res.render("entrada", { titulo: "Entrada" }));
router.get("/medio", (req, res) => res.render("medio", { titulo: "Médio" }));
router.get("/avancado", (req, res) => res.render("avancado", { titulo: "Avançado" }));
router.get("/lampada", (req, res) => res.render("lampada", { titulo: "Lâmpada" }));

const renderProdutoPorRota = async (req, res) => {
    try {
        const rota = req.path.replace(/^\//, '');
        const resultados = await produtosModel.findByRota(rota);
        if (!resultados || resultados.length === 0) {
            return res.status(404).render('404', { titulo: 'Produto não encontrado' });
        }
        const produto = resultados[0];
        res.render('produto', { titulo: produto.nome_produto, produto });
    } catch (erro) {
        console.log(erro);
        res.status(500).send('Erro interno do servidor');
    }
};

router.get("/ventilador", renderProdutoPorRota);
router.get("/lumi", renderProdutoPorRota);
router.get("/miniventilador", renderProdutoPorRota);
router.get("/painel-solar", renderProdutoPorRota);
router.get("/powerbank", renderProdutoPorRota);
router.get("/ventiladorsolar", renderProdutoPorRota);
router.get("/lampadasolar", renderProdutoPorRota);
router.get("/kitenergiasolarportatil", renderProdutoPorRota);
router.get("/carregador", renderProdutoPorRota);
router.get("/painelsolarmedio", renderProdutoPorRota);
router.get("/carregadorusb", renderProdutoPorRota);
router.get("/luminariasolar", renderProdutoPorRota);
router.get("/minipainel", renderProdutoPorRota);
router.get("/ventiladormedio", renderProdutoPorRota);
router.get("/estacao", renderProdutoPorRota);
router.get("/kitmedioo", renderProdutoPorRota);
router.get("/estacaodeenergiaportatil", renderProdutoPorRota);
router.get("/bluetti", renderProdutoPorRota);
router.get("/estacaoeolica", renderProdutoPorRota);
router.get("/kitgerador", renderProdutoPorRota);
router.get("/estacaogeradorsolar", renderProdutoPorRota);
router.get("/ecoflow", renderProdutoPorRota);
router.get("/esttacao", renderProdutoPorRota);
router.get("/placamil", renderProdutoPorRota);
router.get("/luminaria", renderProdutoPorRota);
router.get("/calculadora-tela-inicial", (req, res) => res.render("diagnosticotela-inicial", { titulo: "Diagnóstico" }));
router.get("/calculadora-perguntas", (req, res) => res.render("calculadora-perguntas", { titulo: "EcoCalculadora" }));

// ===== ROTAS DE ADMIN =====
router.use('/', routerAdmin);

module.exports = router;
