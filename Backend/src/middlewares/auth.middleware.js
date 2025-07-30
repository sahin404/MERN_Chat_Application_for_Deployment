import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    //if token is not found
    if (!token) {
      return res
        .status(400)
        .json({ message: "Unauthorized Access. No token Provided!" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    //if token is invalid
    if (!decoded) {
      return res
        .status(400)
        .json({ message: "Unauthorized Access. Invalid Token!" });
    }

    const user = await User.findById(decoded.id).select("-password");

    //if user is not found
    if (!user) {
      return res
        .status(400)
        .json({ message: "Unauthorized Access. Invalid Token!" });
    }

    req.user = user;

    //call next function
    next();
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(500).send("Internal Server Errors");
  }
};
