import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret";

export function generateToken(payload: object): string {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}
