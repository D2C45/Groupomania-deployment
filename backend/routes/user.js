// Import du package express
const express = require('express');

// Création du router
const router = express.Router();

// Import des middleware auth et multer
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Import des controleurs
const userCtrl = require('../controllers/user');

// Définition des routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/', auth, userCtrl.getAllUsers);
router.get('/:id', auth, userCtrl.getuser);
router.put('/:id', auth, multer, userCtrl.modifyUser);
router.delete('/:id', auth, userCtrl.deleteUser);

// Export du router
module.exports = router;