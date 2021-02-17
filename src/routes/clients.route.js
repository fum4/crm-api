import express from 'express';
import { ClientsController } from '../controllers';
// import { authJwt } from '../middleware';

const ClientsRouter = express.Router();

// ClientsRouter.use(authJwt.verifyToken);

ClientsRouter.get('/clients', ClientsController.getClients);

ClientsRouter.post('/client', ClientsController.addClient);

ClientsRouter.delete('/client', ClientsController.removeClient);

ClientsRouter.get('/appointments', ClientsController.getAppointments);

ClientsRouter.post('/appointment/:clientId?', ClientsController.addAppointment);

ClientsRouter.put('/appointment/:id', ClientsController.modifyAppointment);

ClientsRouter.delete('/appointment/:id', ClientsController.removeAppointment);

export default ClientsRouter;
