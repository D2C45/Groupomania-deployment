// Import du modèle post
const Post = require('../models/post');
const user = require('../models/user');

// Import de cloudinary configuré
const cloudinary = require('../utils/cloudinary');

// Enregistrement dun nouveau post
exports.createPost = (req,res) => {
    const postObject = JSON.parse(req.body.content); // Conversion du corps de la requête en objet json
        if (postObject.postUserId == req.token.userId) { // Test si l'userId de la requête correspond au token d'authentification
          if (req.file) {
            cloudinary.uploader
              .upload(req.file.path , {folder: "groupomania/posts"})
              .then(result => {
                const post = new Post({
                    ...postObject,         // Copie tous les éléments de l'objet json dans la nouvelle instance
                    imageUrl: result.secure_url,    // Récupère l'url de l'image renvoyé par cloudinary
                    cloudinary_id: result.public_id // Récupère l'id de l'image renvoyé par cloudinary
                });
                post.save()    // Enregistrement du nouveau post dans la base de données
                    .then(() => res.status(201).json({ message: 'Post saved'}))    // Création de ressource
                    .catch(error => res.status(400).json({ error }));               // Mauvaise requête
              })
              .catch(error => console.log(error))
          } else {
            const post = new Post({
                ...postObject,         // Copie tous les éléments de l'objet json dans la nouvelle instance
            });
            post.save()    // Enregistrement du nouveau post dans la base de données
                .then(() => res.status(201).json({ message: 'Post saved'}))    // Création de ressource
                .catch(error => res.status(400).json({ error }));               // Mauvaise requête              
          }

        } else {
            res.status(403).json({ error: "Unauthorized request" });    // Requête non autorisée
        }
}

// Récupération de tous les posts
exports.getAllPosts = (req, res) => {
    Post.find()
      .then(posts => res.status(200).json(posts.sort((a,b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))))         // Requête ok avec tri par date de création
      .catch(error => res.status(400).json({ error }));     // Mauvaise requête
};

// Récupération dun post
exports.getOnePost = (req, res) => {
    Post.findOne({ _id: req.params.id })
      .then(post => res.status(200).json(post))         // Requête ok
      .catch(error => res.status(404).json({ error }));   // Ressource non trouvée
};

// Modification dun post
exports.modifyPost = (req, res) => {
    Post.findOne({ _id: req.params.id })                 // Recherche du post avec l'id
      .then (post => {

        if (post.postUserId == req.token.userId || req.token.isAdmin) {           // Test si le userId du token correspond à celui du post à modifier ou si c'est le token d'un administrateur

          if (req.file) {                                 // Test si présence d'un fichier dans la requête
            if (post.imageUrl !== '') {
              cloudinary.uploader
              .destroy(post.cloudinary_id)
              .then(result => {
                cloudinary.uploader     // upload de la nouvelle image sur cloudinary
                  .upload(req.file.path, {folder: "groupomania/posts"})
                  .then(result => {
                    const postObject = {                                 // Création du nouvel objet post
                      ...JSON.parse(req.body.content),                      // Conversion du corps de la requête en objet json
                      imageUrl: result.secure_url,                         // Mise à jour de l'url de la nouvelle image
                      cloudinary_id: result.public_id                     // Mise à jour de l'id cloudinary
                    }
                    Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id }) // Récupère le post avec l'id passé en paramètre et le remplace par le nouvel objet post créé auquel on rajoute le même id
                      .then(() => res.status(200).json({ message: 'Post modified'})) // Requête ok
                      .catch(error => res.status(400).json({ error }));               // Mauvaise requête
                  })
                  .catch(error => console.log(error));
              })
              .catch(error => console.log(error));              
            } else {
              cloudinary.uploader     // upload de la nouvelle image sur cloudinary
              .upload(req.file.path, {folder: "groupomania/posts"})
              .then(result => {
                const postObject = {                                 // Création du nouvel objet post
                  ...JSON.parse(req.body.content),                      // Conversion du corps de la requête en objet json
                  imageUrl: result.secure_url,                         // Mise à jour de l'url de la nouvelle image
                  cloudinary_id: result.public_id                     // Mise à jour de l'id cloudinary
                }
                Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id }) // Récupère le post avec l'id passé en paramètre et le remplace par le nouvel objet post créé auquel on rajoute le même id
                  .then(() => res.status(200).json({ message: 'Post modified'})) // Requête ok
                  .catch(error => res.status(400).json({ error }));               // Mauvaise requête
              })
              .catch(error => console.log(error));
            }
          } else {                                                                          // Si pas de fichier dans la requête
            if (JSON.parse(req.body.content).imageUrl == '') {
              cloudinary.uploader
              .destroy(post.cloudinary_id)
              .then(result => {
                Post.updateOne({ _id: req.params.id }, { ...JSON.parse(req.body.content), _id: req.params.id })    // Rempacement par le corps de la requête
                .then(() => res.status(200).json({ message: 'Post modified'})) // Requête ok
                .catch(error => res.status(400).json({ error }));               // Mauvaise requête                
              })
              .catch(error => console.log(error));
            } else {
              Post.updateOne({ _id: req.params.id }, { ...JSON.parse(req.body.content), _id: req.params.id })    // Rempacement par le corps de la requête
                .then(() => res.status(200).json({ message: 'Post modified'})) // Requête ok
                .catch(error => res.status(400).json({ error }));               // Mauvaise requête              
            }
          }

        } else {                                  // Si l'utilisateur n'est pas celui qui a créé le post
            res.status(403).json({ error: "Unauthorized request" });    // Requête non autorisée
        }          
      })
      .catch(error => res.status(404).json({ error }));   // Ressource non trouvée
};

