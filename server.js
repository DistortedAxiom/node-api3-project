const express = require('express');
const morgan = require("morgan");

const server = express();

const postRouter = require("./posts/postRouter.js");
const userRouter = require("./users/userRouter.js");

server.use(express.json());

server.use(morgan('combined'));

server.use("/api/posts", postRouter);
server.use("/api/users", userRouter);

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      'Origin'
    )}`
  );

  next();
}
module.exports = server;
