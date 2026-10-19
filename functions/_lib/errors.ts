export type GatewayErrorCode =
  | 'bad_request'
  | 'not_found'
  | 'bad_gateway'
  | 'service_unavailable';

export class GatewayError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: GatewayErrorCode,
    message: string,
    public readonly retryable = false,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'GatewayError';
  }
}

export function errorResponse(error: unknown): Response {
  const gateway = error instanceof GatewayError
    ? error
    : new GatewayError(503, 'service_unavailable', 'The public archive is temporarily unavailable.', true, error);
  return Response.json(
    { error: gateway.code, message: gateway.message, retryable: gateway.retryable },
    {
      status: gateway.status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': gateway.retryable ? 'no-store' : 'public, max-age=10',
      },
    },
  );
}

export function methodNotAllowed(): Response {
  return Response.json(
    { error: 'method_not_allowed', message: 'Only GET requests are supported.', retryable: false },
    { status: 405, headers: { Allow: 'GET', 'Cache-Control': 'no-store' } },
  );
}
