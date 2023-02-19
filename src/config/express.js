const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { notFound, handler } = require("../api/middlewares/error");

const app = express();

// log requests -> dev: console || prod : file
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(bodyParser.json());
app.use(cors());

//@TODO mount routes
// app.use("/v1", v1);

app.use(notFound);
app.use(handler);

module.exports = app;
