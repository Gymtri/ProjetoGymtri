const usuarioModel = require("../models/usuarioModel");

const usuarioController = {
    listaUsuarios: async (req, res) => {
        try {
            const usuarios = await usuarioModel.findAll();
            res.render("pages/usuarios", { usuarios });
        } catch (erro) {
            console.error("Erro ao buscar usuários:", erro);
            res.status(500).send("Erro no servidor");
        }
    }
};

module.exports = usuarioController;
