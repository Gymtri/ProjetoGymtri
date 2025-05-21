const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");


router.get('/', (req, res)=>{
    res.render('pages/index')
})

router.get('/login', (req, res)=>{
    res.render('pages/login',{falha:null, listaErros:null})
})

router.get('/cadastro', (req, res)=>{
    res.render('pages/cadastro', {valores:{cep:'', logradouro:'', numero:'', complemento:''}})
})

router.get('/produtos', (req, res)=>{
    res.render('pages/produtos')
})

router.get("/usuario", usuarioController.listaUsuarios);

router.post('/aluno', usuarioController);

// Listar usuários
router.get("/", usuarioController.listaUsuarios);

// Exibir formulário de edição de perfil
router.get("/perfil", usuarioController.mostrarPerfil);

// Atualizar dados do perfil
router.post("/perfil", usuarioController.gravarPerfil);

// Criar novo usuário (opcional)
router.post("/criar", usuarioController.criarUsuario); // adicionar no controller

router.get("/usuario", usuarioController.listaUsuarios);

router.post('/aluno', usuarioController);

module.exports = router;
