function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.render("error", {
      message: "You are not authorized to access this page",
    });
  }
}
