import jwt from "jsonwebtoken";


const SECRET = process.env.JWT_SECRET || "dev_secret";

console.log("SECRET USED TO SIGN TOKEN:", SECRET);

export function generateToken(payload: Record<string, unknown>): string {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}
