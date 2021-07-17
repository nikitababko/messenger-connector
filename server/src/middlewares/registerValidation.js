const registerValidation = (req, res, next) => {
  const { fullname, username, email, password, confirm_password } =
    req.body;

  try {
    // Full name
    if (!fullname.trim()) {
      return res.status(400).json({
        message: 'Please add your full name.',
      });
    } else if (fullname.length > 25) {
      return res.status(400).json({
        message: 'Full name is up to 25 characters long.',
      });
    }

    // Username
    if (!username.trim()) {
      return res.status(400).json({
        message: 'Please add your username.',
      });
    } else if (username.length > 25) {
      return res.status(400).json({
        message: 'Username is up to 25 characters long.',
      });
    }

    // Email
    if (!email.trim()) {
      return res.status(400).json({
        message: 'Please add your email.',
      });
    } else if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Email format is incorrect.',
      });
    }

    // Password
    if (!password.trim()) {
      return res.status(400).json({
        message: 'Please add your password.',
      });
    } else if (password !== confirm_password) {
      return res.status(400).json({
        message: 'Confirm password did not match.',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

module.exports = registerValidation;
