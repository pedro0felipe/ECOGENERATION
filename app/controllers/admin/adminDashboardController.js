const { adminModel } = require("../../models/adminModel");
const { comprasModel } = require("../../models/comprasModel");

exports.dashboard = async (req, res) => {
  try {
    const totalUsuarios = await adminModel.countUsuarios();
    const totalDiagnosticos = await adminModel.countDiagnosticos();
    const totalProdutos = await adminModel.countProdutos();
    const pedidos = await comprasModel.findAll();
    let totalPedidos = Array.isArray(pedidos) ? pedidos.length : 0;

    if (totalPedidos === 0) {
      const fallbackCount = await comprasModel.countAll();
      totalPedidos = Number.isInteger(fallbackCount) ? fallbackCount : totalPedidos;
    }

    const usuariosRecentes = await adminModel.getUsuariosRecentes();
    const diagnosticosRecentes = await adminModel.getDiagnosticosRecentes();
    const produtosBaixoEstoque = await adminModel.getProdutosBaixoEstoque();

    res.render('admin-dashboard', {
      titulo: 'Painel de Administração',
      totalUsuarios,
      totalDiagnosticos,
      totalProdutos,
      totalPedidos,
      usuariosRecentes,
      diagnosticosRecentes,
      produtosBaixoEstoque
    });
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin-login');
  }
};
