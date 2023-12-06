import jwt from 'jsonwebtoken';

// secret = process.env.JWT_SECRET; expiresIn=1d
export const createJWT = (payload, expiresIn, secret) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
  return token;
};

// secret = process.env.REFRESH_TOKEN_SECRET
export const verifyJWT = (token, secret) => {
  const decoded = jwt.verify(token, secret);
  return decoded; //console.log(decoded.email)
};