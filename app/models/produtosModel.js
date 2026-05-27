const pool = require("../../config/pool_conexoes");

const produtosModel = {

    findAll: async (limit = null) => {
        try {
            let query = "SELECT * FROM produtos WHERE status_produto = 1";
            const params = [];
            if (limit && Number.isInteger(limit)) {
                query += " LIMIT ?";
                params.push(limit);
            }
            const [resultado] = await pool.query(query, params);
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    findById: async (id) => {
        try {
            const [resultado] = await pool.query(
                "SELECT * FROM produtos WHERE status_produto = 1 AND id_produto = ?",
                [id]
            );
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    findByCategoria: async (categoria, limit = null) => {
        try {
            let query = "SELECT * FROM produtos WHERE categoria_produto = ? AND status_produto = 1";
            const params = [categoria];
            if (limit && Number.isInteger(limit)) {
                query += " LIMIT ?";
                params.push(limit);
            }
            const [resultado] = await pool.query(query, params);
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    findByRota: async (rota) => {
        try {
            const [resultado] = await pool.query(
                "SELECT * FROM produtos WHERE rota_produto = ? AND status_produto = 1",
                [rota]
            );
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    findByRotaList: async (rotas = []) => {
        try {
            if (!Array.isArray(rotas) || rotas.length === 0) {
                return [];
            }

            const placeholders = rotas.map(() => '?').join(',');
            const query = `SELECT * FROM produtos WHERE rota_produto IN (${placeholders}) AND status_produto = 1 ORDER BY FIELD(rota_produto, ${placeholders})`;
            const params = [...rotas, ...rotas];
            const [resultado] = await pool.query(query, params);
            return resultado;
        } catch (erro) {
            return erro;
        }
    },

    search: async (termo, page = 1) => {
        try {
            const limit = 12;
            const offset = (page - 1) * limit;
            const searchTerm = `%${termo}%`;

            // Buscar produtos que correspondem ao termo
            const [resultados] = await pool.query(
                `SELECT * FROM produtos 
                WHERE status_produto = 1 AND 
                (nome_produto LIKE ? OR 
                descricao_produto LIKE ? OR 
                categoria_produto LIKE ?)
                ORDER BY nome_produto ASC
                LIMIT ? OFFSET ?`,
                [searchTerm, searchTerm, searchTerm, limit, offset]
            );

            // Contar total de resultados
            const [countResult] = await pool.query(
                `SELECT COUNT(*) as total FROM produtos 
                WHERE status_produto = 1 AND 
                (nome_produto LIKE ? OR 
                descricao_produto LIKE ? OR 
                categoria_produto LIKE ?)`,
                [searchTerm, searchTerm, searchTerm]
            );

            return {
                produtos: resultados,
                total: countResult[0].total,
                page: page,
                limit: limit,
                totalPages: Math.ceil(countResult[0].total / limit)
            };
        } catch (erro) {
            return erro;
        }
    }

}

module.exports = { produtosModel };