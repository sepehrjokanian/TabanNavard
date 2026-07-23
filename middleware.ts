import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isAdminRoute || isLoginPage) return;

  const session = req.auth;

  if (!session || !session.user || session.user.isActive === false) {
    return Response.redirect(
      new URL(`/admin/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
    );
  }

  const role = session.user.role;

  if (role === "SUB_ADMIN") {
    if (
      pathname === "/admin" ||
      pathname.startsWith("/admin/dashboard") ||
      pathname.startsWith("/admin/certificates") ||
      pathname.startsWith("/admin/content") ||
      pathname.startsWith("/admin/team") ||
      pathname.startsWith("/admin/logs") ||
      pathname.startsWith("/admin/products/new")
    ) {
      return Response.redirect(new URL("/admin/products", req.url));
    }
  }
});

export const config = { matcher: ["/admin/:path*"] };