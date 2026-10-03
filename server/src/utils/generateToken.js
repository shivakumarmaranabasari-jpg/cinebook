import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT token
 * @param {string} id - User ID
 * @returns {string} - Signed JWT
 */
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'cinebook_super_secret_jwt_key_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;
