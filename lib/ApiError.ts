import { HttpStatus, type HttpStatusCode, getHttpStatusPhrase } from './http';

export interface IApiError {
    success: false;
    statusCode: HttpStatusCode;
    message: string;
    errors: unknown[];
    data: null;
    stack?: string;
}

export class ApiError extends Error {
    public readonly statusCode: HttpStatusCode;
    public readonly success: false = false;
    public readonly errors: unknown[];
    public readonly data: null = null;

    constructor(
        statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
        message?: string,
        errors: unknown[] = [],
        stack?: string
    ) {
        super(message || getHttpStatusPhrase(statusCode));
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = null;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    public static badRequest(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.BAD_REQUEST, message, errors);
    }

    public static unauthorized(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.UNAUTHORIZED, message, errors);
    }

    public static paymentRequired(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.PAYMENT_REQUIRED, message, errors);
    }

    public static forbidden(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.FORBIDDEN, message, errors);
    }

    public static notFound(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.NOT_FOUND, message, errors);
    }

    public static methodNotAllowed(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.METHOD_NOT_ALLOWED, message, errors);
    }

    public static notAcceptable(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.NOT_ACCEPTABLE, message, errors);
    }

    public static requestTimeout(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.REQUEST_TIMEOUT, message, errors);
    }

    public static conflict(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.CONFLICT, message, errors);
    }

    public static gone(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.GONE, message, errors);
    }

    public static payloadTooLarge(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.PAYLOAD_TOO_LARGE, message, errors);
    }

    public static unsupportedMediaType(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.UNSUPPORTED_MEDIA_TYPE, message, errors);
    }

    public static unprocessableEntity(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, message, errors);
    }

    public static tooManyRequests(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.TOO_MANY_REQUESTS, message, errors);
    }

    public static internal(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message, errors);
    }

    public static notImplemented(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.NOT_IMPLEMENTED, message, errors);
    }

    public static badGateway(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.BAD_GATEWAY, message, errors);
    }

    public static serviceUnavailable(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.SERVICE_UNAVAILABLE, message, errors);
    }

    public static gatewayTimeout(message?: string, errors: unknown[] = []): ApiError {
        return new ApiError(HttpStatus.GATEWAY_TIMEOUT, message, errors);
    }

    public static isApiError(error: unknown): error is ApiError {
        return error instanceof ApiError;
    }

    public static from(error: unknown, fallbackMessage?: string): ApiError {
        if (error instanceof ApiError) {
            return error;
        }

        if (
            error &&
            typeof error === 'object' &&
            'issues' in error &&
            Array.isArray((error as { issues: unknown[] }).issues)
        ) {
            return new ApiError(
                HttpStatus.UNPROCESSABLE_ENTITY,
                fallbackMessage ?? 'Validation failed',
                (error as { issues: unknown[] }).issues
            );
        }

        if (error instanceof Error) {
            return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, error.message || fallbackMessage, [], error.stack);
        }

        if (typeof error === 'string') {
            return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, error);
        }

        return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, fallbackMessage ?? 'An unexpected error occurred');
    }

    public toJSON(): IApiError {
        return {
            success: this.success,
            statusCode: this.statusCode,
            message: this.message,
            errors: this.errors,
            data: this.data,
            ...(process.env.NODE_ENV !== 'production' && this.stack ? { stack: this.stack } : {}),
        };
    }

    public toResponse(headers?: HeadersInit): Response {
        return Response.json(this.toJSON(), {
            status: this.statusCode,
            headers,
        });
    }
}
