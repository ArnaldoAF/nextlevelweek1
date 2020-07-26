import express, { response } from 'express';
import knex from './database/connections';
import { KnexTimeoutError } from 'knex';

import PointsController from './controllers/PointsController';
import ItensController from './controllers/ItensController';

const routes = express.Router();
const pointsController = new PointsController();
const itensController = new ItensController();

routes.get('/hi', (request, response) => {
    return response.json({ message: "Tudo Ok" })
});

routes.get('/itens', itensController.index);
routes.post('/points', pointsController.create);
routes.get('/points/:id', pointsController.show);

export default routes;