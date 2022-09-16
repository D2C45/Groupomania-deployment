// Import des packages jsonwebtoken et dotenv
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Configure l'environnement de variables
dotenv.config();

// Exporte le middleware de vérification du token
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];                  // Récupération du token dans le header authorization
    req.token = jwt.verify(token, process.env.TOKEN_PASSWORD);       // Décodage du token et ajout dans la requête pour pouvoir être utilisé dans les controllers
    if (req.body.userId && req.body.userId !== req.token.userId) {          // Comparaison du userId de la requête avec celui du token
      throw 'Unauthorized request';
    }
    if (req.body.commentUserId && req.body.commentUserId !== req.token.userId) {          // Comparaison du userId de la requête avec celui du token
      throw 'Unauthorized request';
    }
     else {
      next();
    }
  } catch {                                     // Capture des erreurs
    res.status(403).json({ error: 'Invalid request!' });
  }
};