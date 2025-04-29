const jwt = require('jsonwebtoken');
const { generateToken } = require('../services/authservices');

describe("generateToken", () => {
  it("should create a valid JWT", () => {
    const payload = { userId: 123 };
    const token = generateToken(payload);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    expect(decoded.userId).toBe(123);
  });
});
module.exports = { generateToken };