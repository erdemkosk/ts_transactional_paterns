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

