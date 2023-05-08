import express from 'express';
import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import morgan from "morgan";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT_SERVER || 5000;

import cors from "cors";
import PostRouter from './routes/post.js';
import UserRouter from './routes/user.js';
import FriendRouter from './routes/friends.js';
import userController from './controllers/userController.js';


const mongoDb =
  "mongodb+srv://tdan:mylove123@cluster0.feajubf.mongodb.net/anisocial?retryWrites=true&w=majority";
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

app.use(cors());

app.use(express.json());
// app.use(morgan('combined'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));


app.use(authenToken);
app.use('/', PostRouter);
app.get('/people', userController.getAllPeople);
app.use('/friends', FriendRouter);
app.use('/user', UserRouter);

function authenToken(req, res, next) {
  // console.log("req.headers", req.headers['authorization']);
  const authorizationHeader = req.headers['authorization'];
  if (!authorizationHeader) {
    res.sendStatus(401);
    return;
  }
  // 'Bearer [token]'
  const token = authorizationHeader.split(' ')[1];
  if (!token) {
    res.sendStatus(401);
    return;
  } else {
    Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) return res.sendStatus(401);
      req.userInfo = data;
      next();
    });
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
})