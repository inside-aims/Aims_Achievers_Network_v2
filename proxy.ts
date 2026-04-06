import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isOrganizerRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/events/new(.*)",
]);

export const proxy = convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    if (
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
