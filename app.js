const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

app.listen(process.env.PORT_NUMBER);

const userRouter = require("./routes/users");
const bookRouter = require("./routes/books");
const likeRouter = require("./routes/likes");
const orderRouter = require("./routes/orders");
const cartRouter = require("./routes/carts");

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/likes", likeRouter);
app.use("/orders", orderRouter);
app.use("/carts", cartRouter);
