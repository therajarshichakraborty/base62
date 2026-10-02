import { HttpStatus, type HttpStatusCode, getHttpStatusPhrase } from './http';

export interface IApiResponse<T = unknown> {
    success: boolean;
    statusCode: HttpStatusCode;
    message: string;
    data: T;
}

export class ApiResponse<T = unknown> {
    public readonly statusCode: HttpStatusCode;
    public readonly data: T;
    public readonly message: string;
    public readonly success: boolean;

    constructor(statusCode: HttpStatusCode, data: T, message?: string) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message || getHttpStatusPhrase(statusCode);
        this.success = statusCode < 400;
    }

    public static ok<T>(data: T, message?: string): ApiResponse<T> {
        return new ApiResponse(HttpStatus.OK, data, message);
    }

    public static success<T>(data: T, message?: string, statusCode: HttpStatusCode = HttpStatus.OK): ApiResponse<T> {
        return new ApiResponse(statusCode, data, message);
    }

    public static created<T>(data: T, message?: string): ApiResponse<T> {
        return new ApiResponse(HttpStatus.CREATED, data, message);
    }

    public static accepted<T>(data: T, message?: string): ApiResponse<T> {
        return new ApiResponse(HttpStatus.ACCEPTED, data, message);
    }

    public static noContent(message?: string): ApiResponse<null> {
        return new ApiResponse(HttpStatus.NO_CONTENT, null, message);
    }

    public toJSON(): IApiResponse<T> {
        return {
            success: this.success,
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
        };
    }

    public toResponse(headers?: HeadersInit): Response {
        if (this.statusCode === HttpStatus.NO_CONTENT) {
            return new Response(null, {
                status: this.statusCode,
                headers,
            });
        }

        return Response.json(this.toJSON(), {
            status: this.statusCode,
            headers,
        });
    }
}
