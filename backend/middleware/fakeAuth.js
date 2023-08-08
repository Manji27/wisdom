const mongoose = require('mongoose');

module.exports = function fakeAuth(req, res, next) {
  req.user = {
    _id: new mongoose.Types.ObjectId().toHexString() // un faux ID utilisateur
  };
  next();
};
