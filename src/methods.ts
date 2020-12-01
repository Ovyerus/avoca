import { NextApiHandler } from "next";

import { authenticated, AuthenticatedOptions } from "./authenticated";
import { handleError } from "./handleError";

export const methods = (methodHandlers: {
  [key: string]: NextApiHandler | AuthenticatedOptions;
}): NextApiHandler => (req, res) => {
  const method = req.method!.toLowerCase();
  const handler = methodHandlers[method];

  if (methodHandlers[method])
    if (typeof handler === "function") return handleError(handler)(req, res);
    else return authenticated(handler)(req, res);
  else
    res
      .status(405)
      .json({ code: 405, message: "Method not available on this endpoint" });
};
