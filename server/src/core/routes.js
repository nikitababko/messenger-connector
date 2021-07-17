const AuthController = require('../controllers/AuthController');
const registerValidation = require('../middlewares/registerValidation');

const createRoutes = (app) => {
  app.post('/api/register', registerValidation, AuthController.register);
};

module.exports = createRoutes;
