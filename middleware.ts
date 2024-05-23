import acceptLanguage from "accept-language";
import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { cookieName, languages } from "./app/i18n/settings";

acceptLanguage.languages(languages);
const apiAuthPrefix = "/api/auth";
export default withAuth(async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const token = await getToken({ req });
  const isAuthenticated = true;

  if (
    req.nextUrl.pathname.indexOf("icon") > -1 ||
    req.nextUrl.pathname.indexOf("chrome") > -1
  )
    return NextResponse.next();
  let lng: string | undefined | null;
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  // if (!lng) lng = fallbackLn;

  // Redirect if lng in path is not supported

  if (isApiAuthRoute) return;

  if (!isAuthenticated) {
    return Response.redirect(new URL("/weather", nextUrl));
  }

  if (isAuthenticated) {
    if (
      !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
      !req.nextUrl.pathname.startsWith("/_next")
    ) {
      return NextResponse.redirect(
        new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
      );
    }
    return null;
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer") || "");
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }
  return null;
  // return NextResponse.next();
});

export const config = {
  matcher: [
    // "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)",
    "/",
    "/en",
    "/de",
    "/api/auth",
    // "/weather",
  ],
};
