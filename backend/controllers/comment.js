// Import du modèle post
const Post = require('../models/post');

// Enregistrement dun nouveau commentaire
exports.addComment = (req,res) => {
    if (req.body.commentUserId && req.body.text) {  // Test si présence d'un userId et d'un texte pour commenter
        Post.findOneAndUpdate({_id: req.params.id}, {$push: {comments: {...req.body, timestamp: new Date().getTime()}}})    // Recherche le post aavec l'id entré en paramètre et rajoute un élément dans le tableau des commentaires
            .then (() => res.status(200).json({ message: 'Comment added'})) // Requête ok
            .catch(error => res.status(404).json({ error }));   // Ressource non trouvée  
    } else {
        res.status(400).json({ message: 'You must had a userId and a text to comment'});
    }
};

// Modification d'un commentaire
exports.modifyComment = (req,res) => {
    Post.findOne({"comments._id": req.params.id})
        .then (post => {
            let commentToModify = post.comments.find(comment => comment._id == req.params.id);
            if (commentToModify.commentUserId == req.token.userId || req.token.isAdmin) {
                Post.updateOne({"comments._id": req.params.id},{$set: {"comments.$.text": req.body.text}})
                    .then (() => res.status(200).json({ message: 'Comment updated'})) // Requête ok
                    .catch(error => res.status(400).json({ error }));   // Mauvaise requête
            } else {
                res.status(403).json({ error: "Unauthorized request" });    // Requête non autorisée
            }
        })
        .catch(error => res.status(404).json({ error }));   // Ressource non trouvée
};

// Suppression d'un commentaire
exports.deleteComment = (req,res) => {
    Post.findOne({"comments._id": req.params.id})
        .then (post => {
            let commentToDelete = post.comments.find(comment => comment._id == req.params.id);
            if (commentToDelete.commentUserId == req.token.userId || req.token.isAdmin) {
                Post.updateOne({"comments._id": req.params.id},{$pull: {comments: commentToDelete}})
                    .then (() => res.status(200).json({ message: 'Comment deleted'})) // Requête ok
                    .catch(error => res.status(400).json({ error }));   // Mauvaise requête
            } else {
                res.status(403).json({ error: "Unauthorized request" });    // Requête non autorisée
            }
        })
        .catch(error => res.status(404).json({ error }));   // Ressource non trouvée
};