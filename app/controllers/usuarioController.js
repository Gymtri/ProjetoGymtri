// controllers/usuarioController.js

const usuarioModel = require("../models/usuarioModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(12);
//const { removeImg } = require("../public/img");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const https = require("https");

const usuarioController = {
  cadastrarAluno: async (req, res) => {
    try {
      const { nome_usuario, email_usuario, senha_usuario, telefone_usuario } = req.body;

      // Validação simples
      if (!nome_usuario || !email_usuario || !senha_usuario || !telefone_usuario) {
        return res.status(400).send("Todos os campos são obrigatórios.");
      }

      // Criptografar a senha
      const senhaCriptografada = bcrypt.hashSync(senha_usuario, salt);

      // Montar objeto de dados
      const novoUsuario = {
        nome_usuario,
        email_usuario,
        senha_usuario: senhaCriptografada,
        telefone_usuario,
        tipo: "aluno", // Ou outro valor conforme seu banco
      };

      // Salvar no banco
      await usuarioModel.create(novoUsuario);

      res.status(201).send("Aluno cadastrado com sucesso!");
    } catch (erro) {
      console.error("Erro ao cadastrar aluno:", erro);
      res.status(500).send("Erro no servidor ao cadastrar aluno.");
    }
  },


  // Listar todos os usuários
  listaUsuarios: async (req, res) => {
    try {
      const usuarios = await usuarioModel.findAll();
      res.render("pages/usuarios", { usuarios });
    } catch (erro) {
      console.error("Erro ao buscar usuários:", erro);
      res.status(500).send("Erro no servidor");
    }
  },

  // Validações para atualização de perfil
  regrasValidacaoPerfil: [
    body("nome_usuario")
      .isLength({ min: 3, max: 45 })
      .withMessage("Nome deve ter de 3 a 45 caracteres!"),
    body("email_usuario")
      .isEmail()
      .withMessage("Digite um e-mail válido!"),
    body("telefone_usuario")
      .isLength({ min: 12, max: 15 })
      .withMessage("Digite um telefone válido!"),
    body("cep")
      .isPostalCode("BR")
      .withMessage("Digite um CEP válido!"),
    body("numero")
      .isNumeric()
      .withMessage("Digite um número para o endereço!"),
    // verificarUsuarioAtualizado(...) função precisa ser definida/importada se for usada
  ],

  // Exibir o perfil do usuário
  mostrarPerfil: async (req, res) => {
    try {
      let results = await usuarioModel.findId(req.session.autenticado.id);
      let viaCep = { cep: "", logradouro: "", numero: "", complemento: "" };
      let cep = null;

      if (results[0].cep_usuario) {
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        const response = await fetch(`https://viacep.com.br/ws/${results[0].cep_usuario}/json/`, {
          method: "GET",
          headers: null,
          body: null,
          agent: httpsAgent,
        });
        viaCep = await response.json();
        cep = results[0].cep_usuario.slice(0, 5) + "-" + results[0].cep_usuario.slice(5);
      }

      const campos = {
        nome_usuario: results[0].nome_usuario,
        email_usuario: results[0].email_usuario,
        telefone_usuario: results[0].telefone_usuario,
        cep: cep,
        numero: results[0].numero_usuario,
        complemento: results[0].complemento_usuario,
        logradouro: viaCep.logradouro,
        bairro: viaCep.bairro,
        localidade: viaCep.localidade,
        img_perfil_pasta: results[0].img_perfil_pasta,
        img_perfil_banco:
          results[0].img_perfil_banco != null
            ? `data:image/jpeg;base64,${results[0].img_perfil_banco.toString("base64")}`
            : null,
      };

      res.render("pages/perfil", {
        listaErros: null,
        dadosNotificacao: null,
        valores: campos,
      });
    } catch (e) {
      console.log(e);
      res.render("pages/perfil", {
        listaErros: null,
        dadosNotificacao: null,
        valores: {
          nome_usuario: "",
          email_usuario: "",
          telefone_usuario: "",
          senha_usuario: "",
          cep: "",
          numero: "",
          complemento: "",
          logradouro: "",
          bairro: "",
          localidade: "",
          img_perfil_banco: "",
          img_perfil_pasta: "",
        },
      });
    }
  },

  // Gravar alterações do perfil
  gravarPerfil: async (req, res) => {
    const erros = validationResult(req);
    const erroMulter = req.session.erroMulter;

    if (!erros.isEmpty() || erroMulter != null) {
      const lista = !erros.isEmpty() ? erros : { formatter: null, errors: [] };
      if (erroMulter) lista.errors.push(erroMulter);

      return res.render("pages/perfil", {
        listaErros: lista,
        dadosNotificacao: null,
        valores: req.body,
      });
    }

    try {
      let dadosForm = {
        nome_usuario: req.body.nome_usuario,
        email_usuario: req.body.email_usuario,
        telefone_usuario: req.body.telefone_usuario,
        cep_usuario: req.body.cep.replace("-", ""),
        numero_usuario: req.body.numero,
        complemento_usuario: req.body.complemento,
        img_perfil_banco: req.session.autenticado.img_perfil_banco,
        img_perfil_pasta: req.session.autenticado.img_perfil_pasta,
      };

      if (req.body.senha_usuario !== "") {
        dadosForm.senha_usuario = bcrypt.hashSync(req.body.senha_usuario, salt);
      }

      if (req.file) {
        const caminhoArquivo = "publico/img" + req.file.filename;
        if (dadosForm.img_perfil_pasta !== caminhoArquivo) {
          removeImg(dadosForm.img_perfil_pasta);
        }
        dadosForm.img_perfil_pasta = caminhoArquivo;
        dadosForm.img_perfil_banco = req.file.buffer;
        removeImg(dadosForm.img_perfil_pasta);
        dadosForm.img_perfil_pasta = null;
      }

      const resultUpdate = await usuarioModel.update(dadosForm, req.session.autenticado.id);

      if (resultUpdate && resultUpdate.changedRows === 1) {
        const result = await usuarioModel.findId(req.session.autenticado.id);
        const autenticado = {
          autenticado: result[0].nome_usuario,
          id: result[0].id_usuario,
          tipo: result[0].tipo,
          img_perfil_banco:
            result[0].img_perfil_banco != null
              ? `data:image/jpeg;base64,${result[0].img_perfil_banco.toString("base64")}`
              : null,
          img_perfil_pasta: result[0].img_perfil_pasta,
        };
        req.session.autenticado = autenticado;

        const campos = {
          nome_usuario: result[0].nome_usuario,
          email_usuario: result[0].email_usuario,
          telefone_usuario: result[0].telefone_usuario,
          cep: req.body.cep,
          numero: result[0].numero_usuario,
          complemento: result[0].complemento_usuario,
          logradouro: "",
          bairro: "",
          localidade: "",
          img_perfil_pasta: result[0].img_perfil_pasta,
          img_perfil_banco: result[0].img_perfil_banco,
          senha_usuario: "",
        };

        res.render("pages/perfil", {
          listaErros: null,
          dadosNotificacao: {
            titulo: "Perfil atualizado com sucesso!",
            mensagem: "Alterações gravadas",
            tipo: "Sucesso",
          },
          valores: campos,
        });
      } else {
        res.render("pages/perfil", {
          listaErros: null,
          dadosNotificacao: {
            titulo: "Perfil atualizado com sucesso!",
            mensagem: "Sem alterações",
            tipo: "Sucesso",
          },
          valores: dadosForm,
        });
      }
    } catch (e) {
      console.log(e);
      res.render("pages/perfil", {
        listaErros: erros,
        dadosNotificacao: {
          titulo: "Erro ao atualizar o perfil!",
          mensagem: "Verifique os valores digitados!",
          tipo: "error",
        },
        valores: req.body,
      });
    }
  },
};

module.exports = usuarioController;