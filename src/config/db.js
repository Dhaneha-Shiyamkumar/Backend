const mongoose = require("mongoose");
const config = require("./env");

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection failed ${err}`);
  process.exit(-1);
});

mongoose.set("debug", true);

const connect = () => {
  mongoose
    .connect(config.mongo.uri, {
      keepAlive: true,
    })
    .then(() => {
      console.log("Db connection success");
    });
  return mongoose.connection;
};

module.exports = connect;
