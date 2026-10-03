import * as crypto from 'crypto';
export class QrTokenService {
    static PREFIX = 'cei1';
    static generateToken(registrationId, eventId, secret) {
        const payload = `${this.PREFIX}|${registrationId}|${eventId}`;
        const hmac = crypto.createHmac('sha256', secret);
        hmac.update(payload);
        const signature = hmac.digest().subarray(0, 16).toString('base64url');
        return `${this.PREFIX}.${registrationId}.${signature}`;
    }
    static computeHash(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    static verify(token, eventId, secret, previousSecret) {
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
    static createSignature(registrationId, eventId, secret) {
        const payload = `${this.PREFIX}|${registrationId}|${eventId}`;
        return crypto.createHmac('sha256', secret).update(payload).digest().subarray(0, 16).toString('base64url');
    }
    static timingSafeEqual(a, b) {
        const bufA = Buffer.from(a);
        const bufB = Buffer.from(b);
        if (bufA.length !== bufB.length)
            return false;
        return crypto.timingSafeEqual(bufA, bufB);
    }
}
//# sourceMappingURL=qr-token.service.js.map