// Suppression du post
exports.deletePost = (req, res) => {
  Post.findOne({_id: req.params.id})                   // Recherche du post avec l'id
    .then (post => {
      if (post.postUserId == req.token.userId || req.token.isAdmin) {           // Test si le userId du token correspond à celui du post à modifier ou si c'est le token d'un administrateur
        if (post.imageUrl !== '') {
          cloudinary.uploader
            .destroy(post.cloudinary_id)                  // Suppression de l'image sur cloudinary si présente
            .then(result => {
              Post.deleteOne({_id: req.params.id})                 // Suppression du post
                .then(() => res.status(200).json({ message : "Post deleted"})) // Requête ok
                .catch(error => res.status(400).json({error}));                 // Mauvaise requête
            })
            .catch(error => console.log(error));
        } else {
          Post.deleteOne({_id: req.params.id})                 // Suppression du post
            .then(() => res.status(200).json({ message : "User deleted"})) // Requête ok
            .catch(error => res.status(400).json({error}));                 // Mauvaise requête
        }
      } else {
        res.status(403).json({ error: "Unauthorized request" });
      }
    })
    .catch(error => res.status(404).json({ error }));   // Ressource non trouvée
};        

// Like/unlike d'un post
exports.likePost = (req,res) => {
  Post.findOne({_id: req.params.id})                 // Recherche du post avec l'id
    .then (post => {
      if(req.body.userId) {   // Test si présence d'un userId dans la requête
        let haveUserAlreadyLiked = post.likersId.find(user => user == req.body.userId); // Prend la valeur de l'userId (qui peut être convertie en true) si il a déjà like sinon undefined

        if (!haveUserAlreadyLiked){ // Si l'utilisateur n'a pas déjà liker
          Post.updateOne({_id: req.params.id}, {$push: {likersId: req.body.userId}})  // Ajoute le userId dans le tableau des likers du post
            .then(() => res.status(200).json({ message: 'Post liked'})) // Requête ok
            .catch(error => res.status(400).json({ error }));               // Mauvaise requête
        } else {  // Si l'utilisateur a déjà liker
          Post.updateOne({_id: req.params.id}, {$pull: {likersId: req.body.userId}})  // Retire le userId dans le tableau des likers du post
            .then(() => res.status(200).json({ message: 'Post unliked'})) // Requête ok
            .catch(error => res.status(400).json({ error }));               // Mauvaise requête
        }

      } else {
        res.status(400).json({ message: 'You must had a userId to like'});
      }
    })

    .catch(error => res.status(404).json({ error }));   // Ressource non trouvée
};