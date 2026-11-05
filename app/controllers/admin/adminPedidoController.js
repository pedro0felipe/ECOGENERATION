const { validationResult } = require('express-validator');
const { pedidosModel, STATUS_PEDIDO, PROXIMOS_STATUS, ROTULO_STATUS, ROTULO_PAGAMENTO } = require("../../models/pedidosModel");
const { consultarCep } = require('../userController');

// Rua, bairro e cidade de cada CEP (um pedido do ViaCEP por CEP diferente)
const enderecosPorCep = async (pedidos) => {
  const ceps = [...new Set(pedidos.map((p) => p.cep_usuario).filter(Boolean))];
  const resultados = await Promise.all(ceps.map((cep) => consultarCep(cep).catch(() => null)));
  return Object.fromEntries(ceps.map((cep, i) => [cep, resultados[i]]));
};

exports.STATUS_PEDIDO = STATUS_PEDIDO;

exports.listar = async (req, res) => {
  try {
    const pedidos = await pedidosModel.findAll();
    const enderecos = await enderecosPorCep(pedidos);
    res.render('admin-pedidos', {
      titulo: 'Gerenciar Pedidos', pedidos, enderecos,
      proximosStatus: PROXIMOS_STATUS, rotuloStatus: ROTULO_STATUS, rotuloPagamento: ROTULO_PAGAMENTO
    });
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin');
  }
};

exports.atualizarStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.flash = { status: 'error', text: 'Status de pedido inválido.' };
    return res.redirect('/admin/pedidos');
  }
  try {
    const { status } = req.body;
    const mudou = await pedidosModel.atualizarStatus(req.params.id, status);
    if (!mudou) {
      req.session.flash = { status: 'warning', text: `O pedido #${req.params.id} não pode passar para "${ROTULO_STATUS[status]}" a partir do status atual.` };
    } else {
      const lembrete = status === 'cancelado' ? ' O estoque foi devolvido; se já estava pago, faça o estorno no Mercado Pago.' : '';
      req.session.flash = { status: 'success', text: `Status do pedido #${req.params.id} atualizado para "${ROTULO_STATUS[status]}".${lembrete}` };
    }
    res.redirect('/admin/pedidos');
  } catch (erro) {
    console.log(erro);
    req.session.flash = { status: 'error', text: 'Erro ao atualizar status do pedido.' };
    res.redirect('/admin/pedidos');
  }
};
