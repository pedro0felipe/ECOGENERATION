/**
 * Função centralizada para exibir notificações com simple-notify.js
 * 
 * Segue a proposta apresentada no material "PLAO INI3 – 08 - Notificações com simple-notify"
 * 
 * @param {string} titulo - Título da notificação
 * @param {string} texto - Texto/mensagem da notificação
 * @param {string} tipo - Tipo: 'success', 'error', 'warning', 'info'
 * @param {string} posicao - Posição: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
 */
function notify(titulo, texto, tipo = 'info', posicao = 'top-right') {
  new Notify({
    title: titulo,
    text: texto,
    status: tipo,
    position: posicao,
    effect: 'fade',
    showIcon: true,
    showCloseButton: true,
    autoclose: true,
    autotimeout: 4000
  });
}

/**
 * Verifica e exibe a flashMessage armazenada em res.locals
 * Chamado automaticamente pelo partial flash.ejs
 */
document.addEventListener('DOMContentLoaded', function() {
  // Verifica se flashMessage foi disponibilizada pelo backend
  // Esta função será chamada pelo partial flash.ejs via inline script
  window.exibirFlashMessage = function(flashData) {
    if (flashData && flashData.status && flashData.text) {
      notify(
        flashData.titulo || (flashData.status === 'success' ? '✓ Sucesso' : '✕ Atenção'),
        flashData.text,
        flashData.status,
        flashData.posicao || 'top-right'
      );
    }
  };
});
