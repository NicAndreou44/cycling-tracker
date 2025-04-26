import { generateToken } from "../services/authservices";
import jwt from "jsonwebtoken";

describe("generateToken", () => {
  it("should create a valid JWT", () => {
    const payload = { userId: 123 };
    const token = generateToken(payload);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret") as any;
    expect(decoded.userId).toBe(123);
  });
});
