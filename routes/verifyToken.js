const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) res.status(403).json("El Token no es válido");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("No estás autentificado");
  }
};

const verifyToken_auth = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("¡No tienes permisos para eso!");
    }
  });
};

const verifyToken_admin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("¡No tienes permisos para eso!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyToken_auth,
  verifyToken_admin,
};