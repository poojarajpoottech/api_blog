function requireAdmin(req, res, next) {
  if (req.rootUser && req.rootUser.isAdmin) {
    next();
  } else {
    res.status(401).send("Unauthorized Access!");
  }
}

module.exports = requireAdmin;
