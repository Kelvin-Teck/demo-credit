// services/FauxAuthService.ts
import { IFauxTokenData, IAuthUser } from "../interfaces";

class FauxAuthService {
  private tokens: Map<string, IFauxTokenData>;
  private tokenExpirationMs: number;

  constructor(tokenExpirationMs: number = 3600000) {
    this.tokens = new Map();
    this.tokenExpirationMs = tokenExpirationMs;
  }

  generateToken(
    role: string = "user",
    customData: Partial<IFauxTokenData> = {}
  ): string {
    const token = `faux-${Math.random().toString(36).substring(2, 15)}`;
    const expiresAt = Date.now() + this.tokenExpirationMs;

    this.tokens.set(token, {
      expiresAt,
      role,
      ...customData,
    });

    return token;
  }

  verifyToken(token: string): boolean {
    const tokenData = this.tokens.get(token);
    if (!tokenData) return false;

    if (Date.now() > tokenData.expiresAt) {
      this.tokens.delete(token);
      return false;
    }

    return true;
  }

  getTokenData(token: string): IFauxTokenData | null {
    if (!this.verifyToken(token)) return null;
    return this.tokens.get(token) || null;
  }

  invalidateToken(token: string): void {
    this.tokens.delete(token);
  }

  createAuthUser(tokenData: IFauxTokenData): IAuthUser {
    return {
      ...tokenData,
    };
  }
}

export default new FauxAuthService();
