import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const token = req.cookies.AccessToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Token invalid" });
  }
}

export default authMiddleware;
