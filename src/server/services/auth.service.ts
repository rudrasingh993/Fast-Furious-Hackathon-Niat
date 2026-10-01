import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { config } from '../config/env.js';
import type { User } from '../../shared/types.js';

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateTokens(user: User): { accessToken: string; refreshToken: string } {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });

    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn as any,
    });

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): { sub: string; email: string; name: string } | null {
    try {
      return jwt.verify(token, config.jwt.secret) as any;
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): { sub: string; email: string; name: string } | null {
    try {
      return jwt.verify(token, config.jwt.refreshSecret) as any;
    } catch {
      return null;
    }
  }

  async signup(name: string, email: string, password: string): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string } }> {
    const existing = await db.getUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email address already exists');
    }

    const passwordHash = await this.hashPassword(password);
    const user = await db.createUser({
      name,
      email,
      password_hash: passwordHash,
    });

    // Default starter conversation
    await db.createConversation({
      user_id: user.id,
      title: 'Welcome to Multi Mind AI',
      category: 'GENERAL',
    });

    const tokens = this.generateTokens(user);
    return { user, tokens };
  }

  // In-memory OTP storage with 10-minute expiry
  private otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

  async sendOtp(type: 'email' | 'phone', target: string): Promise<{ message: string; devCode?: string }> {
    const key = `${type}:${target.toLowerCase().trim()}`;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.otpStore.set(key, { code, expiresAt, attempts: 0 });
    console.log(`🔐 [MULTI MIND AI - OTP] ${type.toUpperCase()} OTP for ${target}: ${code}`);

    return {
      message: `Verification code sent to your ${type === 'email' ? 'email address' : 'phone number'}.`,
      devCode: code, // Convenient preview for fast testing and evaluation
    };
  }

  async verifyOtp(
    type: 'email' | 'phone',
    target: string,
    code: string,
    name?: string
  ): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string } }> {
    const key = `${type}:${target.toLowerCase().trim()}`;
    const record = this.otpStore.get(key);

    if (!record) {
      throw new Error('No OTP code requested for this destination or code expired. Please request a new code.');
    }

    if (Date.now() > record.expiresAt) {
      this.otpStore.delete(key);
      throw new Error('Verification code has expired. Please request a new code.');
    }

    if (record.attempts >= 5) {
      this.otpStore.delete(key);
      throw new Error('Too many invalid attempts. Please request a new code.');
    }

    if (record.code !== code.trim()) {
      record.attempts += 1;
      throw new Error('Invalid verification code. Please check and try again.');
    }

    // OTP is valid!
    this.otpStore.delete(key);

    let email = '';
    let displayName = name || '';

    if (type === 'email') {
      email = target.toLowerCase().trim();
      if (!displayName) {
        displayName = email.split('@')[0];
      }
    } else {
      // Phone format
      const cleaned = target.replace(/[^0-9+]/g, '');
      email = `${cleaned.replace('+', 'p')}@phone.multimind.ai`;
      if (!displayName) {
        displayName = `User ${cleaned.slice(-4) || 'Mobile'}`;
      }
    }

    let user = await db.getUserByEmail(email);
    if (!user) {
      // Create new user automatically upon successful OTP verification
      const dummyPassword = await this.hashPassword(`otp_auth_${Date.now()}_${Math.random()}`);
      user = await db.createUser({
        name: displayName,
        email,
        password_hash: dummyPassword,
      });

      await db.createConversation({
        user_id: user.id,
        title: 'Welcome to Multi Mind AI',
        category: 'GENERAL',
      });
    }

    const tokens = this.generateTokens(user);
    return { user, tokens };
  }

  async googleAuth(profile: {
    email: string;
    name?: string;
    avatarUrl?: string;
  }): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string } }> {
    const email = profile.email.toLowerCase().trim();
    if (!email) {
      throw new Error('Google authentication requires an email address');
    }

    let user = await db.getUserByEmail(email);
    if (!user) {
      const dummyPassword = await this.hashPassword(`google_auth_${Date.now()}_${Math.random()}`);
      user = await db.createUser({
        name: profile.name || email.split('@')[0],
        email,
        password_hash: dummyPassword,
      });

      await db.createConversation({
        user_id: user.id,
        title: 'Welcome to Multi Mind AI',
        category: 'GENERAL',
      });
    }

    const tokens = this.generateTokens(user);
    return { user, tokens };
  }

  async login(email: string, password: string): Promise<{ user: User; tokens: { accessToken: string; refreshToken: string } }> {
    const userWithHash = await db.getUserByEmail(email);
    if (!userWithHash) {
      throw new Error('Invalid email or password');
    }

    const isValid = await this.verifyPassword(password, userWithHash.password_hash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const user = await db.getUserById(userWithHash.id);
    if (!user) {
      throw new Error('User record not found');
    }

    const tokens = this.generateTokens(user);
    return { user, tokens };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = this.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await db.getUserById(payload.sub);
    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any }
    );

    return { accessToken };
  }
}

export const authService = new AuthService();
