# 🛠️ GUIA DE IMPLEMENTAÇÃO — MELHORIAS PARA PRÉ-BANCA

## 1️⃣ ADICIONAR MÁSCARAS DE CPF, CNPJ, TELEFONE, RG

### Instalação
```bash
npm install cleave.js
```

### Arquivo: `app/public/js/mascaras.js` (novo)

```javascript
// Máscaras para formulários
document.addEventListener('DOMContentLoaded', function() {
  // CPF: ###.###.###-##
  const cpfInputs = document.querySelectorAll('input[data-mask="cpf"]');
  cpfInputs.forEach(input => {
    new Cleave(input, {
      blocks: [3, 3, 3, 2],
      delimiters: ['.', '.', '-'],
      numericOnly: true
    });
  });

  // CNPJ: ##.###.###/####-##
  const cnpjInputs = document.querySelectorAll('input[data-mask="cnpj"]');
  cnpjInputs.forEach(input => {
    new Cleave(input, {
      blocks: [2, 3, 3, 4, 2],
      delimiters: ['.', '.', '/', '-'],
      numericOnly: true
    });
  });

  // Telefone: (##) #####-####
  const phoneInputs = document.querySelectorAll('input[data-mask="phone"]');
  phoneInputs.forEach(input => {
    new Cleave(input, {
      blocks: [0, 2, 5, 4],
      delimiters: ['(', ') ', '-'],
      numericOnly: true
    });
  });

  // RG: #.###.###-##
  const rgInputs = document.querySelectorAll('input[data-mask="rg"]');
  rgInputs.forEach(input => {
    new Cleave(input, {
      blocks: [1, 3, 3, 2],
      delimiters: ['.', '.', '-'],
      numericOnly: true
    });
  });
});
```

### Validações Backend: `app/routes/router.js`

Adicionar essas funções de validação:

```javascript
// Validadores de CPF/CNPJ
const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11) return false;
  
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
};

const validarCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]/g, '');
  if (cnpj.length !== 14) return false;
  
  if (cnpj === '00000000000000') return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(1))) return false;

  return true;
};

// Usar nas rotas:
router.post('/cadastro',
  [
    check('nome').notEmpty().withMessage('Nome é obrigatório'),
    check('email').isEmail().withMessage('Email inválido'),
    check('cpf').optional().custom(validarCPF).withMessage('CPF inválido'),
    check('cnpj').optional().custom(validarCNPJ).withMessage('CNPJ inválido'),
    check('telefone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido'),
  ],
  // ... resto da rota
);
```

---

## 2️⃣ ADICIONAR KEYWORDS META TAG

### Em cada arquivo `.ejs`

```html
<meta name="keywords" content="energia solar, sustentabilidade, autonomia energética, produtos portáteis, diagnóstico energético">
<meta name="description" content="Descubra sua autonomia energética e compre produtos solares portáteis para uma vida mais sustentável.">
```

**Exemplo em `app/views/pages/ecoloja.ejs`:**

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="keywords" content="produtos solares, loja online, energia renovável, painéis solares portáteis, kits solares">
  <meta name="description" content="Lâmpadas, ventiladores, painéis e kits solares portáteis. Soluções para sua autonomia energética.">
  <title>EcoLoja — Produtos de Energia Solar | EcoGeneration</title>
  <!-- ... resto do head -->
</head>
```

---

## 3️⃣ CRIAR DOCUMENTAÇÃO DE MARKETING

### Arquivo: `MARKETING.md` (novo)

```markdown
# 📊 PLANO DE MARKETING E MONETIZAÇÃO — ECOGENERATION

## Visão Geral
EcoGeneration é uma plataforma que combina educação sobre autonomia energética com e-commerce de produtos sustentáveis.

## Modelo de Negócio

### 1. **E-Commerce (Principal)**
- **Margem:** 30-40% por produto
- **Público:** Consumidores conscientes, famílias, pequenos negócios
- **Categorias:** Entrada, Médio, Avançado
- **Foco:** Qualidade e confiança

### 2. **Monetização Futura**
- **Premium Diagnostics:** Acesso a relatórios detalhados (R$9,90/mês)
- **Consultoria:** Propostas personalizadas (comissão 10%)
- **Publicidade:** Marcas sustentáveis (CPM ou CPC)
- **Parcerias:** Afiliados de marcas parceiras

## Palavras-Chave Estratégicas
- Energia solar portátil
- Autonomia energética
- Sustentabilidade
- Produtos eco-friendly
- Kits solares
- Gerador portátil
- Energia renovável

## Público-Alvo
- Faixa etária: 25-55 anos
- Poder aquisitivo: Médio-Alto
- Interesse: Sustentabilidade, tecnologia
- Localização: Brasil (online)

## Canais de Marketing
1. **SEO:** Otimização para "energia solar portátil"
2. **Social Media:** Instagram, TikTok (lifestyle sustentável)
3. **Email Marketing:** Newsletter com dicas de energia
4. **Influencers:** Parcerias com creators eco-friendly
5. **Publicidade Digital:** Google Ads, Meta Ads

