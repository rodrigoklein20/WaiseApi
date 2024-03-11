const testeModel = require('../models/testModel');

const testeController = {
  getTeste: (req, res) => {
    res.send(testeModel.mensagem);
  }
};

module.exports = testeController;
