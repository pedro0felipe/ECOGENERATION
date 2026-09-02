-- ============================================================
-- EcoGeneration — Script de criação do banco de dados
-- Execute este arquivo no MySQL Workbench ou PHPMyAdmin
-- ATENÇÃO: No Clever Cloud, omita as linhas CREATE DATABASE e USE
-- ============================================================

CREATE DATABASE IF NOT EXISTS ecogeneration;
USE ecogeneration;

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario           INT           NOT NULL AUTO_INCREMENT,
  nome_usuario         VARCHAR(100)  NOT NULL,
  email_usuario        VARCHAR(100)  NOT NULL,
  senha_usuario        VARCHAR(255)  NOT NULL,
  cpf_usuario          VARCHAR(14)   DEFAULT NULL,
  telefone_usuario     VARCHAR(20)   DEFAULT NULL,
  cep_usuario          VARCHAR(9)    DEFAULT NULL,
  numero_usuario       VARCHAR(10)   DEFAULT NULL,
  complemento_usuario  VARCHAR(100)  DEFAULT NULL,
  imagem_perfil_usuario VARCHAR(255) DEFAULT NULL,
  status_usuario       INT           DEFAULT 1,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_email_usuario (email_usuario)
);

CREATE TABLE IF NOT EXISTS produtos (
  id_produto        INT           NOT NULL AUTO_INCREMENT,
  nome_produto      VARCHAR(100)  NOT NULL,
  categoria_produto VARCHAR(50)   NOT NULL,
  preco_produto     DECIMAL(10,2) NOT NULL,
  descricao_produto VARCHAR(255),
  estoque_produto   INT           DEFAULT 0,
  imagem_produto    VARCHAR(100)  DEFAULT 'favicon2.png',
  rota_produto      VARCHAR(100)  DEFAULT NULL,
  status_produto    INT           DEFAULT 1,
  PRIMARY KEY (id_produto)
);

CREATE TABLE IF NOT EXISTS diagnosticos (
  id_diagnostico  INT         NOT NULL AUTO_INCREMENT,
  id_usuario      INT,
  frequencia      VARCHAR(50),
  impacto         VARCHAR(50),
  preparacao      VARCHAR(150),
  prioridade      VARCHAR(50),
  tolerancia      VARCHAR(50),
  nivel_autonomia VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_diagnostico)
);

CREATE TABLE IF NOT EXISTS compras (
  id_compra      INT           NOT NULL AUTO_INCREMENT,
  id_usuario     INT,
  id_produto     INT,
  nome_produto   VARCHAR(100)  NOT NULL,
  preco_produto  DECIMAL(10,2) NOT NULL,
  imagem_produto VARCHAR(100)  DEFAULT 'favicon2.png',
  status_compra  VARCHAR(30)   DEFAULT 'confirmado',
  PRIMARY KEY (id_compra)
);
