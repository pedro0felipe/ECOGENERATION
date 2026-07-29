const { produtosModel } = require("../models/produtosModel");
const { diagnosticosModel } = require("../models/diagnosticosModel");

// ===== TELA DO DIAGNÓSTICO =====
exports.form = (req, res) => {
    res.render('diagnostico', { titulo: 'Diagnóstico de Autonomia Energética' });
};

// ===== CALCULAR E SALVAR DIAGNÓSTICO =====
exports.calcular = async (req, res) => {
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
    let produtosRecomendados = await produtosModel.findByCategoria(categoriaFinal);

    if (!produtosRecomendados || !Array.isArray(produtosRecomendados) || produtosRecomendados.length === 0) {
        produtosRecomendados = await produtosModel.findAll();
    }

    if (!Array.isArray(produtosRecomendados)) {
        produtosRecomendados = [];
    }

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
};

// Redireciona GET /resultado para o diagnóstico (evita erro no F5)
exports.redirecionarResultado = (req, res) => {
    res.redirect('/diagnostico');
};
