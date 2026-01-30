import express from 'express';
import routers from './routers/index.js';
import authRouter from './routers/auth.js';
import selectionsRouter from './routers/selections.js';
import selectionOrdersRouter from './routers/selectionOrders.js';
import selectionDetailsRouter from './routers/selectionDetails.js';

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/selections', selectionsRouter);
app.use('/api/selection-orders', selectionOrdersRouter);
app.use('/api/selection-details', selectionDetailsRouter);
app.use('/api', routers);

export default app;