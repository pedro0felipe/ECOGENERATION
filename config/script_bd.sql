-- ============================================================
-- EcoGeneration — Script de criação do banco de dados
-- Cria todas as tabelas usadas pelo sistema e cadastra os produtos da loja.
-- Execute este arquivo no MySQL Workbench ou PHPMyAdmin (MySQL 8).
-- ATENÇÃO: no Clever Cloud o banco já existe: omita as linhas CREATE DATABASE e USE.
--
-- Os arquivos migracao_*.sql servem só para atualizar um banco antigo;
-- para um banco novo, este arquivo basta.
-- ============================================================

CREATE DATABASE IF NOT EXISTS ecogeneration;
USE ecogeneration;

-- Contas de clientes. status_usuario: 0 = aguardando ativação, 1 = ativa, 2 = excluída (dados apagados)
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nome_usuario` varchar(100) NOT NULL,
  `email_usuario` varchar(100) NOT NULL,
  `senha_usuario` char(60) NOT NULL,
  `status_usuario` int DEFAULT '1',
  `cpf_usuario` varchar(14) DEFAULT NULL,
  `telefone_usuario` varchar(20) DEFAULT NULL,
  `cep_usuario` varchar(9) DEFAULT NULL,
  `numero_usuario` varchar(10) DEFAULT NULL,
  `complemento_usuario` varchar(100) DEFAULT NULL,
  `imagem_perfil_usuario` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uq_email_usuario` (`email_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Estrutura reservada para fornecedores (ainda sem tela no sistema)
CREATE TABLE IF NOT EXISTS `fornecedores` (
  `id_fornecedor` int NOT NULL AUTO_INCREMENT,
  `nome_fornecedor` varchar(100) NOT NULL,
  `email_fornecedor` varchar(100) NOT NULL,
  `cnpj_fornecedor` varchar(18) DEFAULT NULL,
  `status_fornecedor` int DEFAULT '1',
  PRIMARY KEY (`id_fornecedor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Catálogo. status_produto: 1 = à venda, 0 = removido da loja. tipo_energia e capacidade_energia alimentam o kit do diagnóstico
CREATE TABLE IF NOT EXISTS `produtos` (
  `id_produto` int NOT NULL AUTO_INCREMENT,
  `nome_produto` varchar(100) NOT NULL,
  `categoria_produto` varchar(50) NOT NULL,
  `preco_produto` decimal(10,2) NOT NULL,
  `descricao_produto` varchar(255) DEFAULT NULL,
  `estoque_produto` int DEFAULT '0',
  `imagem_produto` varchar(100) DEFAULT 'favicon2.png',
  `rota_produto` varchar(100) DEFAULT NULL,
  `tipo_energia` varchar(20) DEFAULT NULL,
  `capacidade_energia` decimal(7,1) DEFAULT NULL,
  `status_produto` int DEFAULT '1',
  `id_fornecedor` int DEFAULT NULL,
  PRIMARY KEY (`id_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Respostas do diagnóstico e perfil calculado (id_usuario nulo = visitante)
CREATE TABLE IF NOT EXISTS `diagnosticos` (
  `id_diagnostico` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `frequencia` varchar(50) DEFAULT NULL,
  `impacto` varchar(50) DEFAULT NULL,
  `preparacao` varchar(50) DEFAULT NULL,
  `prioridade` varchar(50) DEFAULT NULL,
  `tolerancia` varchar(50) DEFAULT NULL,
  `nivel_autonomia` varchar(20) NOT NULL,
  PRIMARY KEY (`id_diagnostico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Pedidos do Checkout Pro. status_pedido: aguardando_pagamento, pago, enviado, entregue, cancelado
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `data_pedido` datetime DEFAULT CURRENT_TIMESTAMP,
  `total_pedido` decimal(10,2) NOT NULL,
  `status_pedido` varchar(30) NOT NULL DEFAULT 'aguardando_pagamento',
  `status_pagamento` varchar(30) NOT NULL DEFAULT 'pendente',
  `id_pagamento` varchar(40) DEFAULT NULL,
  `id_preferencia` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `idx_pedidos_usuario` (`id_usuario`),
  CONSTRAINT `fk_pedidos_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Itens de cada pedido, com nome e preço do momento da compra
CREATE TABLE IF NOT EXISTS `itens_pedido` (
  `id_item` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int NOT NULL,
  `id_produto` int NOT NULL,
  `nome_produto` varchar(100) NOT NULL,
  `imagem_produto` varchar(100) DEFAULT 'favicon2.png',
  `preco_unitario` decimal(10,2) NOT NULL,
  `quantidade` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_item`),
  KEY `idx_itens_pedido` (`id_pedido`),
  KEY `fk_itens_produto` (`id_produto`),
  CONSTRAINT `fk_itens_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE,
  CONSTRAINT `fk_itens_produto` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Carrinho salvo na conta de quem está logado
CREATE TABLE IF NOT EXISTS `carrinho_itens` (
  `id_usuario` int NOT NULL,
  `id_produto` int NOT NULL,
  `quantidade` int NOT NULL DEFAULT '1',
  `atualizado_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`,`id_produto`),
  KEY `fk_carrinho_produto` (`id_produto`),
  CONSTRAINT `fk_carrinho_produto` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id_produto`) ON DELETE CASCADE,
  CONSTRAINT `fk_carrinho_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- Produtos da loja (20 itens)
-- ============================================================
INSERT INTO produtos (nome_produto, categoria_produto, preco_produto, descricao_produto, estoque_produto, imagem_produto, rota_produto, tipo_energia, capacidade_energia, status_produto) VALUES
  ('Ventilador Solar', 'entrada', '99.90', 'Ventilação eficiente com baixo consumo de energia.\n\n- Potência: 15W\n- Alimentação: energia solar\n- Compatível com instalação simples e prática', 10, 'ventilador.png', '/ventiladorsolar', 'ventilador', '4.0', 1),
  ('Painel Solar Dobrável', 'entrada', '89.90', 'Captação eficiente de energia com design portátil e sustentável.\n\n- Potência: 15W\n- Tipo: painel solar dobrável\n- Fácil de transportar e armazenar', 10, 'dobravel.png', '/painel-solar', 'painel', NULL, 1),
  ('Powerbank Solar', 'entrada', '39.90', 'Carregamento prático e sustentável em qualquer lugar.\n- Capacidade: variável\n- Alimentação: energia solar\n- Ideal para dispositivos móveis', 10, 'carregadoraluzsolar.png', '/powerbank', 'bateria_usb', '37.0', 1),
  ('Kit Energia Solar Portátil', 'entrada', '144.90', 'Energia limpa e portátil para diversas aplicações.\n- Potência: variável\n- Sistema completo e fácil de usar\n- Ideal para uso externo e emergências', 10, 'kitenergiasolarportatil.png', '/kitenergiasolarportatil', 'bateria_usb', '40.0', 1),
  ('Luminária Solar Refletora', 'entrada', '50.00', 'Iluminação potente com economia de energia.\n- Potência: variável\n- Alimentação: energia solar\n- Ideal para áreas externas', 10, 'lumi.png', '/lumi', 'luz', '8.0', 1),
  ('Mini Ventilador USB', 'entrada', '49.90', 'Ventilação compacta e prática para o dia a dia.\n- Alimentação: USB\n- Portátil e leve\n- Ideal para uso pessoal', 10, 'miniventilador.png', '/miniventilador', 'ventilador', '3.0', 1),
  ('Lâmpada Solar', 'entrada', '49.90', 'Iluminação prática e sustentável para um cômodo quando a luz cai.\n\n- Alimentação: energia solar\n- Lâmpada integrada\n- Portátil e leve', 10, 'lampadacompainel.png', '/lampadasolar', 'luz', '6.0', 1),
  ('Painel Solar 340W ZTROON', 'medio', '459.90', 'Alta geração de energia com excelente desempenho.\n- Potência: 340W\n- Alta eficiência\n- Ideal para sistemas residenciais e comerciais', 10, 'painelsolarmedio.png', '/painel-solar', 'painel', NULL, 1),
  ('Carregador USB Solar', 'medio', '89.90', 'Carregador solar com saída USB para manter o celular funcionando durante as quedas de energia.\n- Alimentação: energia solar\n- Saída: USB\n- Ideal para celulares e fones', 10, 'powerbankportatil.png', '/carregador', 'bateria_usb', '30.0', 1),
  ('Luminária Solar Média', 'medio', '149.90', 'Iluminação equilibrada para uso externo.\n- Potência: média\n- Alimentação: energia solar\n- Ideal para jardins e áreas abertas', 10, 'luminariasolar.png', '/luminaria', 'luz', '10.0', 1),
  ('Mini Painel Solar', 'medio', '249.90', 'Geração de energia em tamanho compacto.\n- Potência: variável\n- Portátil e leve\n- Ideal para pequenos dispositivos', 10, 'minipainel.png', '/painel-solar', 'painel', NULL, 1),
  ('Ventilador Solar Médio', 'medio', '199.90', 'Ventilação eficiente com energia sustentável.\n- Potência: média\n- Alimentação: energia solar\n- Ideal para ambientes internos e externos', 10, 'ventiladormedio.png', '/ventilador', 'ventilador', '6.0', 1),
  ('Estação de Energia Solar Média', 'medio', '349.90', 'Fonte confiável de energia portátil.\n- Capacidade: média\n- Múltiplas saídas\n- Ideal para viagens e emergências', 10, 'estacaoavancada.png', '/carregador', 'bateria', '150.0', 1),
  ('Kit Energia Solar Médio', 'medio', '399.90', 'Kit com bateria e placa solar para manter luz, celular e Wi-Fi funcionando por algumas horas.\n- Capacidade: média\n- Recarga por energia solar\n- Bom custo-benefício', 10, 'kitmedioo.png', '/kitenergiasolarportatil', 'bateria', '250.0', 1),
  ('Estação de Energia Portátil 300W', 'avancado', '2159.00', 'Energia portátil com alto desempenho.\n- Potência: 300W\n- Múltiplas conexões\n- Ideal para equipamentos eletrônicos', 10, 'estacaoavancada.png', '/carregador', 'bateria', '288.0', 1),
  ('Bluetti EB3A Painel Solar SP120L', 'avancado', '3159.00', 'Sistema portátil potente e eficiente.\n- Potência: 600W (pico)\n- Carregamento solar integrado\n- Ideal para uso externo e emergências', 10, 'estacaoavancada.png', '/carregador', 'bateria', '268.0', 1),
  ('Gerador Solar 600-1200W', 'avancado', '4999.00', 'Energia confiável para diversas aplicações.\n- Potência: 600 a 1200W\n- Portátil e eficiente\n- Ideal para uso doméstico e externo', 10, 'geradorzao.png', '/carregador', 'bateria', '1000.0', 1),
  ('Ecoflow River 3 Placa Solar 60W', 'avancado', '2754.05', 'Solução portátil moderna e eficiente.\n- Potência: 300W (base)\n- Carregamento solar\n- Ideal para viagens e backup de energia', 10, 'dobravel.png', '/carregador', 'bateria', '245.0', 1),
  ('Estação de Energia Solar Avançada', 'avancado', '3499.90', 'Máxima eficiência e tecnologia em energia portátil.\n- Alta capacidade\n- Múltiplas funções\n- Ideal para uso profissional e doméstico', 10, 'estacaoavancada.png', '/carregador', 'bateria', '512.0', 1),
  ('Kit 2x Painel Solar Ecoflow 125W', 'avancado', '2299.00', 'Geração de energia eficiente com portabilidade e alto desempenho.\n\n- Potência total: 250W (2x 125W)\n- Tipo: painéis solares dobráveis\n- Ideal para uso externo, viagens e emergências', 10, 'placamil.png', '/carregador', 'painel', NULL, 1);
