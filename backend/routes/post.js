// Import du package express
const express = require('express');

// Création du router
const router = express.Router();

// Import des middleware auth et multer
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Import des controleurs
const postCtrl = require('../controllers/post');

// Définition des routes
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, multer, postCtrl.createPost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);

router.put('/:id/like', auth, postCtrl.likePost);

// Export du router
module.exports = router;