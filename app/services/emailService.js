const nodemailer = require('nodemailer');

const getTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP não configurado');
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
};

const enviarEmail = async ({ para, assunto, html }) => {
  const transporter = getTransporter();
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: para,
    subject: assunto,
    html
  });
};

module.exports = { enviarEmail };