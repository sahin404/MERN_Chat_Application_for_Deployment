import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import { dbConnect } from './libs/db.js';
import messageRouter from './routes/message.route.js';
import cors from 'cors';
import {app,server} from './libs/socket.js';
import path from 'path';
import axios from 'axios'

//for no rendering in render
const url = `https://mern-chat-app-2cls.onrender.com/`;
const interval = 30000;

function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log("website reloded");
    })
    .catch((error) => {
      console.error(`Error : ${error.message}`);
    });
}

setInterval(reloadWebsite, interval);


//middlewares
dotenv.config();

/*------------------Production --------------------*/
const __dirname = path.resolve();

// app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

//routes
app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);


/*------------------Production --------------------*/
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}


//server running
server.listen(process.env.PORT, ()=>{
    console.log('Server Running at port: 3000');
    dbConnect();
})