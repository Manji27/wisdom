const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const guideRouter = require('../../routes/guides'); // chemin vers votre fichier de routes
const app = express();

app.use(express.json());
app.use('/guides', guideRouter);

describe('POST /guides/create', () => {
    it('should create a new guide and return it', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
  
      const response = await request(app)
        .post('/guides/create')
        .send({
          titre: 'Test Guide',
          contenu: 'This is a test guide.',
          genre: 'Test Genre',
          userId: userId
        });
  
      expect(response.statusCode).toBe(201);
      expect(response.body.titre).toBe('Test Guide');
      expect(response.body.contenu).toBe('This is a test guide.');
      expect(response.body.genre).toBe('Test Genre');
      expect(response.body.userId).toBe(userId);
    }, 10000); // Augmenter le délai d'expiration à 10000ms
  });
  
