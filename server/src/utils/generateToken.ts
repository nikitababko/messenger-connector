import jwt from 'jsonwebtoken';

export const generateActiveToken = (payload: object) => {
  const TOKEN = String(process.env.ACTIVATE_TOKEN_SECRET);
  return jwt.sign(payload, TOKEN, {
    expiresIn: '5m',
  });
};

export const generateAccessToken = (payload: object) => {
  const TOKEN = String(process.env.ACCESS_TOKEN_SECRET);
  return jwt.sign(payload, TOKEN, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (payload: object) => {
  const TOKEN = String(process.env.REFRESH_TOKEN_SECRET);
  return jwt.sign(payload, TOKEN, {
    expiresIn: '30d',
  });
};
