const User = require("../../models/user");
const { hash } = require("bcrypt");

const getUsers = async (req, res) => {
  const users = await User.list(req.query);
  const transformedUsers = users.map((user) => user.transform());
  res.json(transformedUsers);
};

const createUser = async (req, res, next) => {
  try {
    const user = new User(req.body);
    user.status = true;
    const savedUser = await user.save();
    res.json(savedUser.transform());
  } catch (err) {
    next(User.checkDuplicateEmail(err));
  }
};

const userAuth = async (req, res, next) => {
  try {
    const { token, accountType } = await User.findAndGenerateToken({
      email: req.body?.email,
      password: req.body?.password,
    });
    res.json({
      token: token,
      accountType: accountType,
      email: req.body.email,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers: getUsers,
  createUser: createUser,
  userAuth: userAuth,
};
