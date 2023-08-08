//APP

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Importez le package cors
const auth = require('./middleware/auth'); // Import the auth middleware
const app = express();


// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

app.use(cors());

app.use('/uploads', express.static('uploads'))


// Connexion à la base de données MongoDB

mongoose.connect('mongodb://localhost:27017/wisdom', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.log("Failed to connect to MongoDB", error);
});


// Middleware pour analyser les requêtes JSON
app.use(express.json());

const indexRoute = require('./routes/index');
const userRoutes = require('./routes/users');
const guideRoutes = require('./routes/guides');
const commentRoutes = require('./routes/comments');
//const reportRoutes = require('./guideRoutes');
app.use('/', indexRoute);
app.use('/users', userRoutes);
app.use('/guides', guideRoutes);
app.use('/comments', commentRoutes);
app.use(auth);
//app.use('/guides', reportRoutes);

// ! Les routes en dessous de auth nécessite un accès
// Définir les routes



// Gérer les erreurs 404 (route non trouvée)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Gérer les erreurs globales
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

// Lancer le serveur

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});