const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const pool = require("./config/pool_conexoes");
const session = require("express-session");
const app = express();
 
app.use('/simple-notify', express.static(path.join(__dirname, 'node_modules/simple-notify/dist')));
// ESSENCIAL para o Render (proxy reverso com HTTPS)
app.set("trust proxy", 1);
 
app.use(express.static(path.join(__dirname, "app/public")));
app.use(express.static(path.join(__dirname, "app/admin/public")));
 
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "app/views/pages"),
  path.join(__dirname, "app/views/admin")
]);
 
app.set("trust proxy", 1);

app.use(session({
  secret: process.env.SESSION_SECRET || 'ecogeneration-secret-key',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));
 
// Middleware global — disponibiliza dados da sessão para TODAS as views
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.usuarioLogado = req.session && req.session.usuarioLogado;
  res.locals.usuarioNome = req.session && req.session.usuarioNome || '';
  res.locals.adminLoggedIn = req.session && req.session.adminLoggedIn;
  next();
});
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
const rota = require("./app/routes/router");
app.use("/", rota);
 
const porta = process.env.APP_PORT || 3000;
app.listen(porta, () => {
  console.log(`Servidor online!\n http://localhost:${porta}`);
});