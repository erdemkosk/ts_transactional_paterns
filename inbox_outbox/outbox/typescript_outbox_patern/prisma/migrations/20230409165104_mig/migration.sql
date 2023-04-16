-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderOutbox" (
    "idempotentToken" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "occuredOn" TIMESTAMP(3) NOT NULL,
    "processedDate" TIMESTAMP(3),

    CONSTRAINT "OrderOutbox_pkey" PRIMARY KEY ("idempotentToken")
);
