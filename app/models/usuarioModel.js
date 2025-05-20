const pool = require("../../config/pool_conexoes");

const usuarioModel = {
    findAll: async () => {
        try {
            const [resultados] = await pool.query(
                `SELECT * FROM USUARIO u
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
