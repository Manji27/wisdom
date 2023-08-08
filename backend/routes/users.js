const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// GET /users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});



// POST /users/login



router.post('/register', async (req, res) => {
  // Vérifiez si l'email est déjà enregistré
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: 'Email déjà enregistré' });
  }
  
  try {
    // Générez un salt pour le hachage
    const salt = await bcrypt.genSalt(10);
  
    // Hachez le mot de passe
    const hashedPassword = await bcrypt.hash(req.body.mot_de_passe, salt);
  
    // Créez un nouvel utilisateur avec le mot de passe haché
    user = new User({
      nom: req.body.nom,
      email: req.body.email,
      mot_de_passe: hashedPassword,
      profil: req.body.profil,
    });
  
    // Enregistrez l'utilisateur dans la base de données
    await user.save();
  
    // Créez un JWT
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  
    // Envoyez le token dans la réponse
    res.json({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/login', async (req, res) => {
  // Trouvez l'utilisateur par son e-mail
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: 'Email de l\'utilisateur non trouvé' });
  }
  
  try {
    // Comparez le mot de passe fourni avec le mot de passe haché
    const validPassword = await bcrypt.compare(req.body.mot_de_passe, user.mot_de_passe);
  
    if (!validPassword) {
      return res.status(400).json({ message: 'Mot de passe invalide' });
    } 
  
    // Créez un JWT
    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  
    // Envoyez le token dans la réponse
    res.json({ token });
  } catch (error) {
    res.status(500).send(error);
  }
});

/* router.post('/logout', auth, (req, res) => {
  // Supprimez le cookie contenant le JWT
  res.clearCookie('jwt');

  // Supprimez le JWT du local storage
  res.send(`<script>localStorage.removeItem('token'); window.location.href = '/';</script>`);
}); */



// GET /users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /users/:id
// PUT /users/:id
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (req.body.nom != null) {
      user.nom = req.body.nom;
    }
    if (req.body.email != null) {
      user.email = req.body.email;
    }
    if (req.body.mot_de_passe != null && req.body.mot_de_passe !== "") {
      user.mot_de_passe = req.body.mot_de_passe;
    }
    if (req.body.profil != null) {
      user.profil = req.body.profil;
    }
    if (req.body.role != null) {
      user.role = req.body.role;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// DELETE /users/:id
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
