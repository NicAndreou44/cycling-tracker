import jwt from "jsonwebtoken";


const SECRET = "dev_secret";
console.log("SECRET USED TO SIGN TOKEN:", SECRET);

export function generateToken(payload: object): string {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}
