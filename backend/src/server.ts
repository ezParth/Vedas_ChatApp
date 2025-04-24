import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());

app.get('/', (_req: Request, res: Response) => {
  res.send('Server running');
});

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  socket.on('send-message', (data: any) => {
    console.log("Message recieved: ", data)
    socket.broadcast.emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started`);
});
