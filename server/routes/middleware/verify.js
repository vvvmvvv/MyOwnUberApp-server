require('dotenv').config();
const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded.user;
    console.log(req.user, decoded.user, token);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalide Token' });
  }
}

module.exports = verify;