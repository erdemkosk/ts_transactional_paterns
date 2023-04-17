import { PrismaClient } from '@prisma/client';
import { OutboxMessageStatus, OrderOutbox } from './interfaces';
import { RabbitMQProducer } from './rabitmq'
import * as cron from 'node-cron';

const prisma = new PrismaClient();

const rabbitMQProducer = new RabbitMQProducer();

// Cron işlemi
async function cronJob() {
  await rabbitMQProducer.connect();
  try {
    const maxMessages = 10;

    await prisma.$transaction(async (transaction) => {
        const maxMessages = 10;

        const orderOutboxDatas : OrderOutbox [] = await transaction.$queryRaw`
        SELECT * FROM "OrderOutbox"
        WHERE "status" = ${OutboxMessageStatus.PENDING}
        LIMIT ${maxMessages}
        FOR UPDATE
        SKIP LOCKED
      `;
    
          for (const outboxData of orderOutboxDatas) {
            console.log(JSON.stringify(outboxData))
            const isSuccess = await rabbitMQProducer.sendToQueue('order_channel', JSON.stringify(outboxData));

            if (isSuccess) {
                // RabbitMQ kuyruğuna başarıyla gönderildiyse "status" değerini güncelle
                await transaction.orderOutbox.update({
                  where: { idempotentToken: outboxData.idempotentToken },
                  data: { status: OutboxMessageStatus.PROCESSED, processedDate: new Date() },
                });
              } else {
                // RabbitMQ kuyruğuna gönderilemediyse "status" değerini "failed" olarak güncelle
                await transaction.orderOutbox.update({
                  where: { idempotentToken: outboxData.idempotentToken },
                  data: { status: OutboxMessageStatus.FAILED, processedDate: new Date() },
                });
              }
            
        }
      });
  } catch (error) {
    console.error('Error processing outbox messages:', error); // Hata durumunda hata mesajını logla
    await rabbitMQProducer.close();
  } finally {
    await prisma.$disconnect(); // Prisma bağlantısını kapat
  }
}

// Cron işlemi
cron.schedule('* * * * *', async () => {
  // Buraya cron görevi içinde yapılması gereken işlemleri ekleyin
  cronJob();
});


