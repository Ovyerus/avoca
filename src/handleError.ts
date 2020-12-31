import { NextApiHandler } from "next";

export const handleError = (fn: NextApiHandler): NextApiHandler => async (
  req,
  res
) => {
  try {
    return await fn(req, res);
  } catch (err) {
    const response = {
      code: 500,
      message: err.message,
      stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
    };

    console.error(err);
    res.status(500).json(response);
  }
};
