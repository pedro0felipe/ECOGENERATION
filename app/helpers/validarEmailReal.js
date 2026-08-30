const dns = require('dns').promises;

/**
 * Verifica se o domínio do e-mail realmente existe e está apto a
 * receber mensagens, consultando os registros MX (Mail Exchange) dele.
 *
 * Isso pega e-mails com formato válido mas domínio inventado
 * (ex.: "usuario@naoexisteessedominio123.com"), que o isEmail()
 * do express-validator não detecta — ele só confere o FORMATO,
 * não se o domínio existe.
 *
 * Não garante que a caixa de entrada específica existe (isso só se
 * sabe de verdade enviando o e-mail de ativação), mas já elimina a
 * grande maioria dos cadastros com e-mail falso/digitado errado.
 */
const validarEmailReal = async (email) => {
    const dominio = String(email || '').split('@')[1];
    if (!dominio) return false;

    try {
        const registrosMx = await dns.resolveMx(dominio);
        return Array.isArray(registrosMx) && registrosMx.length > 0;
    } catch (erro) {
        // ENOTFOUND / ENODATA = domínio não existe ou não recebe e-mail
        return false;
    }
};

module.exports = { validarEmailReal };
