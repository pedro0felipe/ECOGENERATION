const pool = require("../../config/pool_conexoes");

const comprasModel = {

    // Criar uma nova compra
    create: async (dadosJson) => {
        try {
            const [resultado] = await pool.query(
                "INSERT INTO compras (id_usuario, id_produto, nome_produto, preco_produto, imagem_produto, status_compra) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    dadosJson.id_usuario,
                    dadosJson.id_produto,
                    dadosJson.nome_produto,
                    dadosJson.preco_produto,
                    dadosJson.imagem_produto,
                    'confirmado'
                ]
            );
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    // Buscar todas as compras de um usuário
    findByUsuario: async (id_usuario) => {
        try {
            const [resultado] = await pool.query(
                "SELECT * FROM compras WHERE id_usuario = ? ORDER BY id_compra DESC",
                [id_usuario]
            );
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    // Buscar uma compra específica pelo ID
    findById: async (id) => {
        try {
            const [resultado] = await pool.query(
                "SELECT * FROM compras WHERE id_compra = ?",
                [id]
            );
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    // Atualizar status de uma compra (para admin)
    updateStatus: async (id, status) => {
        try {
            const [resultado] = await pool.query(
                "UPDATE compras SET status_compra = ? WHERE id_compra = ?",
                [status, id]
            );
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    // Buscar todas as compras (para admin)
    findAll: async () => {
        try {
            const [resultado] = await pool.query(
                "SELECT compras.*, usuarios.nome_usuario, usuarios.email_usuario FROM compras LEFT JOIN usuarios ON compras.id_usuario = usuarios.id_usuario ORDER BY compras.id_compra DESC"
            );
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    // Contar todas as compras (para dashboard)
    countAll: async () => {
        try {
            const [resultado] = await pool.query(
                "SELECT COUNT(*) AS total FROM compras"
            );
            return resultado[0].total;
        } catch (erro) {
            return 0;
        }
    }

}

module.exports = { comprasModel };
