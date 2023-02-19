const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { notFound, handler } = require("../api/middlewares/error");
const v1 = require("../api/routes/index");

const app = express();

// log requests -> dev: console || prod : file
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(bodyParser.json());
app.use(cors());

app.use("/v1", v1);

app.use(notFound);
app.use(handler);

module.exports = app;
