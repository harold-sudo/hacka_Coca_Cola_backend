export declare class QrTokenService {
    private static readonly PREFIX;
    static generateToken(registrationId: string, eventId: string, secret: string): string;
    static computeHash(token: string): string;
    static verify(token: string, eventId: string, secret: string, previousSecret?: string): {
        registrationId: string;
        valid: boolean;
    };
    private static createSignature;
    private static timingSafeEqual;
}
