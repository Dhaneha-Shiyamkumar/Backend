const path = require("path");
const { v4 } = require("uuid");

require("dotenv-safe").config({
  path: path.join(__dirname, "../../.env"),
});

const SECRET = v4();

module.exports = {
  mongo: {
    uri: process.env.MONGO_DB_STRING,
  },
  isDev: process.env.NODE_ENV === "dev",
  host: "http://localhost:3000/",
  ACCESS_TOKEN_SECRET: process.env.SECRET ? process.env.SECRET : SECRET,
  bcryptRounds: 10,
};
