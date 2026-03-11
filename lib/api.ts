import { NextResponse } from "next/server";

export function jsonResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorized(message = "Unauthorized") {
  return errorResponse(message, 401);
}

export function forbidden(message = "Forbidden") {
  return errorResponse(message, 403);
}
