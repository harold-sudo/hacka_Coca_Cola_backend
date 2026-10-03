import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { MetaCloudWhatsappGateway } from '../infrastructure/meta-cloud-whatsapp.gateway.js';
import { QrTokenService } from '../../../shared/infrastructure/security/qr-token.service.js';
import { ConversationStep, AgeRange } from '@prisma/client';

export interface InboundMessageDto {
  waMessageId: string;
  from: string;
  type: string;
  text?: string;
  mediaId?: string;
}

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);
  private readonly qrSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly whatsappGateway: MetaCloudWhatsappGateway,
    private readonly configService: ConfigService,
  ) {
    this.qrSecret = this.configService.get<string>('QR_SIGNING_SECRET', 'qr-default-secret');
  }

  async handleInbound(msg: InboundMessageDto) {
    this.logger.log(`Received WhatsApp message ${msg.waMessageId} from ${msg.from}`);

    // Deduplication check
    const existing = await this.prisma.whatsappMessage.findUnique({
      where: { waMessageId: msg.waMessageId },
    });
    if (existing) {
      this.logger.warn(`Duplicate message ${msg.waMessageId} ignored`);
      return { status: 'duplicate' };
    }

    // Save message record
    await this.prisma.whatsappMessage.create({
      data: {
        waMessageId: msg.waMessageId,
        direction: 'INBOUND',
        phoneHash: QrTokenService.computeHash(msg.from),
        type: msg.type,
      },
    });

    // Find or create session
    let session = await this.prisma.conversationSession.findUnique({
      where: { phoneNumber: msg.from },
    });

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    if (!session) {
      session = await this.prisma.conversationSession.create({
        data: {
          phoneNumber: msg.from,
          step: ConversationStep.IDLE,
          expiresAt,
        },
      });
    }

    const cleanText = (msg.text || '').trim().toUpperCase();

    // 1. Global Commands
    if (cleanText === 'AYUDA' || cleanText === 'HELP') {
      await this.whatsappGateway.sendText(
        msg.from,
        '¡Hola! Soy el asistente oficial de Coca-Cola Events. Puedes escribir el código de tu evento (ej. #LOLLA26), consultar "MI QR" o "CANCELAR".',
      );
      return { handled: true };
    }

    // 2. Event Code match
    if (cleanText.startsWith('#')) {
      const code = cleanText.replace('#', '');
      const event = await this.prisma.event.findUnique({
        where: { publicCode: code },
      });

      if (!event) {
        await this.whatsappGateway.sendText(
          msg.from,
          `Lo sentimos, no encontramos un evento activo con el código #${code}.`,
        );
        return { handled: true };
      }

      await this.prisma.conversationSession.update({
        where: { id: session.id },
        data: {
          eventId: event.id,
          step: ConversationStep.ASK_NAME,
          draft: {},
        },
      });

      await this.whatsappGateway.sendText(
        msg.from,
        `¡Genial! Te estás inscribiendo para "${event.name}".\nPor favor, responde con tu Nombre Completo:`,
      );
      return { handled: true };
    }

    // 3. State Machine Onboarding
    switch (session.step) {
      case ConversationStep.ASK_NAME: {
        const fullName = (msg.text || '').trim();
        if (fullName.length < 3) {
          await this.whatsappGateway.sendText(msg.from, 'Por favor, escribe un nombre válido.');
          return { handled: true };
        }

        await this.prisma.conversationSession.update({
          where: { id: session.id },
          data: {
            step: ConversationStep.ASK_AGE,
            draft: { ...(session.draft as any), fullName },
          },
        });

        await this.whatsappGateway.sendButtons(msg.from, '¿Cuál es tu rango de edad?', [
          { id: 'AGE_18_24', title: '18 a 24 años' },
          { id: 'AGE_25_34', title: '25 a 34 años' },
          { id: 'AGE_35_44', title: '35 o más' },
        ]);
        return { handled: true };
      }

      case ConversationStep.ASK_AGE: {
        const ageSelection = cleanText.includes('18')
          ? AgeRange.AGE_18_24
          : cleanText.includes('25')
          ? AgeRange.AGE_25_34
          : AgeRange.AGE_35_44;

        await this.prisma.conversationSession.update({
          where: { id: session.id },
          data: {
            step: ConversationStep.ASK_CITY,
            draft: { ...(session.draft as any), ageRange: ageSelection },
          },
        });

        await this.whatsappGateway.sendText(msg.from, '¿De qué ciudad nos visitas?');
        return { handled: true };
      }

      case ConversationStep.ASK_CITY: {
        const city = (msg.text || '').trim();
        await this.prisma.conversationSession.update({
          where: { id: session.id },
          data: {
            step: ConversationStep.ASK_CONSENT,
            draft: { ...(session.draft as any), city },
          },
        });

        await this.whatsappGateway.sendButtons(
          msg.from,
          'Para generar tu pase QR, ¿aceptas los términos y tratamiento de datos de Coca-Cola?',
          [
            { id: 'YES', title: 'Sí, Acepto' },
            { id: 'NO', title: 'No Acepto' },
          ],
        );
        return { handled: true };
      }

      case ConversationStep.ASK_CONSENT: {
        if (!cleanText.includes('SI') && !cleanText.includes('ACEPTO') && !cleanText.includes('YES')) {
          await this.prisma.conversationSession.update({
            where: { id: session.id },
            data: { step: ConversationStep.IDLE, draft: {} },
          });
          await this.whatsappGateway.sendText(
            msg.from,
            'Has rechazado los términos. Tu inscripción no fue procesada. ¡Esperamos verte pronto!',
          );
          return { handled: true };
        }

        // Create participant, registration and generate QR
        const draft = session.draft as any;
        const participant = await this.prisma.participant.upsert({
          where: { phoneNumber: msg.from },
          update: {
            fullName: draft.fullName,
            ageRange: draft.ageRange || AgeRange.AGE_18_24,
            city: draft.city || 'Santiago',
            dataConsent: true,
            consentAt: now,
            consentVersion: 'v1.0',
            lastInboundAt: now,
          },
          create: {
            phoneNumber: msg.from,
            fullName: draft.fullName,
            ageRange: draft.ageRange || AgeRange.AGE_18_24,
            city: draft.city || 'Santiago',
            dataConsent: true,
            marketingConsent: true,
            consentAt: now,
            consentVersion: 'v1.0',
            lastInboundAt: now,
          },
        });

        const eventId = session.eventId!;
        const registrationId = crypto.randomUUID();
        const qrToken = QrTokenService.generateToken(registrationId, eventId, this.qrSecret);
        const qrHash = QrTokenService.computeHash(qrToken);

        await this.prisma.registration.create({
          data: {
            id: registrationId,
            participantId: participant.id,
            eventId,
            qrHash,
          },
        });

        await this.prisma.conversationSession.update({
          where: { id: session.id },
          data: {
            step: ConversationStep.IDLE,
            participantId: participant.id,
            draft: {},
          },
        });

        await this.whatsappGateway.sendText(
          msg.from,
          `¡Felicidades ${participant.fullName}! 🎉 Tu inscripción está confirmada.\n\nAquí tienes tu Pase Digital Coca-Cola:\nToken: ${qrToken}\n\nPresenta tu código QR en el acceso del evento para ingresar y canjear tus bebidas gratuitas.`,
        );
        return { handled: true };
      }

      default:
        await this.whatsappGateway.sendText(
          msg.from,
          'Escribe el código de tu evento (ejemplo: #LOLLA26) para comenzar tu registro.',
        );
        return { handled: true };
    }
  }
}
