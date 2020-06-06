import express, { response, request } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const routes = express.Router();
const uplodad = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.use(express.json());

routes.get('/items', itemsController.index);
routes.get('/points', pointsController.index );
routes.get('/points/:id', pointsController.show);

routes.post('/points', uplodad.single('image'), pointsController.create);

// Index, show, create, delete (padrão dos constructors controllors)

export default routes;