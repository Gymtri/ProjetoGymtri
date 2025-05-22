const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// Página inicial
router.get('/', (req, res) => {
    res.render('pages/index');
});

// Página de login
router.get('/login', (req, res) => {
    res.render('pages/login', { falha: null, listaErros: null });
});

// Página de cadastro
router.get('/cadastro', (req, res) => {
    res.render('pages/cadastro', {
        valores: {
            cep: '',
            logradouro: '',
            numero: '',
            complemento: ''
        }
    });
});

// Página de produtos
router.get('/produtos', (req, res) => {
    res.render('pages/produtos');
});

exports.cadastrarAluno = (req, res) => {
    console.log(req.body); // Veja o que está chegando

    res.send('Recebido!');
};

// Listar usuários
//router.get("/usuario", usuarioController.listaUsuarios); // Função de listagem

// Exibir perfil do usuário
//router.get("/perfil", usuarioController.mostrarPerfil); // Função para mostrar perfil

// Gravar alterações do perfil
//router.post("/perfil", usuarioController.gravarPerfil); // Função para gravar perfil

// Criar novo usuário
//router.post("/criar", usuarioController.criarUsuario); // Supondo que você tenha a função de criar usuário no controller

// Cadastro de aluno (verifique se a função existe em usuarioController)
router.post('/aluno',  usuarioController.cadastrarAluno); // Função para cadastro de aluno

module.exports = router;
