import * as express from 'express';
import { Request, Response } from 'express';
import { Order } from './modules/outbox/interfaces/outbox.interface';
import OrderOutboxRepository from './modules/outbox/outbox.repository';

const app = express();
const port = 3000;

app.use(express.json());

const outboxRepository = new OrderOutboxRepository();

app.post('/api/create-order', async (req: Request, res: Response) => {
  const orderData: Order = req.body;

  try {
    await outboxRepository.create(orderData);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while creating the order');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
