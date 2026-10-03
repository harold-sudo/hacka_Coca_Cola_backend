export declare class CheckInRequestDto {
    qrToken: string;
    clientScanId: string;
    scannedAt: string;
}
export declare class SamplingRequestDto {
    qrToken: string;
    activityId: string;
    productId?: string;
    clientScanId: string;
    scannedAt: string;
}
