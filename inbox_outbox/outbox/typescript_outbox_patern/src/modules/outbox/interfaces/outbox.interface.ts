// eslint-disable-next-line no-shadow
export enum OutboxMessageStatus {
    PENDING = 'PENDING',
    PROCESSED = 'PROCESSED',
    FAILED = 'FAILED',
  }

export interface OrderOutbox {
    idempotentToken : string;
    payload: any;
    status: OutboxMessageStatus;
    occuredOn: Date;
    processedDate?: Date;
  }

export interface Order {
    id: string;
    quantity: number;
    description : string;
  }

export interface OutboxRepository {
    create(payload: any, idempotentToken: string): Promise<void>;
    findByStatus(status: OutboxMessageStatus): Promise<OrderOutbox[]>;
    update(idempotentToken : string, status: OutboxMessageStatus): Promise<void>;
  }
