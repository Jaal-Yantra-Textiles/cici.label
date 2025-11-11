import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export const config = { matcher: "/" };

export async function middleware(req: NextRequest) {
  // const down = await get('down');
  // // NextResponse.json requires at least Next v13.1 or
  // // enabling experimental.allowMiddlewareResponseBody in next.config.js
  // if (down){
  //   req.nextUrl.pathname = `/down`;
  //   return NextResponse.rewrite(req.nextUrl)
  // }
  return NextResponse.next();
}
