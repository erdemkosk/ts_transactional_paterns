import * as amqp from 'amqplib';

export class RabbitMQProducer {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {
  }

  async connect(): Promise<void> {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL); // RabbitMQ bağlantı adresini güncelleyin
    this.channel = await this.connection.createChannel();
  }

  async sendToQueue(queueName: string, message: string): Promise<boolean> {
    try {
      await this.channel.assertQueue(queueName, { durable: true });
      const isSent = await this.channel.sendToQueue(queueName, Buffer.from(message));
      return isSent;
    } catch (error) {
      console.error('RabbitMQ send error:', error);
      return false;
    }
  }

  async close(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }
}
