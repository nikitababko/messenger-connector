const bcrypt = require('bcrypt');

const UserModel = require('../models/UserModel');

const UserController = {
  register: async (req, res) => {
    try {
      const { fullname, username, email, password, confirm_password } =
        req.body;

      // Password hash
      const passwordHash = await bcrypt.hash(password, 12);

      console.log(passwordHash);

      const newUser = new UserModel({
        fullname,
        username,
        email,
        password: passwordHash,
        confirm_password,
      });
      console.log(newUser);

      res.json({
        message: 'Register success!',
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = UserController;
