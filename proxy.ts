import { auth } from "./auth"
import { NextRequest, NextResponse } from "next/server";

 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const session = auth();
  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}


// export default auth((req) => {
//   if (!req.auth) {
//     return Response.redirect(new URL("/", req.url));
//   }
// });

export const config = {
  matcher: ["/conversations/:path*", "/users/:path*"],
};