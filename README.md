# EcoGeneration

Plataforma de autonomia energética portátil, desenvolvida como Trabalho de Conclusão de Curso do técnico em Informática para Internet.

A pessoa responde a um diagnóstico rápido sobre as quedas de energia na sua região e sobre o que precisa manter ligado (celular, luz, ventilador, Wi-Fi, notebook). O sistema calcula o perfil dela e monta um kit de produtos portáteis dentro do orçamento informado, explicando em frases quanto tempo cada aparelho funciona. O kit pode ir direto para o carrinho e ser pago pelo Mercado Pago.

O EcoGeneration não substitui a rede elétrica: o objetivo é manter o essencial funcionando durante as quedas.

> Projeto acadêmico. Os produtos são ilustrativos e os pagamentos usam o ambiente de teste do Mercado Pago.

Site publicado: https://ecogeneration-final-4hh3.onrender.com

## Funcionalidades

- **Conta:** cadastro com validação, ativação por e-mail (link com JWT de 24 h), login, recuperação de senha (link de 1 h e de uso único), perfil com foto e endereço pelo CEP (ViaCEP), exclusão de conta com remoção dos dados pessoais.
- **Diagnóstico:** 6 perguntas, perfil de autonomia e kit recomendado dentro do orçamento, com alternativa quando o orçamento não basta.
- **Loja:** catálogo paginado, busca, página do produto, carrinho guardado na sessão e na conta.
- **Pagamento:** Mercado Pago Checkout Pro. O preço vem sempre do banco, o estoque fica reservado durante o pagamento e o resultado é conferido na API do Mercado Pago.
- **Painel do administrador:** produtos (com tipo de energia e capacidade usados no diagnóstico), pedidos com endereço de entrega e regras de status, usuários e diagnósticos.

## Tecnologias

| Parte | Tecnologia |
|---|---|
| Servidor | Node.js 24 e Express 5 |
| Páginas | EJS, HTML, CSS e JavaScript |
| Banco | MySQL 8 com `mysql2` (pool de conexões) |
| Sessão e segurança | `express-session`, `bcryptjs`, `jsonwebtoken`, `express-validator`, `express-rate-limit` |
| Upload de imagens | Multer |
| Serviços externos | Mercado Pago (SDK `mercadopago`), Brevo (e-mail), ViaCEP |
| Hospedagem | Render (aplicação) e Clever Cloud (MySQL) |

## Estrutura (MVC)

```
app.js                  configuração do Express, sessão, flash, rotas e erros
config/
  pool_conexoes.js      pool de conexões com o MySQL
  script_bd.sql         cria o banco do zero, com os produtos
  migracao_*.sql        atualizações de bancos antigos
app/
  routes/               rotas por assunto (+ router.js, que junta todas)
  controllers/          recebem a requisição e coordenam model e view
  models/               acesso ao banco e regras de negócio
  views/                páginas EJS (pages, admin e partials)
  middlewares/          login obrigatório, acesso de admin, flash, upload, limite de tentativas
  services/             Mercado Pago e envio de e-mails
  helpers/              tokens JWT, sessão, imagens, validações
  public/               CSS, JavaScript do navegador, imagens, robots.txt e sitemap.xml
```

Regras de negócio importantes ficam no Model:

- `models/diagnosticoRegras.js`: perfil de autonomia e montagem do kit;
- `models/carrinho.js`: carrinho na sessão e na conta;
- `models/pedidosModel.js`: criação de pedidos com reserva de estoque em transação, cancelamento e regras de status.

## Como rodar

Requisitos: Node.js 20 ou mais novo e um MySQL 8.

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o banco executando `config/script_bd.sql` no MySQL (Workbench, phpMyAdmin ou linha de comando). Ele cria as tabelas e cadastra os produtos. No Clever Cloud, o banco já existe: rode o script sem as linhas `CREATE DATABASE` e `USE`.

3. Copie `.env.example` para `.env` e preencha:

   | Variável | Para que serve |
   |---|---|
   | `APP_PORT`, `APP_BASE_URL` | Porta local e endereço do site (usado nos links de e-mail e no retorno do pagamento) |
   | `NODE_ENV` | `production` no Render, para o cookie de sessão exigir HTTPS |
   | `SESSION_SECRET`, `JWT_SECRET` | Segredos da sessão e dos tokens |
   | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Conexão com o MySQL |
   | `DB_CONNECTION_LIMIT` | Máximo de conexões do pool (o Clever Cloud permite 5 no total) |
   | `ADMIN_USER`, `ADMIN_PASS` | Login do painel do administrador |
   | `EMAIL_PROVIDER`, `BREVO_API_KEY`, `EMAIL_FROM` | Envio dos e-mails de ativação e de senha |
   | `MP_ACCESS_TOKEN` | Credencial do vendedor de teste do Mercado Pago |

   O `.env` nunca vai para o Git. Sem `SESSION_SECRET`, `JWT_SECRET` ou os dados do banco, o servidor não inicia.

4. Inicie:

   ```bash
   npm start
   ```

   O site abre em `http://localhost:3000` e o painel em `/admin-login`.

## Testar o pagamento

O Mercado Pago é usado com contas de teste (vendedor e comprador), como no material da disciplina.

1. Abra o site numa janela anônima e entre com uma conta do EcoGeneration.
2. Coloque produtos no carrinho e clique em **Finalizar compra** e depois em **Pagar com Mercado Pago**.
3. No Mercado Pago, entre com o **comprador de teste** e pague com um cartão de teste. O nome do titular define o resultado: `APRO` aprova, `CONT` deixa pendente e `OTHE` recusa.
4. Ao voltar, o pedido aparece em **Meus Pedidos** e no painel do administrador.

## Publicação

O Render publica automaticamente a branch `main` do repositório principal. As variáveis do `.env` são cadastradas em **Environment** no Render, com `APP_BASE_URL` igual ao endereço do site. No plano gratuito, o servidor "dorme" sem acesso e leva cerca de 30 segundos para responder na primeira visita.

## Decisões de projeto

- **Administrador único no `.env`:** o painel tem um único administrador, com credenciais comparadas em tempo constante, em vez de níveis de acesso na tabela de usuários.
- **Checkout por link:** o botão "Pagar com Mercado Pago" leva direto à página do Checkout Pro, sem o botão do SDK (Wallet Brick). A preferência de pagamento continua sendo criada no servidor.
- **Diagnóstico como estimativa:** o kit é calculado com consumos médios de cada aparelho e capacidades informadas no cadastro do produto. Serve para orientar a compra, não é um projeto elétrico.

## Limitações conhecidas

- Frete e prazo de entrega ainda não são calculados.
- Imagens enviadas pelo painel ficam no disco do servidor, que o Render apaga a cada publicação.
- A sessão fica na memória do servidor: todos saem da conta quando o site é publicado de novo.
