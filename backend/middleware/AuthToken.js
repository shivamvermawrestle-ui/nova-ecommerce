import jwt from "jsonwebtoken";

const authToken = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;
  const token = req.cookies?.token || bearerToken;

  if (!token) {
    return res.status(401).json({
      message: "Please log in.",
      success: false,
    });
  }

  if (!process.env.JSON_SECRET_KEY) {
    return res.status(500).json({
      message: "Authentication is not configured on the server.",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JSON_SECRET_KEY);

    if (!decoded?._id) {
      return res.status(401).json({
        message: "Your session is invalid. Please log in again.",
        success: false,
      });
    }

    req.userId = String(decoded._id);
    return next();
  } catch {
    return res.status(401).json({
      message: "Your session has expired. Please log in again.",
      success: false,
    });
  }
};

export default authToken;
