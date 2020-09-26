import { NextApiRequest, NextApiResponse } from "next";

export type Locations = "body" | "query";

export interface ValidatedNextApiRequestBody<S> extends NextApiRequest {
  body: S;
}

export interface ValidatedNextApiRequestQuery<S extends {}>
  extends NextApiRequest {
  query: S;
}

export type ValidatedNextApiRequest<S, L extends Locations> = L extends "body"
  ? ValidatedNextApiRequestBody<S>
  : ValidatedNextApiRequestQuery<S>;

export type ValidatedNextApiHandler<S, L extends Locations> = (
  req: ValidatedNextApiRequest<S, L>,
  res: NextApiResponse
) => void;
