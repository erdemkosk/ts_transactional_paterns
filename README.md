
![cote](https://i.imgur.com/mr8sCze.png)


Motivation 🧐
====

Transactional patterns are crucial in modern software development, enabling the creation of reliable, secure, and performant applications. With TypeScript, a popular programming language known for its static type safety, powerful object-oriented programming capabilities, and support for modern JavaScript features, developers have a robust toolset for implementing complex transactions with minimal errors.

This repository aims to provide a comprehensive resource for using Transactional patterns with TypeScript. It will include sample code, guides, and resources that empower developers to understand and implement these patterns effectively. By centralizing these patterns in one place, the repository will offer quick and easy access for developers who want to leverage Transactional patterns in their TypeScript projects.

Additionally, the repository may be open to community contributions, allowing developers to share their experiences, ideas, and sample code, fostering collaboration and knowledge sharing within the community.


## FAQ 😉

#### What is the purpose of this repository?
This repository aims to provide resources, sample code, and guides for using transactional patterns with TypeScript.

#### What transactional patterns are included in this repository?
Currently, the repository includes the Outbox Pattern, which is used for asynchronous communication in applications.

#### Are there any plans to add more transactional patterns in the future?
Yes, the Inbox Pattern is planned to be added in the future, which facilitates processing and storing of incoming messages from external systems.

#### Is this repository open to community contributions?
Yes, this repository may be open to community contributions, allowing developers to share their experiences, ideas, and sample code related to transactional patterns with TypeScript.

#### How can I use the sample code and guides in this repository?
The sample code and guides in this repository are intended to provide guidance on implementing transactional patterns with TypeScript. Developers can refer to the resources provided and adapt the sample code to their specific use cases.

#### Where can I find more information on transactional patterns and TypeScript?
Developers can refer to the documentation and resources available on the official TypeScript website and other online sources for more information on transactional patterns and TypeScript.

#### How can I contribute to this repository?
If you would like to contribute to this repository, you can submit pull requests, raise issues, or provide feedback on the existing content. Please refer to the contribution guidelines in the repository for more information on how to contribute.
## Documentation 🤓
## Inbox and Outbox Patterns 📥📤

The inbox and outbox patterns are common transactional patterns used in distributed systems and microservices architectures. They are designed to provide reliable and scalable solutions for handling data consistency and communication between different parts of an application or across multiple services.

### Outbox Pattern 📤

The outbox pattern involves storing events or data that need to be communicated to external systems or services in an "outbox" or "message queue". This allows the application to continue processing without waiting for external services to acknowledge or process the data. Asynchronously, a separate process or service reads the data from the outbox and sends it to the intended recipients. This decouples the sending of data from the main application logic, improves performance, and provides fault tolerance.

When we run with __"npm run dev"__ on typescript_outbox_patern there is an endpoint like that. We can create an order with using that.
In this project ı used a prisma (Prisma unlocks a new level of developer experience when working with databases thanks to its intuitive data model, automated migrations, type-safety & auto-completion).
In db layer I selected __postgresql__. If u want to run with your local u can run with __"docker compose up -d"__
```bash
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}


model Order {
  id          String       @id @default(uuid())
  quantity    Int
  description String
}

model OrderOutbox {
  idempotentToken         String       @id @default(uuid())
  payload         Json
  status          String
  occuredOn      DateTime
  processedDate   DateTime?
}
```

![create-order](https://i.imgur.com/GxNPWUk.png)

When we made a request this endpoint this service create an order in db in the same time it's creating a outbox table and insert with status.

```bash
export enum OutboxMessageStatus {
    PENDING = 'PENDING',
    PROCESSED = 'PROCESSED',
    FAILED = 'FAILED',
  }
```

So when orderoutbox created with __PENDING__ , after that when cron is processed it's returning __PROCESSED__ or __FAILED__

![order-list](https://i.imgur.com/ZW9eKzo.png)

As we can see there is several outbox objects in db layer. They are waiting to processed.

![cron-ss](https://i.imgur.com/qvflc13.png)

So in cron layer as we can see we started to processed.

![cron-processed](https://i.imgur.com/sRivVJ7.png)

Some of them marked as __PROCESSED__ 

![cron-failed](https://i.imgur.com/4u8ZPdU.png)

Some of them marked as __FAILED__ or __PROCESSED__ so we can retry the failed ones and we can check in rabbitMQ layer.

![rabbitmq](https://i.imgur.com/W7dKZJy.png)

So when scale the cron process as we can see we locked values with __FOR UPDATE__ and __SKIP LOCKED__

![cron1](https://i.imgur.com/oXREDXZ.png)

cron 1

![cron2](https://i.imgur.com/wfqZxcY.png)

cron 2





### Inbox Pattern 📥

The inbox pattern complements the outbox pattern and involves storing incoming events or data in an "inbox" or "message queue". This allows the application to receive data from external systems or services in an asynchronous manner, without blocking the main application logic. The data in the inbox is then processed by the application, ensuring data consistency and integrity.

Both the inbox and outbox patterns are widely used in distributed systems, microservices architectures, and event-driven architectures to ensure reliable communication and data consistency. By leveraging these patterns, applications can achieve better scalability, fault tolerance, and performance.

For more information on implementing the inbox and outbox patterns in TypeScript, refer to the respective guides and sample code available in this repository.


## Road Map 🤥

- Adding inbox patern

- Adding event sourcing patern

- Adding unit tests

  
## Lisans

[MIT](https://choosealicense.com/licenses/mit/)

  