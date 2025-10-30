import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header/Header";

export default function Layout() {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
