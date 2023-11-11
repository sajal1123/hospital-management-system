const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const verifyAccessToken = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;

    console.log(accessToken);
    console.log(process.env.JWT_SECRET);
    if (!accessToken) {
      return res.status(401).json("Unauthorized! Access token is missing");
    }

    const token = accessToken.split(" ")[1];
    console.log(token);

    const verified = jwt.verify(accessToken, process.env.JWT_SECRET);
    if (verified) {
      req.authPayload = verified;
      next();
    } else {
      console.error(err);
      console.log("Going back");
      return res.status(401).json("Invalid access token");
    }
  } catch (err) {
    console.error(err);
    return res.status(401).json("Invalid access token");
  }
};

module.exports = verifyAccessToken;
