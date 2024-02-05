const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const StatusCodes = require("http-status-codes");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name }, token: user.genToken() });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Useremail");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Password");
  }
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, token: user.genToken() });
};

module.exports = {
  register,
  login,
};
