import * as crypto from 'crypto';

export class QrTokenService {
  private static readonly PREFIX = 'cei1';

  static generateToken(registrationId: string, eventId: string, secret: string): string {
    const payload = `${this.PREFIX}|${registrationId}|${eventId}`;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    // 16 bytes signature truncated in base64url
    const signature = hmac.digest().subarray(0, 16).toString('base64url');
    return `${this.PREFIX}.${registrationId}.${signature}`;
  }

  static computeHash(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static verify(
    token: string,
    eventId: string,
    secret: string,
    previousSecret?: string,
  ): { registrationId: string; valid: boolean } {
    const parts = token.split('.');
    if (parts.length !== 3 || parts[0] !== this.PREFIX) {
      return { registrationId: '', valid: false };
    }

    const [, registrationId, signature] = parts;
    const expectedSigCurrent = this.createSignature(registrationId, eventId, secret);

    if (this.timingSafeEqual(signature, expectedSigCurrent)) {
      return { registrationId, valid: true };
    }

    if (previousSecret) {
      const expectedSigPrev = this.createSignature(registrationId, eventId, previousSecret);
      if (this.timingSafeEqual(signature, expectedSigPrev)) {
        return { registrationId, valid: true };
      }
    }

    return { registrationId, valid: false };
  }

  private static createSignature(registrationId: string, eventId: string, secret: string): string {
    const payload = `${this.PREFIX}|${registrationId}|${eventId}`;
    return crypto.createHmac('sha256', secret).update(payload).digest().subarray(0, 16).toString('base64url');
  }

  private static timingSafeEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  }
}
