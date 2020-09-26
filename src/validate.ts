import type Joi from "joi";
import type { NextApiHandler } from "next";

import type {
  Locations,
  ValidatedNextApiHandler,
  ValidatedNextApiRequest,
} from "./types";

export interface ValidateOptions {
  schema: Joi.Schema;
  location?: Locations;
}

const validate = <S = any, L extends Locations = "body">(
  { schema, location = "body" }: ValidateOptions,
  handler: ValidatedNextApiHandler<S, L>
): NextApiHandler => (req, res) => {
  const { error, value } = schema.validate(req[location]);
  req.body = value; // Joi changes some values depending on schema, set that as body

  if (!error) return handler(req as ValidatedNextApiRequest<S, L>, res);
  else res.status(400).json({ code: 400, message: error.message });
};

export default validate;
