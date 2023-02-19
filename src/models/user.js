const mongoose = require("mongoose");
const { isNil, omitBy } = require("lodash");
const { hash, compare } = require("bcrypt");
const APIError = require("../errors/api-error");
const config = require("../config/env");
const httpStatus = require("http-status");
const createAccessToken = require("../utils/generateToken");

const roles = ["user", "admin"];

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    dateOfBirth: {
      type: Date,
    },

    mobile: {
      type: Number,
    },

    status: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 128,
    },
    accountType: {
      type: String,
      enum: roles,
      default: config.roles.USER,
    },
  },
  {
    timestamps: true,
  }
);

// pre save hook for user to hash the password
userSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();

    // hash user password with bcrypt
    const pwhash = await hash(this.password, config.bcryptRounds);
    this.password = pwhash;

    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.method({
  async passwordMatches(password, pwhash) {
    return await compare(password, pwhash);
  },

  transform() {
    const transformed = {};
    const fields = [
      "_id",
      "firstName",
      "lastName",
      "email",
      "dateOfBirth",
      "accountType",
      "mobile",
      "status",
      "accountType",
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

userSchema.statics = {
  async get(id) {
    let user;

    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await this.findById(id).exec();
    }
    if (user) {
      return user;
    }

    throw new APIError({
      message: "User does not exist",
      status: httpStatus.NOT_FOUND,
      errors: [
        {
          field: "User",
          location: "body",
          messages: ["User does not exist"],
        },
      ],
      stack: "",
    });
  },

  async findAndGenerateToken(options) {
    if (!options.email) {
      throw new APIError({
        message: "An email is required to generate a token",
        errors: [],
        status: httpStatus.UNAUTHORIZED,
      });
    }

    const user = await this.findOne({
      $and: [
        {
          email: options.email,
        },
        {
          status: true,
        },
      ],
    }).exec();
    console.log(user);

    if (options.password) {
      if (user) {
        if (await user.passwordMatches(options.password, user?.password)) {
          const token = createAccessToken({
            id: user.id,
            email: user.email,
            accountType: user.accountType,
          });

          return {
            token: token,
            accountType: user.accountType,
          };
        } else {
          console.log("password is wrong");
        }
      }

      throw new APIError({
        message: "Invalid Username or password",
        errors: [],
        status: httpStatus.UNAUTHORIZED,
      });
    }

    return {
      token: "",
      accountType: "",
    };
  },

  async resetPasswordCheck(userId, oldPassword) {
    const user = await this.findById(userID);

    if (await user.passwordMatches(oldPassword, user.password)) {
      return true;
    }

    throw new APIError({
      message: "Validation Error",
      errors: [
        {
          field: "password",
          location: "password",
          messages: ["old password you enterd was incorrect"],
        },
      ],
      status: httpStatus.BAD_REQUEST,
    });
  },

  // get all users in a list with pagination
  list({ page = 1, perPage = 30, name, email, role }) {
    const options = omitBy({ name, email, role }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  // Check if the user email is a duplicate
  checkDuplicateEmail(error) {
    console.log(error.name, error.code);

    if (error.name === "MongoServerError" && error.code === 11000) {
      return new APIError({
        message: "Validation Error",
        errors: [
          {
            field: "email",
            location: "body",
            messages: ['"email" already exists'],
          },
        ],
        stack: error.stack,
        status: httpStatus.CONFLICT,
      });
    }
    return error;
  },
};

module.exports = mongoose.model("User", userSchema);
