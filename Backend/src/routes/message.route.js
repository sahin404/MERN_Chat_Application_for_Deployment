import express from 'express';
import { getMessage, getUsersForSideBar, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const messageRouter = express.Router();

messageRouter.get('/users', protectRoute, getUsersForSideBar);
messageRouter.get('/get/:id', protectRoute, getMessage);
messageRouter.post('/send/:id', protectRoute, sendMessage);


export default messageRouter;