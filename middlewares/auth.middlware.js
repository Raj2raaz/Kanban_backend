import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // Adjust the path to your User model

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("Full Authorization Header:", authHeader);
  // console.log("Token:", authHeader?.split(" ")[1]);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token: ", decoded)

    // Attach the user object to the request
    const user = await User.findById(decoded.userId).select("-password"); // Exclude the password field
    // console.log("Found User:", user); // Log the found user
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
