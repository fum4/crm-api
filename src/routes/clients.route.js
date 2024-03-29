import express from 'express';
import { ClientsController } from '../controllers';
import { authJwt } from '../middleware';

const ClientsRouter = express.Router();

ClientsRouter.use(authJwt.verifyToken);

ClientsRouter.get('/clients', ClientsController.getClients);

ClientsRouter.post('/client', ClientsController.addClient);

ClientsRouter.put('/client/:id', ClientsController.modifyClient);

ClientsRouter.delete('/client/:id', ClientsController.removeClient);

ClientsRouter.get('/appointments', ClientsController.getAppointmentsAndControls);

ClientsRouter.post('/appointment/:clientId?', ClientsController.addAppointment);

ClientsRouter.put('/appointment/:id', ClientsController.modifyAppointment);

ClientsRouter.delete('/appointment/:id', ClientsController.removeAppointment);

ClientsRouter.put('/control/:id', ClientsController.modifyControl);

ClientsRouter.delete('/control/:id', ClientsController.removeControl);

export default ClientsRouter;
