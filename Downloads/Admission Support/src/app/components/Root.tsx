import { Outlet, useLocation, ScrollRestoration } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Root() {
  const location = useLocation();


  const isLoginPage = location.pathname === "/login";
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  const hideChrome = isLoginPage || isDashboardPage;

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollRestoration />
      {!hideChrome && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}
