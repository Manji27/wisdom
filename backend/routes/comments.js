// test
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');

// GET /comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST /comments
router.post('/', async (req, res) => {
  const comment = new Comment({
    guideId: req.body.guideId,
    userId: req.body.userId,
    contenu: req.body.contenu
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /comments/guide/:guideId
router.get('/guide/:guideId', async (req, res) => {
  try {
    const comments = await Comment.find({ guideId: req.params.guideId })
                                  .populate('userId', 'nom')
                                  .exec();
    //console.log("check des coms:", comments); // Ajout d'un console.log pour vérifier les commentaires récupérés

    if (comments.length === 0) {  // Si aucun commentaire n'est trouvé
      return res.status(200).json([]); // Retourne une liste vide avec le statut 200
    }

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});







// PATCH /comments/:id
router.patch('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    if (req.body.contenu != null) {
      comment.contenu = req.body.contenu;
    }

    const updatedComment = await comment.save();
    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /comments/:id
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.deleteOne({ _id: req.params.id });
    if (comment.deletedCount === 0) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }
    res.json({ message: 'Commentaire supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /comments/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const comments = await Comment.find({ userId: req.params.userId });
    if (comments.length === 0) {  // Si aucun commentaire n'est trouvé
      return res.status(404).json({ message: 'Aucun commentaire trouvé pour cet utilisateur.' });
    }
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
