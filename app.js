const express = require("express")
const app = express()
const env = require("dotenv").config()
const session = require("express-session")
const path = require('path')

// Sessão
app.use(session({
    secret: "chaveparacriptografia",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Middleware de arquivos estáticos
app.use(express.static("./app/public"));

// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", "./app/views");

// Middleware de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROTAS
const rotaPrincipal = require("./app/routes/router"); // <- Certifique-se que o caminho está certo
app.use("/", rotaPrincipal);

// Arquivos estáticos (CSS, JS, imagens etc.)
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas
const alunoRoutes = require('./app/routes/aluno');
app.use('/', alunoRoutes);

app.listen(process.env.APP_PORT || 3000, () => {
    console.log(`Servidor rodando em http://localhost:${process.env.APP_PORT || 3000}`);
});