import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";
import { NODE_ENV } from "./../lib/constant";
import { PrismaError } from "./prisma";


export class AppError extends Error {
	constructor(
		public message: string,
		public statusCode: number = 500,
		public errorCode?: string,
		public details?: Record<string, any>
	) {
		super(message);
		this.name = "AppError";
	}
}
// export class PrismaError extends AppError {
// 	constructor(
// 		public errorCode: string,
// 		public message: string,
// 		public statusCode: number,
// 		public details?: Record<string, any>
// 	) {
// 		super(message,errorCode,statusCode,details);
// 		this.name = "PrismaError";
// 	}
// }

export class ValidationError extends AppError {
	constructor(message: string, details?: Record<string, any>) {
		super(message, 400, "VALIDATION_ERROR", details);
		this.name = "ValidationError";
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = "Resource not found") {
		super(message, 404, "NOT_FOUND");
		this.name = "NotFoundError";
	}
}

export class AuthError extends AppError {
	constructor(message: string = "Forbidden") {
		super(message, 401, "UNAUTHORISED");
		this.name = "UserNotFound";
	}
}
interface ErrorResponse {
	success: false;
	error: {
		message: string;
		code?: string;
		details?: Record<string, any>;
		stack?: string;
	};
}

export const errorHandler = async (
	error: Error,
	c: Context
): Promise<ErrorResponse |any> => {
	 console.error("Error caught in global handler:", error);

	const err = error as Error;
	if (error instanceof PrismaError) {
		return c.json(
			{
				success: false,
				error: {
					code: error.code,
					message: error.message,
					meta: error.meta,
				},
			},
			error.status as ContentfulStatusCode
		);
	}
	if (error instanceof AppError) {
		return c.json(
			{
				success: false,
				error: {
					message: error.message,
					code: error.errorCode,
					details: error.details,
				},
			},
			error.statusCode as ContentfulStatusCode
		);
	}

	if (error instanceof ZodError) {
		// Handle Zod validation errors
		return c.json(
			{
				success: false,
				error: {
					message: "Validation failed",
					code: "VALIDATION_ERROR",
					details: error.errors.map((e) => ({
						path: e.path.join("."),
						message: e.message,
					})),
				},
			},
			400
		);
	}

	if (error instanceof HTTPException) {
		// Handle Hono HTTP exceptions
		return c.json(
			{
				success: false,
				error: {
					message: error.message,
					code: `HTTP_${error.status}`,
				},
			},
			error.status as ContentfulStatusCode
		);
	}

	// Handle unknown errors
	const isDev = NODE_ENV === "development";
	return c.json(
		{
			success: false,
			error: {
				message: isDev ? error.message : "Internal server error",
				...(isDev && { stack: error.stack }),
			},
		},
		500
	);
};
