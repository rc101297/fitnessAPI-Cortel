//[SECTION] Dependencies and Modules
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");
const { errorHandler } = require("../auth.js");

// User Registration
module.exports.registerUser = (req, res) => {
  if (!req.body.email.includes("@")) {
    return res.status(400).send({ message: "Invalid email format" });
  } else if (req.body.password.length < 8) {
    return res
      .status(400)
      .send({ message: "Password must be atleast 8 characters long" });
  } else {
    // Check for existing user with the same email
    return User.findOne({ email: req.body.email })
      .then((existingUser) => {
        if (existingUser) {
          return res.status(409).send({ message: "Email already exists!" });
        } else {
          let newUser = new User({
            email: req.body.email,
            // 10 is the value provided as the number of "salt" rounds that the bcrypt algorithm will run in order to encrypt the password
            password: bcrypt.hashSync(req.body.password, 10),
          });

          return newUser
            .save()
            .then(() =>
              res.status(201).send({
                message: "Registered successfully",
              })
            )
            .catch((error) => errorHandler(error, req, res));
        }
      })
      .catch((error) => errorHandler(error, req, res));
  }
};

//User Login
module.exports.loginUser = (req, res) => {
  if (req.body.email.includes("@")) {
    return User.findOne({ email: req.body.email })
      .then((result) => {
        if (result == null) {
          return res.status(404).send({ message: "No email found" });
        } else {
          const isPasswordCorrect = bcrypt.compareSync(
            req.body.password,
            result.password
          );

          if (isPasswordCorrect) {
            return res.status(200).send({
              message: "User logged in successfully",
              access: auth.createAccessToken(result),
            });
          } else {
            return res
              .status(401)
              .send({ message: "Incorrect email or password" });
          }
        }
      })

      .catch((error) => errorHandler(error, req, res));
  } else {
    return res.status(400).send({ message: "Invalid email format" });
  }
};

//User Details
module.exports.getUserDetails = (req, res) => {
  return User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(403).send({ message: "invalid signature" });
      } else {
        const userObject = user.toObject();

        delete userObject.password;

        return res.status(200).send({ user: userObject });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};
