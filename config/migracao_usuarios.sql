-- ============================================================
-- Migração: adiciona à tabela usuarios as colunas que o código já usa
-- Rode este script UMA VEZ se o banco já existir (não apaga dados).
-- Se for criar o banco do zero, use script_bd.sql — este arquivo é
-- só para quem já tinha a tabela usuarios no formato antigo.
-- ============================================================

ALTER TABLE usuarios
  ADD COLUMN IF NOT EXISTS cpf_usuario           VARCHAR(14)  DEFAULT NULL AFTER senha_usuario,
  ADD COLUMN IF NOT EXISTS telefone_usuario      VARCHAR(20)  DEFAULT NULL AFTER cpf_usuario,
  ADD COLUMN IF NOT EXISTS cep_usuario           VARCHAR(9)   DEFAULT NULL AFTER telefone_usuario,
  ADD COLUMN IF NOT EXISTS numero_usuario        VARCHAR(10)  DEFAULT NULL AFTER cep_usuario,
  ADD COLUMN IF NOT EXISTS complemento_usuario   VARCHAR(100) DEFAULT NULL AFTER numero_usuario,
  ADD COLUMN IF NOT EXISTS imagem_perfil_usuario VARCHAR(255) DEFAULT NULL AFTER complemento_usuario;

-- Opcional, mas recomendado: impede dois cadastros com o mesmo e-mail
-- no nível do banco (o código já verifica isso, mas o banco garante).
-- Só rode isso se não houver e-mails duplicados na tabela ainda.
ALTER TABLE usuarios ADD UNIQUE KEY uq_email_usuario (email_usuario);

-- ============================================================
-- Migração adicional: corrige o tamanho da coluna preparacao
-- em diagnosticos (rode isso também se o banco já existe)
-- ============================================================
ALTER TABLE diagnosticos MODIFY COLUMN preparacao VARCHAR(150);
