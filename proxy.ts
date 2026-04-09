import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isOrganizerRoute = createRouteMatcher([
  "/admin(.*)",
  "/user(.*)",
  "/dashboard(.*)",
  "/events/new(.*)",
]);

// TODO: set to false before shipping
const BYPASS_AUTH_FOR_TESTING = true;

export const proxy = convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    if (
      !BYPASS_AUTH_FOR_TESTING &&
      isOrganizerRoute(request) &&
      !(await convexAuth.isAuthenticated())
    ) {
      return nextjsMiddlewareRedirect(request, "/login");
    }
  },
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
