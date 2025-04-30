
/// <reference types="vitest" />
import jwt from 'jsonwebtoken';
import { generateToken } from '../services/authservices.js';

describe('generateToken()', () => {
  it('creates a valid JWT', () => {
    const payload = { userId: 123 };
    const token = generateToken(payload);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    
    if (typeof decoded === 'object' && 'userId' in decoded) {
      expect(decoded.userId).toBe(123);
    } else {
      throw new Error('Decoded payload missing userId');
    }
  });
});
