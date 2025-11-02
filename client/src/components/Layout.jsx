import { Outlet } from "react-router-dom";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

export default function Layout({ user }) {
  return (
    <div className="page-wrapper">
      <Header user={user} />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
