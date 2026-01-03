import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/cadastro", "/favicon.ico"];

const isPublicPath = (pathname: string) => PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

function resolvePath(pathname: string) {
  if (pathname.startsWith("/_next/data/")) {
    // Remove build-id segment and trailing .json to obtain the intended route
    const cleaned = pathname
      .replace(/^\/_next\/data\/[^/]+/, "")
      .replace(/\.json$/, "");
    return cleaned || "/";
  }
  return pathname;
}

export function middleware(req: NextRequest) {
  const rawPath = req.nextUrl.pathname;
  const pathname = resolvePath(rawPath);

  // Log para teste no terminal (alert não funciona no servidor/middleware)
  console.log(`[Middleware] Acessando: ${pathname}`);

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("authToken")?.value;
  const userType = req.cookies.get("userType")?.value; // "1" cliente, "2" profissional

  const redirectToLogin = () => {
    console.log(`[Middleware] Redirecionando para login: ${pathname} (Token: ${!!token}, Type: ${userType})`);
    return NextResponse.redirect(new URL("/login", req.url));
  };

  const isClientArea = pathname === "/client" || pathname.startsWith("/client/");
  const isProfessionalArea = pathname === "/professional" || pathname.startsWith("/professional/");

  if (isClientArea) {
    if (!token || !userType || userType !== "1") {
      return redirectToLogin();
    }
    return NextResponse.next();
  }

  if (isProfessionalArea) {
    if (!token || !userType || userType !== "2") {
      return redirectToLogin();
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Executa em todas as rotas, exceto assets/_next/api, e aplica regra apenas para /client e /professional
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};

