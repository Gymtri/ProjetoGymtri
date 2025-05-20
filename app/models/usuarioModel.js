const pool = require("../../config/pool_conexoes");

const usuarioModel = {
    findAll: async () => {
        try {
            const [resultados] = await pool.query(
                `SELECT * FROM usuario u
                 JOIN tipo_usuario t ON t.id_tipo_usuario = u.tipo_usuario
                 WHERE u.status_usuario = 1`
            );
            return resultados;
        } catch (erro) {
            console.log("Erro no findAll:", erro);
            return [];
        }
    }
};

module.exports = usuarioModel;
