import { Request, Response, NextFunction } from 'express';

export const validateRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullname, username, account, password, confirm_password } =
    req.body;

  const errors = [];

  if (!fullname.trim()) {
    errors.push('Please add your name.');
  } else if (fullname.length > 20) {
    errors.push('Your name is up to 20 chars long.');
  }

  if (!username.trim()) {
    errors.push('Please add your username.');
  } else if (username.length > 20) {
    errors.push('Your username is up to 20 chars long.');
  }

  if (!account.trim()) {
    errors.push('Please add your email or phone number.');
  } else if (!validatePhone(account) && !validateEmail(account)) {
    errors.push('Email or phone number format is incorrect.');
  }

  if (!password.trim()) {
    errors.push('Please add your password.');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 chars.');
  }

  if (password !== confirm_password) {
    errors.push("Passwords don't matches.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: errors,
    });
  }

  next();
};

export const validatePhone = (phone: string) => {
  const re = /^[+]/g;
  return re.test(phone);
};

export const validateEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
