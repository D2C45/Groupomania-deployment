// Import du package http et de l'application app
const http = require('http');
const app = require('./app');

// Import des fonctions normalizePort et errorHandler
const functions = require('./utils/functions');

// Déclaration du port normalisé
const port = functions.normalizePort(process.env.PORT ||'5000');

// Définition du port sur lequel va fonctionner l'application
app.set('port', port);

// Déclaration du serveur avec app comme argument qui sera exécutée à chaque appel sur ce serveur
const server = http.createServer(app);

// Au lancement du serveur, si une erreur apparait applique la fonction errorHandler sinon affiche dans la console le port ou l'adresse écouté
server.on('error', functions.errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Ecoute du serveur sur le port déclaré
server.listen(port);