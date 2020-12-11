import { NextApiRequest, NextApiResponse } from "next";

export interface ValidatedNextApiRequest<
  B = any,
  Q extends {} = NextApiRequest["query"]
> extends NextApiRequest {
  body: B;
  query: Q;
}

export type ValidatedNextApiHandler<
  B = any,
  Q extends {} = NextApiRequest["query"]
> = (req: ValidatedNextApiRequest<B, Q>, res: NextApiResponse) => void;
