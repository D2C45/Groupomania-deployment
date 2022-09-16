// Import du package express
const express = require('express');

// Création du router
const router = express.Router();

// Import du middleware auth
const auth = require('../middleware/auth');

// Import des controleurs
const commentCtrl = require('../controllers/comment');

// Définition des routes
router.put('/:id/comment', auth, commentCtrl.addComment);
router.put('/comment/:id', auth, commentCtrl.modifyComment);
router.patch('/comment/:id', auth, commentCtrl.deleteComment);

// Export du router
module.exports = router;