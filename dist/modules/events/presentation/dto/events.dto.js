var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsBoolean } from 'class-validator';
export class CreateEventDto {
    name;
    publicCode;
    type;
    location;
    city;
    timezone;
    startsAt;
    endsAt;
    capacity;
    attendanceGoal;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "name", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "publicCode", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "type", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "location", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "city", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "timezone", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "startsAt", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "endsAt", void 0);
__decorate([
    IsNumber(),
    __metadata("design:type", Number)
], CreateEventDto.prototype, "capacity", void 0);
__decorate([
    IsNumber(),
    __metadata("design:type", Number)
], CreateEventDto.prototype, "attendanceGoal", void 0);
export class TransitionEventDto {
    target;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], TransitionEventDto.prototype, "target", void 0);
export class AddActivityDto {
    name;
    category;
    maxClaimsPerUser;
    productIds;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], AddActivityDto.prototype, "name", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], AddActivityDto.prototype, "category", void 0);
__decorate([
    IsNumber(),
    __metadata("design:type", Number)
], AddActivityDto.prototype, "maxClaimsPerUser", void 0);
__decorate([
    IsArray(),
    IsOptional(),
    __metadata("design:type", Array)
], AddActivityDto.prototype, "productIds", void 0);
export class AddStaffAccessDto {
    label;
    canCheckIn;
    allowedActivityIds;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], AddStaffAccessDto.prototype, "label", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], AddStaffAccessDto.prototype, "canCheckIn", void 0);
__decorate([
    IsArray(),
    IsOptional(),
    __metadata("design:type", Array)
], AddStaffAccessDto.prototype, "allowedActivityIds", void 0);
export class SetCampaignDto {
    codePrefix;
    discountLabel;
    policy;
    minSentiment;
    expiresAt;
    maxCoupons;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], SetCampaignDto.prototype, "codePrefix", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], SetCampaignDto.prototype, "discountLabel", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], SetCampaignDto.prototype, "policy", void 0);
__decorate([
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], SetCampaignDto.prototype, "minSentiment", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    __metadata("design:type", String)
], SetCampaignDto.prototype, "expiresAt", void 0);
__decorate([
    IsNumber(),
    IsOptional(),
    __metadata("design:type", Number)
], SetCampaignDto.prototype, "maxCoupons", void 0);
//# sourceMappingURL=events.dto.js.map