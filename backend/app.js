// Import des packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Configure l'environnement de variables
dotenv.config();

// Import des routers
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

// Déclaration de l'application
const app = express();

// Extraction du corps JSON des requêtes POST
app.use(express.json());

// Connection à la base de données MongoDB Atlas
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_NAME}.1ty33rg.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(() => console.log('Connection to MongoDB failed'));


const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  'allowedHeaders': 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  // 'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}
app.use(cors(corsOptions));

// Limite le nombre de requêtes
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

// Sécurisation des headers avec helmet
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));

// Enregistrement des routers
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);

// Exporte l'application
module.exports = app;