const multer = require('multer');
const path = require('path');
const fs = require('fs');

const destination = path.join(__dirname, '../public/imagens/perfil');
fs.mkdirSync(destination, { recursive: true });

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    cb(null, `perfil_${req.session.usuarioId}_${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
  }
});

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const permitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (permitidos.includes(file.mimetype)) return cb(null, true);
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'imagem'));
  }
});