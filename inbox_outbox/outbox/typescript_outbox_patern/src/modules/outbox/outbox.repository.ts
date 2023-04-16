import { PrismaClient, Prisma } from '@prisma/client';
import {
  OrderOutbox, OutboxMessageStatus, OutboxRepository, Order,
} from './interfaces/outbox.interface';

const prisma = new PrismaClient();

export default class orderOutboxRepository implements OutboxRepository {
  async create(data: Omit<Order, 'id'>): Promise<void> {
    await prisma.$transaction(async (transection) => {
      const order = await transection.order.create({
        data,
      });

      await transection.orderOutbox.create({
        data: {
          payload: JSON.stringify(order),
          occuredOn: new Date(),
          status: OutboxMessageStatus.PENDING,
        },
      });
    });
  }

  async findByStatus(status: OutboxMessageStatus): Promise<OrderOutbox[]> {
    const messages = await prisma.orderOutbox.findMany({
      where: {
        status,
      },
    });

    return messages.map((message) => {
      const orderOutbox: OrderOutbox = {
        idempotentToken: message.idempotentToken,
        payload: message.payload,
        status: message.status as OutboxMessageStatus,
        occuredOn: message.occuredOn,
        processedDate: message.processedDate,
      };
      return orderOutbox;
    });
  }

  async update(idempotentToken : string, status: OutboxMessageStatus): Promise<void> {
    await prisma.orderOutbox.update({
      where: {
        idempotentToken,
      },
      data: {
        processedDate: new Date(),
        status,
      },
    });
  }
}
