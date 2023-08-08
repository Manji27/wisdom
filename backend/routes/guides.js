const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Guide = require('../models/Guide');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const { sanitize } = require('isomorphic-dompurify');
const sendReportEmail = require('./mailService');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage });  

if (process.env.NODE_ENV !== 'test') {
  router.use(auth);
}

// GET /guides
router.get('/',  async (req, res) => {
  try {
    let filter = {};
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }
    const guides = await Guide.find(filter);
    res.json(guides);
  } catch (err) {
    res.status(500).send(err);
  }
});


// GET /guides/:id
router.get('/:id', async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: 'Guide non trouvé' });
    }

    const guideWithImagesAndRating = {
      _id: guide._id,
      userId: guide.userId, // Ajoutez cette ligne
      titre: guide.titre,
      contenu: sanitize(guide.contenu),
      images: guide.images,
      genre: guide.genre,
      averageRating: guide.averageRating,
      votesCount: guide.ratings.length
    };
    res.json(guideWithImagesAndRating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// POST /guides
router.post('/create', auth, upload.array('image'), async (req, res) => {
  try {
    console.log(req.body); // Ajoutez ce console.log pour vérifier les données de la requête
    console.log(req.files); // Ajoutez ce console.log pour vérifier les fichiers téléchargés

    const imagesPaths = req.files.map(file => file.path);

    const guide = new Guide({
      titre: req.body.titre,
      contenu: req.body.contenu,
      images: imagesPaths,
      genre: req.body.genre,
      userId: req.user._id
    });

    console.log(guide); // Ajoutez ce console.log pour vérifier l'objet guide créé

    const newGuide = await guide.save();
    res.status(201).json(newGuide);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to create guide' });
  }
});


router.post('/uploadImage', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(500).send({ message: 'Upload fail' });
  } else {
    return res.status(200).send({ location: '/uploads/' + req.file.filename });
  }
});




// PUT /guides/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: 'Guide non trouvé' });
    }

    // Verifier que l'utilisateur authentifié est l'auteur du guide
    if (req.user._id.toString() !== guide.userId.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    if (req.body.titre != null) {
      guide.titre = req.body.titre;
    }
    if (req.body.contenu != null) {
      guide.contenu = sanitize(req.body.contenu);
    }
    if (req.body.genre != null) {
      guide.genre = req.body.genre;
    }

    const updatedGuide = await guide.save();
    res.json(updatedGuide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




// DELETE /guides/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('req.params.id:', req.params.id);
    const guide = await Guide.findById(req.params.id);
    console.log('guide:', guide);
    if (!guide) {
      return res.status(404).json({ message: 'Guide non trouvé' });
    }

    console.log('req.user._id:', req.user._id);
    console.log('guide.userId:', guide.userId);
    if (guide.userId && req.user._id.toString() !== guide.userId.toString()) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    await Guide.deleteOne({ _id: req.params.id });
    res.json({ message: 'Guide supprimé' });
  } catch (err) {
    console.log('err:', err);
    res.status(500).json({ message: err.message });
  }
});




// POST /guides/:id/ratings
router.post('/:id/ratings', auth, async (req, res) => {
  try {
    // Vérifier que l'ID de l'utilisateur est disponible
    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: 'User ID non fourni' });
    }

    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({ error: 'Guide non trouvé' });
    }

    // Vérifiez que la note est un nombre et est entre 1 et 5.
    if (!req.body.note || typeof req.body.note !== 'number' || req.body.note < 1 || req.body.note > 5) {
      return res.status(400).json({ error: 'Note invalide. La note doit être un nombre entre 1 et 5.' });
    }

    // Vérifiez si l'utilisateur a déjà noté ce guide
    const existingRatingIndex = guide.ratings.findIndex(r => r.userId.equals(req.user._id));

    if (existingRatingIndex !== -1) {
      // Si l'utilisateur a déjà noté, mettez à jour l'ancienne note
      guide.ratings[existingRatingIndex].note = req.body.note;
    } else {
      // Sinon, ajoutez une nouvelle note
      guide.ratings.push({ userId: req.user._id, note: req.body.note });
    }

    // Calculez la note moyenne et mettez à jour le nombre de votes
    await guide.calculateAverageRating();

    // Ici, nous sauvegardons les changements apportés au guide
    await guide.save();

    // Renvoyez la note moyenne et le nombre de votes à jour
    res.json({ averageRating: guide.averageRating, votesCount: guide.votesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s’est produite lors de l’ajout de la note' });
  }
});



router.post('/report', async (req, res) => {
  const { guideId, reason } = req.body;

  // Trouver le guide
  const guide = await Guide.findById(guideId);
  if (!guide) {
    return res.status(404).send({ error: 'Guide not found' });
  }

  // Marquer le guide comme signalé
  guide.reported = true;  // Ajoutez un champ "reported" à votre schéma si ce n'est pas déjà fait
  guide.reportReason = reason;  // Idem pour "reportReason"

  // Sauvegarder les modifications
  await guide.save();

  // Puis envoyer l'e-mail à l'administrateur
  await sendReportEmail(guideId, reason);

  res.send({ message: 'Report has been sent and email notification has been delivered.' });
});







module.exports = router;
