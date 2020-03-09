import { HttpCodes } from './httpCodes';

export interface ServerErrorResponse<E> {
  status: 'error';
  errorMessage: E;
  errorData?: any;
}

export interface ServerOkResponse<T> {
  status: 'ok';
  data: T;
}

export const sendOk = <T>(props: { ctx: any; data: T }) => {
  const { ctx, data } = props;
  const dataJSON = JSON.parse(JSON.stringify(data)); // to convert Date objects -> strings
  ctx.response.body = dataJSON;
  ctx.response.status = HttpCodes.OK;
};

export const sendError = <E>(props: { ctx: any; errorMessage: E; httpCode?: number; errorData?: any }) => {
  const { ctx, errorMessage, errorData, httpCode = HttpCodes.BadRequest } = props;

  const errorResponse: ServerErrorResponse<any> = {
    status: 'error',
    errorMessage,
    errorData,
  };

  ctx.response.body = errorResponse;
  ctx.response.status = httpCode;
};

export const sendBadRequest = <T extends string>(props: { ctx: any; errorMessage?: T }) =>
  sendError({
    ctx: props.ctx,
    errorMessage: props.errorMessage || 'Bad request',
    httpCode: HttpCodes.BadRequest,
  });

export const send404 = <T extends string>(props: { ctx: any; errorMessage?: T }) =>
  sendError({
    ctx: props.ctx,
    errorMessage: props.errorMessage || 'Not found',
    httpCode: HttpCodes.NotFound,
  });

export const send500 = <T extends string>(props: { ctx: any; errorMessage?: T }) =>
  sendError({
    ctx: props.ctx,
    errorMessage: props.errorMessage || 'Internal server error',
    httpCode: HttpCodes.InternalServerError,
  });
