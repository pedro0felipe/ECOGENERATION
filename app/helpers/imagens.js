const fs = require('fs');
const path = require('path');

const PASTA_PERFIL = path.join(__dirname, '../public/imagens/perfil');

// Tipos de imagem aceitos e a extensão gravada para cada um. A extensão do
// arquivo salvo vem SEMPRE desta tabela, nunca do nome enviado pelo usuário
// (assim um "foto.html" disfarçado de imagem não vira uma página no site).
const EXTENSAO_POR_TIPO = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif'
};

const tipoImagemPermitido = (mimetype) => Object.prototype.hasOwnProperty.call(EXTENSAO_POR_TIPO, mimetype);

// Apaga um arquivo do disco sem derrubar a requisição se ele não existir.
const removerArquivo = (caminho) => {
    try {
        if (caminho && fs.existsSync(caminho)) fs.unlinkSync(caminho);
    } catch (erro) {
        console.log('Não foi possível remover o arquivo:', erro.message);
    }
};

// Apaga uma foto de perfil enviada pelo usuário (caminho salvo no banco,
// ex.: "imagens/perfil/perfil_7_123.jpg"). Nada fora da pasta de perfis é apagado.
const removerFotoPerfil = (caminhoSalvo) => {
    if (!caminhoSalvo || !String(caminhoSalvo).startsWith('imagens/perfil/perfil_')) return;
    removerArquivo(path.join(PASTA_PERFIL, path.basename(caminhoSalvo)));
};

module.exports = { EXTENSAO_POR_TIPO, tipoImagemPermitido, removerArquivo, removerFotoPerfil };
