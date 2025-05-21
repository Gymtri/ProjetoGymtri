const usuarioModel = require("../models/usuarioModel");
const {body, validationResult} = ('express-validator')
const bcrypt = require('bcryptjs') 
var salt = bcrypt.genSaltSync(12)
const{removeImg} = require('../public/img')
const fetch = (..args) => import('node-fetch').then(({default: fetch}) => fetch(..args))
const https = require('https');
const { header } = require("express-validator");


const usuarioController = {
    listaUsuarios: async (req, res) => {
        try {
            const usuarios = await usuarioModel.findAll();
            res.render("pages/usuarios", { usuarios });
        } catch (erro) {
            console.error("Erro ao buscar usuários:", erro);
            res.status(500).send("Erro no servidor");
        }
    },

    regrasValidacaoPerfil:[
        body('nome_usuario')
            .isLength({min:3, max:45})
            .whithMessage('Nome deve ter de 3 a 45 caracteres!'),
        body('email_usuario')
            .isEmail()
            .whithMessage('Digite um e-mail válido!'),
        body('telefo_usuario')
            .isLength({min:12, max:15})
            .whithMessage('Digite um telefone válido!'),
        body('cep')
            .isPortalCode('BR')
            .whithMessage('Digite um cep válido!'),
        body('numero')
            .isNumeric()
            .whithMessage('Digite um número para o endereço!'),
        verificarUsuarioAtualizado([1, 2, 3], 'pages/registro'),
    ],

    mostrarPerfil: async (req, res) => {
        try{
            let results = await usuario.findId(req.session.autenticado.id)
            if(results[0].cep != null){
                const httpsAgent = https.Agent({
                    rejectUnauthorized: false
                });
                const response = await fetch(`https://viacep.com.br/ws/${results[0].cep_usuario}/json/`,
                    {method: 'GET', headers: null, body: null, agent: httpsAgent,})
                var viaCep = await response.json()
                var cep = results[0].cep_usuario.slice(0,5)+ '-' +results[0].cep_usuario.slice(5)
            }else{
                var cep
            }
        },
    }
};



module.exports = usuarioController;
