function requireAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Unauthorized Access!");
  }
}

module.exports = requireAdmin;
