import { NextApiHandler, NextApiRequest } from "next";

type Promisable<T> = T | Promise<T>;

export interface AuthenticatedOptions {
  fn: NextApiHandler;
  authenticate(
    req: NextApiRequest
  ): Promisable<boolean | { code: number; message: string }>;
}

export const authenticated = ({ fn, authenticate }): NextApiHandler => async (
  req,
  res
) => {
  const authed = await authenticate(req);

  if (!authed)
    return res.status(401).json({ code: 401, message: "Unauthorized" });
  else if (authed === true) return fn(req, res);
  else return res.status(authed.code).json(authed);
};
