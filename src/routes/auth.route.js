import express from 'express';
import { AuthController } from '../controllers';
import { verifyRegister } from '../middleware';

const AuthRouter = express.Router();

AuthRouter.post('/login', AuthController.login);

AuthRouter.post('/register', [
    verifyRegister.checkDuplicateUsernameOrEmail
  ],
  AuthController.register);

export default AuthRouter;
