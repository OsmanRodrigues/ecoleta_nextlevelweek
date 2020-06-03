import express, { response, request } from 'express';

import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const routes = express.Router();

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.use(express.json());

routes.get('/items', itemsController.index);

routes.post('/points', pointsController.create);
routes.post('/points', pointsController.index );
routes.get('/points/:id', pointsController.show);

// Index, show, create, delete (padrão dos constructors controllors)

export default routes;