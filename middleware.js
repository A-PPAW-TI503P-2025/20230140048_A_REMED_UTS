const checkRole = (roleRequired) => {
  return (req, res, next) => {
    const userRole = req.headers["x-user-role"]; // Ambil role dari header

    if (!userRole) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Role header missing" });
    }

    if (userRole === roleRequired) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
  };
};

module.exports = { checkRole };
