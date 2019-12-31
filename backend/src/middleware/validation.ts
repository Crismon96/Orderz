import { Context } from 'koa';
import ajv from '../types/schemas';

export function isValid(schema: string) {
  const validate = ajv.getSchema(schema);
  if (!validate) {
    throw new Error(`No validation found for schema "${schema}"`);
  }

  return (ctx: Context, next: () => Promise<any>) => {
    if (validate(ctx.request.body)) {
      return next();
    }

    if (validate.errors) {
      return ctx.throw(400, JSON.stringify(validate.errors));
    } else {
      return ctx.throw(400, 'Unknown validation error');
    }
  };
}
