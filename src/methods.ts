import { NextApiHandler } from "next";

import { handleError } from "./handleError";

export const methods = (methodHandlers: {
  [key: string]: NextApiHandler;
}): NextApiHandler => (req, res) => {
  const method = req.method.toLowerCase();
  const handler = methodHandlers[method];

  if (methodHandlers[method]) return handleError(handler)(req, res);
  else
    res
      .status(405)
      .json({ code: 405, message: "Method not available on this endpoint" });
};
