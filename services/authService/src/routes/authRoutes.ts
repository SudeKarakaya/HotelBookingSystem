import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

const JWT_SECRET = "mock-secret-key";

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const token = jwt.sign(
    {
      userId: "mock-user-id",
      email,
      role: "USER"
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.json({ token });
});

export default router;
