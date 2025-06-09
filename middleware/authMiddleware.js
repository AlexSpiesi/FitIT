const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "your-secret-key";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      console.log("JWT verification failed:", err);
      return res.sendStatus(403);
    }
    console.log("Decoded JWT payload:", user); // 👈 wichtig!
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
