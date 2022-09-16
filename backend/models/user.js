// Import des packages
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Définition du schéma de données user avec mongoose
const userSchema = mongoose.Schema({
    firstName: {type: String, required: true, minlength: 3, trim: true},
    lastName: {type: String, required: true, minlength: 3, trim: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    imageUrl: {type: String, default: ''},
    description: {type: String, default: '', maxlength: 100, trim: true},
    isAdmin: {type: Boolean, default: false},
    cloudinary_id: {type: String}
},
{
    timestamps: true
});

// Applique le plugin uniqueValidator au schéma pour que l'email soit unique
userSchema.plugin(uniqueValidator, { message: 'Cet email est déjà utilisé'});

// Exporte le schéma en tant que modèle mongoose nommé User
module.exports = mongoose.model('User', userSchema);