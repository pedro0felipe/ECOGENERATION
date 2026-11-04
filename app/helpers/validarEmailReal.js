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
// Atenção: no express-validator, um validador assíncrono só reprova o campo
// quando LANÇA um erro (Promise rejeitada). Retornar false não reprova nada.
const DOMINIO_INEXISTENTE = ['ENOTFOUND', 'ENODATA', 'NXDOMAIN'];

const validarEmailReal = async (email) => {
    const dominio = String(email || '').split('@')[1];
    if (!dominio) throw new Error('E-mail sem domínio');

    let registrosMx;
    try {
        registrosMx = await dns.resolveMx(dominio);
    } catch (erro) {
        // Domínio que não existe ou não recebe e-mail: reprova o campo
        if (DOMINIO_INEXISTENTE.includes(erro.code)) throw new Error('Domínio sem e-mail');
        // Falha do próprio DNS (sem internet, servidor lento): não bloqueia o cadastro
        return true;
    }
    if (!Array.isArray(registrosMx) || registrosMx.length === 0) throw new Error('Domínio sem e-mail');
    return true;
};

module.exports = { validarEmailReal };
