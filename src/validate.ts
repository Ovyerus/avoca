import type Joi from "joi";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import type { ValidatedNextApiHandler, ValidatedNextApiRequest } from "./types";

export interface ValidateOptions {
  bodySchema?: Joi.Schema;
  querySchema?: Joi.Schema;
  onValidationError?(
    error: Joi.ValidationError,
    location: "body" | "query",
    req: NextApiRequest,
    res: NextApiResponse
  ): void;
}

export const validate = <B = any, Q extends {} = NextApiRequest["query"]>(
  {
    bodySchema,
    querySchema,
    onValidationError = (err, _, __, res) =>
      res.status(400).json({ code: 400, message: err.message }),
  }: ValidateOptions,
  handler: ValidatedNextApiHandler<B, Q>
): NextApiHandler => (req, res) => {
  const { error: bodyError, value: bodyValue } =
    bodySchema?.validate(req.body) ?? {};
  const { error: queryError, value: queryValue } =
    querySchema?.validate(req.query) ?? {};

  if (bodyError) return onValidationError(bodyError, "body", req, res);
  if (queryError) return onValidationError(queryError, "query", req, res);

  if (bodyValue) req.body = bodyValue;
  if (queryValue) req.query = queryValue;

  return handler(req as ValidatedNextApiRequest<B, Q>, res);
};
