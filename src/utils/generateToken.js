const { sign } = require("jsonwebtoken");
const env = require("../config/env");

const createAccessToken = (options) => {
  return sign(
    {
      id: options?.id,
      email: options?.email,
      accountType: options?.accountType,
    },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = createAccessToken;
