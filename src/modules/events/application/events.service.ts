import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import {
  CreateEventDto,
  AddActivityDto,
  AddStaffAccessDto,
  SetCampaignDto,
} from '../presentation/dto/events.dto.js';
import * as argon2 from 'argon2';

@Injectable()
export class EventsService {
  // In-memory fallback if database is not available
  private memoryEvents: any[] = [
    {
      id: 'b21b5000-a481-4cb9-8b41-100000000001',
      name: 'Lollapalooza Coca-Cola Stage',
      publicCode: 'LOLLA26',
      type: 'FESTIVAL',
      status: 'ACTIVE',
      startsAt: '2026-10-02T18:00:00Z',
      endsAt: '2026-10-03T02:00:00Z',
      timezone: 'America/Santiago',
      location: 'Parque Cerrillos',
      city: 'Santiago',
      capacity: 5000,
      attendanceGoal: 4000,
      activities: [
        {
          id: 'stand-zero',
          name: 'Stand Zero',
          category: 'SAMPLING',
          maxClaimsPerUser: 1,
          isActive: true,
          productIds: ['zero', 'original'],
        },
        {
          id: 'stand-sprite',
          name: 'Zona Sprite',
          category: 'SAMPLING',
          maxClaimsPerUser: 1,
          isActive: true,
          productIds: ['sprite'],
        },
        {
          id: 'photo',
          name: 'Photocall',
          category: 'PHOTO_BOOTH',
          maxClaimsPerUser: 1,
          isActive: true,
          productIds: [],
        },
      ],
      staff: [
        {
          id: 'demo-staff',
          label: 'Acceso principal',
          canCheckIn: true,
          allowedActivityIds: ['stand-zero', 'photo'],
          revokedAt: null,
        },
      ],
      campaign: {
        codePrefix: 'LOLLA26',
        discountLabel: '30% en tu próximo pack Coca-Cola Zero',
        policy: 'MIN_SENTIMENT',
        minSentiment: 3,
        expiresAt: '2026-11-02T23:59:00Z',
      },
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async listEvents() {
    try {
      const dbEvents = await this.prisma.event.findMany({
        include: {
          activities: {
            include: { products: true },
          },
          staffAccesses: true,
          couponCampaign: true,
        },
        orderBy: { startsAt: 'desc' },
      });

      if (dbEvents.length > 0) {
        return dbEvents.map(this.formatEvent);
      }
    } catch {
      // Fallback to memory
    }
    return this.memoryEvents;
  }

  async getEvent(id: string) {
    try {
      const event = await this.prisma.event.findFirst({
        where: { OR: [{ id }, { publicCode: id.toUpperCase() }] },
        include: {
          activities: {
            include: { products: true },
          },
          staffAccesses: true,
          couponCampaign: true,
        },
      });

      if (event) return this.formatEvent(event);
    } catch {
      // Fallback
    }

    const mem = this.memoryEvents.find(
      (e) => e.id === id || e.publicCode === id.toUpperCase(),
    );
    if (!mem) throw new NotFoundException('Evento no encontrado');
    return mem;
  }

  async createEvent(dto: CreateEventDto) {
    const newId = crypto.randomUUID();
    const eventRecord = {
      ...dto,
      id: newId,
      status: 'DRAFT',
      activities: [],
      staff: [],
      campaign: null,
    };

    try {
      // Try DB
      const admin = await this.prisma.adminUser.findFirst();
      if (admin) {
        await this.prisma.event.create({
          data: {
            id: newId,
            name: dto.name,
            publicCode: dto.publicCode.toUpperCase(),
            type: dto.type as any,
            location: dto.location,
            city: dto.city,
            timezone: dto.timezone || 'America/Santiago',
            startsAt: new Date(dto.startsAt),
            endsAt: new Date(dto.endsAt),
            capacity: dto.capacity,
            attendanceGoal: dto.attendanceGoal,
            createdById: admin.id,
          },
        });
      }
    } catch {
      // Memory fallback
    }

    this.memoryEvents.unshift(eventRecord);
    return eventRecord;
  }

  async transitionEvent(id: string, targetStatus: string) {
    try {
      await this.prisma.event.update({
        where: { id },
        data: { status: targetStatus as any },
      });
    } catch {
      // Memory fallback
    }

    const mem = this.memoryEvents.find((e) => e.id === id);
    if (mem) {
      mem.status = targetStatus;
    }
    return { success: true, status: targetStatus };
  }

  async addActivity(eventId: string, dto: AddActivityDto) {
    const actId = crypto.randomUUID();
    const activity = {
      id: actId,
      name: dto.name,
      category: dto.category,
      maxClaimsPerUser: dto.maxClaimsPerUser,
      isActive: true,
      productIds: dto.productIds || [],
    };

    try {
      await this.prisma.activity.create({
        data: {
          id: actId,
          eventId,
          name: dto.name,
          category: dto.category as any,
          maxClaimsPerUser: dto.maxClaimsPerUser,
          isActive: true,
          products: dto.productIds
            ? {
                create: dto.productIds.map((pId) => ({
                  productId: pId,
                })),
              }
            : undefined,
        },
      });
    } catch {
      // Memory fallback
    }

    const mem = this.memoryEvents.find((e) => e.id === eventId);
    if (mem) {
      mem.activities.push(activity);
    }
    return activity;
  }

  async toggleActivity(activityId: string) {
    let nextStatus = false;
    try {
      const act = await this.prisma.activity.findUnique({
        where: { id: activityId },
      });
      if (act) {
        nextStatus = !act.isActive;
        await this.prisma.activity.update({
          where: { id: activityId },
          data: { isActive: nextStatus },
        });
      }
    } catch {
      // Memory fallback
    }

    for (const ev of this.memoryEvents) {
      const a = ev.activities.find((x: any) => x.id === activityId);
      if (a) {
        a.isActive = !a.isActive;
        nextStatus = a.isActive;
        break;
      }
    }

    return { id: activityId, isActive: nextStatus };
  }

  async addStaffAccess(eventId: string, dto: AddStaffAccessDto) {
    const staffId = crypto.randomUUID();
    const pin = String(
      (crypto.getRandomValues(new Uint32Array(1))[0] % 900000) + 100000,
    );
    const pinHash = await argon2.hash(pin);

    const staffAccess = {
      id: staffId,
      label: dto.label,
      canCheckIn: dto.canCheckIn ?? true,
      allowedActivityIds: dto.allowedActivityIds || [],
      revokedAt: null,
    };

    try {
      await this.prisma.staffAccess.create({
        data: {
          id: staffId,
          eventId,
          label: dto.label,
          pinHash,
          canCheckIn: dto.canCheckIn ?? true,
          allowedActivityIds: dto.allowedActivityIds || [],
        },
      });
    } catch {
      // Memory fallback
    }

    const mem = this.memoryEvents.find((e) => e.id === eventId);
    if (mem) {
      mem.staff.push(staffAccess);
    }

    return {
      staffAccess,
      pin,
    };
  }

  async revokeStaffAccess(staffId: string) {
    const revokedAt = new Date().toISOString();
    try {
      await this.prisma.staffAccess.update({
        where: { id: staffId },
        data: { revokedAt: new Date(revokedAt) },
      });
    } catch {
      // Memory fallback
    }

    for (const ev of this.memoryEvents) {
      const s = ev.staff.find((x: any) => x.id === staffId);
      if (s) {
        s.revokedAt = revokedAt;
        break;
      }
    }

    return { id: staffId, revokedAt };
  }

  async setCampaign(eventId: string, dto: SetCampaignDto) {
    const campaign = {
      codePrefix: dto.codePrefix,
      discountLabel: dto.discountLabel,
      policy: (dto.policy as any) || 'MIN_SENTIMENT',
      minSentiment: dto.minSentiment ?? 3,
      expiresAt: dto.expiresAt,
    };

    try {
      await this.prisma.couponCampaign.upsert({
        where: { eventId },
        update: {
          codePrefix: dto.codePrefix,
          discountLabel: dto.discountLabel,
          policy: (dto.policy as any) || 'MIN_SENTIMENT',
          minSentiment: dto.minSentiment ?? 3,
          expiresAt: new Date(dto.expiresAt),
        },
        create: {
          eventId,
          codePrefix: dto.codePrefix,
          discountLabel: dto.discountLabel,
          policy: (dto.policy as any) || 'MIN_SENTIMENT',
          minSentiment: dto.minSentiment ?? 3,
          expiresAt: new Date(dto.expiresAt),
          maxCoupons: dto.maxCoupons || 1000,
        },
      });
    } catch {
      // Memory fallback
    }

    const mem = this.memoryEvents.find((e) => e.id === eventId);
    if (mem) {
      mem.campaign = campaign;
    }

    return campaign;
  }

  private formatEvent(ev: any) {
    return {
      id: ev.id,
      name: ev.name,
      publicCode: ev.publicCode,
      type: ev.type,
      status: ev.status,
      startsAt: typeof ev.startsAt === 'string' ? ev.startsAt : ev.startsAt.toISOString(),
      endsAt: typeof ev.endsAt === 'string' ? ev.endsAt : ev.endsAt.toISOString(),
      timezone: ev.timezone,
      location: ev.location,
      city: ev.city,
      capacity: ev.capacity,
      attendanceGoal: ev.attendanceGoal,
      activities: (ev.activities || []).map((a: any) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        maxClaimsPerUser: a.maxClaimsPerUser,
        isActive: a.isActive,
        productIds: (a.products || []).map((p: any) => p.productId || p.id),
      })),
      staff: (ev.staffAccesses || []).map((s: any) => ({
        id: s.id,
        label: s.label,
        canCheckIn: s.canCheckIn,
        allowedActivityIds: s.allowedActivityIds || [],
        revokedAt: s.revokedAt ? (typeof s.revokedAt === 'string' ? s.revokedAt : s.revokedAt.toISOString()) : null,
      })),
      campaign: ev.couponCampaign
        ? {
            codePrefix: ev.couponCampaign.codePrefix,
            discountLabel: ev.couponCampaign.discountLabel,
            policy: ev.couponCampaign.policy,
            minSentiment: ev.couponCampaign.minSentiment,
            expiresAt: typeof ev.couponCampaign.expiresAt === 'string' ? ev.couponCampaign.expiresAt : ev.couponCampaign.expiresAt.toISOString(),
          }
        : null,
    };
  }
}
