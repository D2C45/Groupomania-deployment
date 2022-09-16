// Import du package multer
const multer = require('multer');

// Filtre les fichiers entrants pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

// Configuration du storage de multer
const storage = multer.diskStorage({});

// Configuration de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
})

// Exporte multer configuré avec storage et uniquement pour le téléchargement de fichiers image
module.exports = multer({storage: storage}).single('image');