## KPIs
- CTR (Click-through rate): >3%
- Conversão: >2%
- AOV (Average Order Value): R$ 300+
- CAC (Customer Acquisition Cost): <R$ 80

## Diferenciais
✨ Diagnóstico gratuito e personalizado  
✨ Educação sobre autonomia energética  
✨ Curadoria de produtos de qualidade  
✨ Comunidade de usuários sustentáveis  
✨ Blog com artigos educativos  

---
*Plano atualizado: 25/05/2026*
```

---

## 4️⃣ CRIAR README.md COMPLETO

### Arquivo: `README.md` (novo)

```markdown
# EcoGeneration ⚡🌱

Autonomia Energética para Todos

> Descubra seu nível de autonomia energética e compre soluções solares portáteis com confiança.

## 🎯 Sobre o Projeto

**EcoGeneration** é uma plataforma educacional e comercial que:
- 📊 Oferece diagnóstico gratuito de autonomia energética
- 🛒 Comercializa produtos solares portáteis de qualidade
- 📚 Educa sobre sustentabilidade e energia renovável
- 👥 Cria comunidade de pessoas conscientes

## ✨ Funcionalidades

### Público
- ✅ Homepage com informações
- ✅ Diagnóstico rápido (5 perguntas)
- ✅ EcoLoja com 3 categorias de produtos
- ✅ Detalhes de produtos
- ✅ Carrinho e checkout
- ✅ Perfil de usuário com histórico
- ✅ Autenticação e registro

### Admin
- ✅ Painel de controle
- ✅ Gerenciamento de produtos (CRUD)
- ✅ Gerenciamento de usuários
- ✅ Visualização de diagnósticos
- ✅ Histórico de compras

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js 16+
- MySQL 8+
- npm ou yarn

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/usuario/ecogeneration.git
   cd ecogeneration
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite .env com suas credenciais
   ```

4. **Configure o banco de dados**
   ```bash
   mysql -u root -p < config/script_bd.sql
   ```

5. **Inicie o servidor**
   ```bash
   npm start
   # Servidor rodando em http://localhost:3000
   ```

## 🛠️ Tecnologias

- **Backend:** Node.js + Express
- **Frontend:** EJS + Vanilla JS
- **Banco de Dados:** MySQL
- **Validação:** express-validator
- **Sessões:** express-session
- **Deploy:** Render.com

## 📁 Estrutura do Projeto

```
ecogeneration/
├── app/
│   ├── admin/           # Painel administrativo
│   ├── models/          # Modelos de dados
│   ├── routes/          # Rotas da aplicação
│   ├── public/          # Arquivos estáticos
│   └── views/           # Templates EJS
├── config/              # Configurações
├── package.json         # Dependências
└── app.js              # Arquivo principal
```

## 📋 CRUD Implementado

| Entidade | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Usuários | ✅ | ✅ | ✅ | ✅ |
| Produtos | ✅ | ✅ | ✅ | ✅ |
| Diagnósticos | ✅ | ✅ | — | ✅ |
| Compras | ✅ | ✅ | — | — |

## 🎨 Design & UX

- Design responsivo (mobile-first)
- Modo escuro/claro
- Tags semânticas HTML5
- Acessibilidade WCAG
- Performance otimizada

## 🔒 Segurança

- Validações no frontend e backend
- Proteção de rotas com autenticação
- Senhas com hash
- Sessões seguras
- SQL Injection prevention

## 📊 SEO

- Open Graph tags
- Twitter Cards
- Meta descriptions
- URLs amigáveis
- Schema.org microdata

## 👨‍💼 Autor

- **Pedro Felipe** - Desenvolvimento Completo

## 📄 Licença

ISC License

## 🤝 Contribuindo

Sugestões são bem-vindas! Abra uma issue ou faça um pull request.

## 📞 Contato

- 🌐 [Website](https://ecogeneration.com.br)
- 📧 contato@ecogeneration.com.br
- 📱 [@ecogeneration_oficial](https://instagram.com/ecogeneration)

---

**Desenvolvido com ❤️ para um planeta mais sustentável** 🌍
```

---

## 📋 Checklist de Implementação

- [ ] Instalar `cleave.js` com npm
- [ ] Criar arquivo `app/public/js/mascaras.js`
- [ ] Importar cleave.js em todas as views com formulários
- [ ] Adicionar validadores de CPF/CNPJ no router
- [ ] Adicionar campos CPF/CNPJ/Telefone/RG nas views de cadastro
- [ ] Adicionar `<meta name="keywords">` em todas as páginas
- [ ] Criar arquivo `MARKETING.md`
- [ ] Criar arquivo `README.md`
- [ ] Testar máscaras no navegador
- [ ] Testar validações no backend
- [ ] Commit e push das alterações

---

## ⏱️ Tempo Estimado

- Máscaras: 30 minutos
- Validações: 20 minutos
- Keywords: 15 minutos
- Documentação: 45 minutos
- **Total: ~2 horas**

---

*Guia de implementação criado: 25/05/2026*
