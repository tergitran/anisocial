import express from "express";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import morgan from "morgan";

const Schema = mongoose.Schema;

const mongoDb =
  "mongodb+srv://tdan:mylove123@cluster0.feajubf.mongodb.net/anisocial?retryWrites=true&w=majority";
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
  }),
  "user"
);

dotenv.config();

const app = express();
const PORT = process.env.PORT_AUTH || 5500;

import cors from "cors";
app.use(cors());

app.use(express.json());
app.use(morgan('combined'));

let refreshTokens = [];

app.post("/api/v1/refreshToken", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) {
    res.sendStatus(403);
  }
  Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err) res.sendStatus(403);
    const accessToken = Jwt.sign(
      { username: data.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m",
      }
    );
    const refreshTOken = Jwt.sign(
      { username: data.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3m",
      }
    );
    res.json({ accessToken });
  });
});

app.post("/api/v1/sign-up", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    res.status(401).json({message: 'username already in use'});
  } else {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        res.status(500).end(); // should i use another middle ware handle error
      }
      const user = new User({
        username: req.body.username,
        password: hashedPassword
      });
      try {
        const result = await user.save();
        res.status(200).end();
      } catch (error) {
        res.status(500).end();
      }
    })
  }

});

app.post("/api/v1/login", async (req, res) => {
  const data = req.body;

  // Authentication successful
  const user = await User.findOne({ username: data.username });
  if (!user) {
    res.status(401).json({message: "Incorrect User"});
    return;
  }
  bcrypt.compare(data.password, user.password, (err, result) => {
    if (result) {
      // Authorization

      const data_authen = {
        username: data.username,
        id: user._id
      }
      const accessToken = Jwt.sign(data_authen, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      const refreshToken = Jwt.sign(data_authen, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);
      res.json({ accessToken, refreshToken });
    } else {
      res.status(401).json({message: "Incorrect Password"});
    }
  });
});

app.post("/api/v1/logout", (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token != refreshToken);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
