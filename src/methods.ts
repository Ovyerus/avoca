import { NextApiHandler } from "next";

import { authenticated, AuthenticatedOptions } from "./authenticated";

export const methods = (methodHandlers: {
  [key: string]: NextApiHandler | AuthenticatedOptions;
}): NextApiHandler => (req, res) => {
  const method = req.method!.toLowerCase();
  const handler = methodHandlers[method];

  if (methodHandlers[method])
    if (typeof handler === "function") return handler(req, res);
    else return authenticated(handler)(req, res);
  else
    res
      .status(405)
      .json({ code: 405, message: "Method not available on this endpoint" });
};
