var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsISO8601 } from 'class-validator';
export class CheckInRequestDto {
    qrToken;
    clientScanId;
    scannedAt;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'El token QR es obligatorio' }),
    __metadata("design:type", String)
], CheckInRequestDto.prototype, "qrToken", void 0);
__decorate([
    IsUUID('4', { message: 'clientScanId debe ser un UUID válido' }),
    IsNotEmpty(),
    __metadata("design:type", String)
], CheckInRequestDto.prototype, "clientScanId", void 0);
__decorate([
    IsISO8601(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CheckInRequestDto.prototype, "scannedAt", void 0);
export class SamplingRequestDto {
    qrToken;
    activityId;
    productId;
    clientScanId;
    scannedAt;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: 'El token QR es obligatorio' }),
    __metadata("design:type", String)
], SamplingRequestDto.prototype, "qrToken", void 0);
__decorate([
    IsUUID('4', { message: 'activityId debe ser un UUID válido' }),
    IsNotEmpty(),
    __metadata("design:type", String)
], SamplingRequestDto.prototype, "activityId", void 0);
__decorate([
    IsUUID('4', { message: 'productId debe ser un UUID válido' }),
    IsOptional(),
    __metadata("design:type", String)
], SamplingRequestDto.prototype, "productId", void 0);
__decorate([
    IsUUID('4', { message: 'clientScanId debe ser un UUID válido' }),
    IsNotEmpty(),
    __metadata("design:type", String)
], SamplingRequestDto.prototype, "clientScanId", void 0);
__decorate([
    IsISO8601(),
    IsNotEmpty(),
    __metadata("design:type", String)
], SamplingRequestDto.prototype, "scannedAt", void 0);
//# sourceMappingURL=scan.dto.js.map