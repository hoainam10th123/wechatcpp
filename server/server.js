import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js'
import { authorized } from './middleware/authMiddleware.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRouter from './routes/authRoute.js'
import errorRouter from './routes/errorRoute.js'
import conversationRouter from './routes/conversationRoute.js'
import messageRouter from './routes/messageRoute.js'
import userRouter from './routes/userRoute.js'
import { Server } from "socket.io";
import { createServer } from "http";
import socketServer from './socketServer.js'
import { socketMiddleware, socketErrorMiddleware } from './middleware/socketMiddleware.js'

import { dirname } from 'path'
import path from 'path'
import { fileURLToPath } from 'url'
import logger from './configs/logger.config.js'

const app = express()
const httpServer = createServer(app);
const apiBaseUrl = process.env.API_URL

const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(cors({
    origin: process.env.CLIENT_ENDPOINT,
    credentials: true,//cookies
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

app.use(express.static(path.resolve(__dirname, './wwwroot')))
app.use(cookieParser())
app.use(express.json())
app.use(morgan('tiny'))

// api
app.use(`${apiBaseUrl}/auth`, authRouter)
app.use(`${apiBaseUrl}/messages`, authorized, messageRouter)
app.use(`${apiBaseUrl}/conversations`, conversationRouter)
app.use(`${apiBaseUrl}/users`, userRouter);
app.use(`${apiBaseUrl}/error`, errorRouter)

// deploy react and nodejs
app.get('*', (req, res) => {
    //res.sendFile(path.resolve(__dirname, './wwwroot', 'index.html'));
});

app.use(errorHandlerMiddleware)// dat cuoi cung

//socket io
const io = new Server(httpServer, {
    transports: ["websocket"],
    maxHttpBufferSize: 10*1024*1024,// 10MB
    pingTimeout: 640000,// tang thoi gian len de socket khong bi ngat ket noi,
    pingInterval: 40000,    
    cors: {
        origin: process.env.CLIENT_ENDPOINT,
    },
});

io.use(socketMiddleware);

io.on("connection", (socket) => {
    logger.info("socket io connected successfully.");
    app.set("socketio", {io, socket});
    socketServer(socket, io);
});

//io.engine.use(socketErrorMiddleware)

try {
    const port = process.env.PORT || 8000
    await mongoose.connect(process.env.MONGO_NET_URL)
    logger.info('Database ready')
    httpServer.listen(port);
    console.log(`Server running on port ${port}`)
} catch (error) {
    console.error(error)
    process.exit(1)
}