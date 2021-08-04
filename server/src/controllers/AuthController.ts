import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/UserModel';
import {
  generateAccessToken,
  generateActiveToken,
  generateRefreshToken,
} from '../utils/generateToken';
import sendMail from '../utils/sendMail';
import { validateEmail, validatePhone } from '../middleware/validation';
import { sendSMS, smsOTP, smsVerify } from '../utils/sendSMS';
import { IDecodedToken, IUser } from '../utils/interfaces';

const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const { fullname, username, account, password } = req.body;

      const user = await UserModel.findOne({ account });
      if (user) {
        return res.status(400).json({
          message: 'Email or Phone number already exists.',
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = {
        fullname,
        username,
        account,
        password: passwordHash,
      };

      const activate_token = generateActiveToken({ newUser });

      const CLIENT_URL = process.env.CLIENT_URL;
      const url = `${CLIENT_URL}/activate/${activate_token}`;

      if (validateEmail(account)) {
        sendMail(account, url, 'Verify your email address');
        return res.json({
          message: 'Success! Please check your email.',
        });
      } else if (validatePhone(account)) {
        sendSMS(account, url, 'Verify your phone number');
        return res.json({
          message: 'Success! Please check your phone.',
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  activateAccount: async (req: Request, res: Response) => {
    try {
      const { activate_token } = req.body;

      const decoded = <IDecodedToken>(
        jwt.verify(activate_token, `${process.env.ACTIVATE_TOKEN_SECRET}`)
      );
      console.log(decoded);

      const { newUser } = decoded;

      if (!newUser) {
        return res
          .status(400)
          .json({ message: 'Invalid authentication.' });
      }

      const user = await UserModel.findOne({ account: newUser.account });
      if (user) {
        return res.status(400).json({
          message: 'Account already exists.',
        });
      }

      const new_user = new UserModel(newUser);

      await new_user.save();

      res.json({ message: 'Account has been activated!' });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { account, password } = req.body;

      const user = await UserModel.findOne({ account });
      if (!user)
        return res
          .status(400)
          .json({ message: 'This account does not exits.' });

      // if user exists
      loginUser(user, password, res);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie('refresh_token', {
        path: `/api/refresh_token`,
      });
      return res.json({
        message: 'Logged out!',
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  refreshToken: async (req: Request, res: Response) => {
    try {
      const refresh_token = req.cookies.refresh_token;
      if (!refresh_token)
        return res.status(400).json({
          message: 'Please login now!',
        });

      const decoded = <IDecodedToken>(
        jwt.verify(refresh_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      );
      if (!decoded.id)
        return res.status(400).json({
          message: 'Please login now!',
        });

      const user = await UserModel.findById(decoded.id).select(
        '-password'
      );
      if (!user) {
        return res
          .status(400)
          .json({ message: 'This account does not exist.' });
      }

      const access_token = generateAccessToken({
        id: user._id,
      });

      res.json({
        access_token,
        user,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  loginSMS: async (req: Request, res: Response) => {
    try {
      const { phone } = req.body;
      const data = await smsOTP(phone, 'sms');
      res.json(data);
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },

  smsVerify: async (req: Request, res: Response) => {
    try {
      const { phone, code } = req.body;

      const data = await smsVerify(phone, code);
      if (!data?.valid) {
        return res
          .status(400)
          .json({ message: 'Invalid Authentication.' });
      }

      const password = phone + 'your phone secrect password';
      const passwordHash = await bcrypt.hash(password, 12);

      const user = await UserModel.findOne({ account: phone });

      if (user) {
        loginUser(user, password, res);
      } else {
        const user = {
          name: phone,
          account: phone,
          password: passwordHash,
          type: 'sms',
        };

        const newUser = new UserModel(user);
        await newUser.save();

        const access_token = generateAccessToken({ id: newUser._id });
        const refresh_token = generateRefreshToken({ id: newUser._id });

        res.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          path: '/api/refresh_token',
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
        });

        res.json({
          message: 'Login Success!',
          access_token,
          user: { ...newUser._doc, password: '' },
        });
      }
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};

const loginUser = async (user: IUser, password: string, res: Response) => {
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      message: 'Password is incorrect.',
    });
  }

  const access_token = generateAccessToken({
    id: user._id,
  });
  const refresh_token = generateRefreshToken({
    id: user._id,
  });

  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    path: `/api/refresh_token`,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
  });

  res.json({
    message: 'Login Success!',
    access_token,
    user: {
      ...user._doc,
      password: '',
    },
  });
};

export default AuthController;
