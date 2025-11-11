import { NextRequest, NextResponse } from "next/server";

export const config = { matcher: "/" };

export async function middleware(req: NextRequest) {
  // Middleware placeholder - add custom logic here if needed
  return NextResponse.next();
}
