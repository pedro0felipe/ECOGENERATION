const jwt = require('jsonwebtoken');

const getSecret = () => {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET não configurado');
    return process.env.JWT_SECRET;
};

const criarToken = (payload, expiresIn) => jwt.sign(payload, getSecret(), { expiresIn });
const verificarToken = (token) => jwt.verify(token, getSecret());

const getBaseUrl = () => process.env.APP_BASE_URL || `http://localhost:${process.env.APP_PORT || 3000}`;

module.exports = { criarToken, verificarToken, getBaseUrl };