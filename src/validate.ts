import { z } from "zod";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import type { ValidatedNextApiHandler } from "./types";

export interface ValidateOptions<
  B extends z.ZodObject<any>,
  Q extends z.ZodObject<any>
> {
  bodySchema?: B;
  querySchema?: Q;
  onValidationError?(
    error: z.ZodError,
    location: "body" | "query",
    req: NextApiRequest,
    res: NextApiResponse
  ): void;
}

export const validate =
  <B extends z.ZodObject<any>, Q extends z.ZodObject<any>>(
    {
      bodySchema,
      querySchema,
      onValidationError = (err, _, __, res) =>
        res.status(400).json({ code: 400, error: err.issues }),
    }: ValidateOptions<B, Q>,
    handler: ValidatedNextApiHandler<z.infer<B>, z.infer<Q>>
  ): NextApiHandler =>
  (req, res) => {
    if (bodySchema) {
      const result = bodySchema.safeParse(req.body);

      if (!result.success)
        return onValidationError(result.error, "body", req, res);
      else req.body = result.data;
    }

    if (querySchema) {
      const result = querySchema.safeParse(req.body);

      if (!result.success)
        return onValidationError(result.error, "query", req, res);
      else req.query = result.data;
    }

    return handler(req, res);
  };
