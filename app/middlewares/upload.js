// Configuração do Multer para upload de imagens de produtos (usado pelo admin).
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/imagens'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nomeUnico = `produto_${Date.now()}${ext}`;
    cb(null, nomeUnico);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const permitidos = /jpeg|jpg|png|webp|gif/;
    const ext = permitidos.test(path.extname(file.originalname).toLowerCase());
    const mime = permitidos.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Apenas imagens são permitidas!'));
  }
});

module.exports = upload;
