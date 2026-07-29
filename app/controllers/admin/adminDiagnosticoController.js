const { adminModel } = require("../../models/adminModel");

exports.listar = async (req, res) => {
  try {
    const diagnosticos = await adminModel.getAllDiagnosticos();
    res.render('admin-diagnosticos', { titulo: 'Gerenciar Diagnósticos', diagnosticos });
  } catch (erro) {
    console.log(erro);
    res.redirect('/admin');
  }
};

exports.deletar = async (req, res) => {
  try {
    await adminModel.deleteDiagnostico(req.params.id);
    req.session.flash = { status: 'success', text: 'Diagnóstico removido com sucesso.' };
    res.redirect('/admin/diagnosticos');
  } catch (erro) {
    console.log(erro);
    req.session.flash = { status: 'error', text: 'Erro ao remover diagnóstico.' };
    res.redirect('/admin/diagnosticos');
  }
};
