// middleware/protectUser.js
import { getAuth } from '@clerk/express';

export const protectUser = (req, res, next) => {
  const auth = getAuth(req);
  console.log("🔐 Clerk getAuth result:", auth);

  if (!auth || !auth.userId) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  req.auth = auth; // 👈 This gives you `userId`, `sessionId`, etc.
  next();
};
