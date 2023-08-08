const bcrypt = require('bcrypt');

async function comparePasswords(password, hashedPassword) {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    console.log('Comparison result:', result);
  } catch (error) {
    console.error('Error occurred during password comparison:', error);
  }
}

// Exemple d'utilisation
const password = 'long'; // Remplacez par le mot de passe que vous souhaitez comparer
const hashedPassword = 'free'; // Remplacez par le mot de passe haché stocké dans la base de données


comparePasswords(password, hashedPassword);

